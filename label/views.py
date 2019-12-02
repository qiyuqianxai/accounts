# -*- coding: utf8 -*-

# Create your views here.
#from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.http import HttpResponse,HttpResponseRedirect
import os
import json
import numpy as np
import base64
# import git
import time
import sys
from label.re_ranking import re_ranking

def index(request):
    return HttpResponseRedirect('/static/web/index_reid_label.html')

def reid_distance(feat_i, feat_j):
    return np.inner(feat_i, feat_j) / (np.linalg.norm(feat_i) * np.linalg.norm(feat_j))


def get_database_camera_list(request):

    if "user_name" not in request.session:
        print("未登陆")
        ret_json = {
            'code': "get_database_camera_list",
            'message': '未登陆',
            'result': False,
            'data': None
        }
        response = JsonResponse(ret_json)
        response.status_code = 403
        return response

    # all_database_folder = '/data/nasdata/data/'
    # all_database_folder = '/data/'
    all_database_folder = '/data/nasdata/data/'
    # g_database_list_json = sorted(os.listdir(all_database_folder))
    # database_list = ['pic_liangjiang_181115',
    #                 'pic_liangjiang_181119',
    #                 'pic_205',
    #                 'pic_206',
    #                 'pic_209',
    #
    #                  ]

    # database_list = [
    #                  'pic_liangjiang_181207',
    #                  'pic_liangjiang_181207_1',
    #                  'pic_liangjiang_181207_2',
    #                  'pic_206_181224',
    #                  'pic_209_181224',
    #                  ]

    database_list = [
        'pic_209_190117',
        'pic_205_20190118',
        'pic_206_20190121',
        'pic_baiyun_190124',
    ]

    # database_list = ['pic_liangjiang_181115']
    database_camera_list = []
    for database_name in database_list:
        if database_name == 'pic_liangjiang_181119':
            camera_list = ['20171107_205',
                            '20171108_205',
                            '20171109_205',]
        elif database_name == 'pic_205':
            camera_list = ['20181114',
                           '20181115',
                           '20181116', ]
        else:
            camera_list = [x for x in sorted(os.listdir(os.path.join(all_database_folder, database_name))) if str(x).isnumeric()]


        # camera_list = [x for x in os.listdir(os.path.join(all_database_folder, database_name)) if unicode(x).isnumeric()]
        # patch_folder = os.path.join(all_database_folder, database_name, "mot", "patch")
        # for sub_folder_name in sorted(os.listdir(patch_folder)):
        #     if os.path.isdir(os.path.join(patch_folder, sub_folder_name)) and sub_folder_name != ".git" and (not sub_folder_name.startswith('merged')):
        #         if sub_folder_name[:4] not in camera_list:
        #             camera_list.append(sub_folder_name[:4])
        database_camera_list.append(camera_list)
    pass
    # database_list.append('test')
    # database_video_list.append(['a', 'b'])
    #database_video_list.append(['c', 'd'])
    resp = {}
    resp['database_list'] = database_list
    resp['database_camera_list'] = database_camera_list
    resp_jsondata = json.dumps(resp)
    return HttpResponse(resp_jsondata)

def get_video_labelperson_list_helper(current_database_name, current_camera_name, current_labelperson):
    video_list = []
    vieo_labelperson_list = []
    #TODO: show for liangjiang
    all_database_folder = '/data/nasdata/data/'
    # all_database_folder = '/data/'
    patch_folder = os.path.join(all_database_folder, current_database_name, current_camera_name)

    for sub_folder_name in sorted(os.listdir(patch_folder)):
        if os.path.isdir(os.path.join(patch_folder, sub_folder_name)):
            # if sub_folder_name.startswith(current_camera_name):
            if str(sub_folder_name).isnumeric():
            # if sub_folder_name == '20901':
            #     video_list.append(sub_folder_name)
                if os.path.exists(os.path.join(patch_folder, sub_folder_name + '_mot_merge_final_feat.npy')):
                    # print(os.path.join(patch_folder, sub_folder_name + '_mot_merge_final_feat.npy'))
                    # print(os.path.getsize(os.path.join(patch_folder, sub_folder_name + '_mot_merge_final_feat.npy')))
                    if os.path.getsize(os.path.join(patch_folder, sub_folder_name + '_mot_merge_final_feat.npy')) >= 410000:

                        video_list.append(sub_folder_name)

    for video_name in video_list:
        video_folder = os.path.join(patch_folder, 'label_all', video_name)

        if not os.path.exists(video_folder):
            print('not os.path.exists(video_folder)')
            print('find cluster result, make folder')
            os.makedirs(video_folder)
            # if os.path.exists(os.path.join(patch_folder, video_name + '_mot_merge_final_feat.npy')):
            #     print('find cluster result, make folder')
            #     os.makedirs(video_folder)
            # else:
            #     continue

        if not os.path.exists(os.path.join(video_folder, current_labelperson + "_label_result.json")):
            with open(os.path.join(video_folder, current_labelperson + "_label_result.json"), "w") as f:
                #TODO: better name result
                # if os.path.exists(os.path.join(video_folder, '10000_mot_fix_time_filter_hard_all_index_hard.json')):
                #     with open(os.path.join(video_folder, '10000_mot_fix_time_filter_hard_all_index_hard.json'), 'r') as f_read:
                #         result = json.load(f_read)
                # else:
                #     result = {}
                result = {}
                json.dump({"result": result}, f)
        labelperson_list = []
        for file_name in sorted(os.listdir(video_folder)):
            if file_name.endswith("_label_result.json"):
                labelperson_list.append(file_name[:-18])
        vieo_labelperson_list.append(labelperson_list)
    return video_list, vieo_labelperson_list


def add_id_index(all_index_dict, last_corrected_id_index, id_need_add_list):
    if id_need_add_list.__len__() == 0:
        return all_index_dict
    all_same_id_index = [last_corrected_id_index]

    # last label result contain all friends of last_corrected_id_index and they all friend each other
    if last_corrected_id_index in all_index_dict:
        all_same_id_index += all_index_dict[last_corrected_id_index]

    # friend's friend is friend
    all_same_id_index += id_need_add_list
    for index in id_need_add_list:
        index_friend = []
        if index in all_index_dict:
            index_friend = all_index_dict[index]
        all_same_id_index += index_friend

    # might include repeat index
    all_same_id_index = list(set(all_same_id_index))
    for i, index in enumerate(all_same_id_index):
        if i==0:
            all_index_dict[index] = all_same_id_index[1:]
        elif i == all_same_id_index.__len__() - 1:
            all_index_dict[index] = all_same_id_index[:-1]
        else:
            all_index_dict[index] = all_same_id_index[:i] + all_same_id_index[i + 1:]

    return all_index_dict

def delete_id_index(all_index_dict, last_corrected_id_index, id_need_delete_list):
    if id_need_delete_list.__len__() == 0:
        return all_index_dict

    # label result contain all friends of last_corrected_id_index and they all friend each other
    # so delete id index mean divide friends of last_corrected_id_index into two friend group
    # friend relation within id_need_delete_list is unknown so keep they are friend as past label result do
    still_same_id_index_list = [x for x in all_index_dict[last_corrected_id_index] if x not in id_need_delete_list]
    still_same_id_index_list += [last_corrected_id_index]
    if still_same_id_index_list.__len__() == 1:
        all_index_dict.pop(last_corrected_id_index)
    else:
        for i, index in enumerate(still_same_id_index_list):
            if i==0:
                all_index_dict[index] = still_same_id_index_list[1:]
            elif i == still_same_id_index_list.__len__() - 1:
                all_index_dict[index] = still_same_id_index_list[:-1]
            else:
                all_index_dict[index] = still_same_id_index_list[:i] + still_same_id_index_list[i + 1:]

        # when multi label, the prefect group assumption is invalid so not assume their relationship
        # if id_need_delete_list.__len__() == 1:
        #     if id_need_delete_list[0] in all_index_dict:
        #         all_index_dict.pop(id_need_delete_list[0])
        # else:
        #     for i, index in enumerate(id_need_delete_list):
        #         if i==0:
        #             all_index_dict[index] = id_need_delete_list[1:]
        #         elif i == id_need_delete_list.__len__() - 1:
        #             all_index_dict[index] = id_need_delete_list[:-1]
        #         else:
        #             all_index_dict[index] = id_need_delete_list[:i] + id_need_delete_list[i + 1:]
    for id_need_delete in id_need_delete_list:
        assert(id_need_delete in all_index_dict)
        for still_same_id_index in still_same_id_index_list:
            if still_same_id_index in all_index_dict[id_need_delete]:
                all_index_dict[id_need_delete].remove(still_same_id_index)
        if all_index_dict[id_need_delete].__len__() == 0:
            all_index_dict.pop(id_need_delete)

    return all_index_dict
import time
def get_all_data(request):

    if "user_name" not in request.session:
        print("未登陆")
        ret_json = {
            'code': "get_all_data",
            'message': '未登陆',
            'result': False,
            'data': None
        }
        response = JsonResponse(ret_json)
        response.status_code = 403
        return response
    t0=time.time()
    req_json = json.loads(request.body)
    current_database_name = req_json['current_database_name']
    current_camera_name = req_json['current_camera_name']
    current_video_name = req_json['current_video_name']
    current_labelperson_name = req_json['current_labelperson_name']
    current_id_index = int(req_json['current_id_index'])
    current_user_name = request.session["user_name"]
    video_list, vieo_labelperson_list = get_video_labelperson_list_helper(current_database_name, current_camera_name, current_user_name)
    t1 = time.time()
    #when init, video and label value is empty
    if not current_video_name:
        current_video_name = video_list[0]  # TODO: a lot of place need to chech empty
        current_labelperson_name = ""

    if not current_labelperson_name:
        current_labelperson_name = vieo_labelperson_list[0][0]
        current_id_index = 0

    last_corrected_id_index = int(req_json['last_corrected_id_index'])
    last_corrected_same_id_name_list_json = req_json['last_corrected_same_id_name_list_json']
    trigger_by_button = req_json['trigger_by_button']
    is_bad_quality = req_json['is_bad_quality']
    is_jump_labeled_ones = req_json['is_jump_labeled_ones']
    t2 = time.time()
    all_database_folder = '/data/'
    all_database_folder = '/data/nasdata/data'
    patch_folder = os.path.join(all_database_folder, current_database_name, current_camera_name)
    current_label_file = os.path.join(patch_folder, 'label_all', current_video_name, current_labelperson_name + "_label_result.json")

    if ((not os.path.exists(current_label_file)) or (not os.path.getsize(current_label_file))):
        with open(current_label_file, "w") as f:
            result = {}
            history_index = []
            json.dump({"result": result, "history_index": history_index}, f)
    t3 = time.time()
    #https://stackoverflow.com/questions/1450957/pythons-json-module-converts-int-dictionary-keys-to-strings
    def jsonKeys2int(x):
        if isinstance(x, dict):
            return {int(k): v for k, v in x.items()}
        return x
    with open(current_label_file, "r") as f:
        label_result = json.load(f)
    t4 = time.time()
    all_index_dict = jsonKeys2int(label_result["result"])

    if "history_index" in label_result:
        all_history_index = label_result["history_index"]
        all_history_index = [int(x) for x in all_history_index]
    else:
        all_history_index = []

    if "bad_quality" in label_result:
        all_bad_quality_index = label_result["bad_quality"]
    else:
        all_bad_quality_index = []
    t5 = time.time()
    if last_corrected_id_index >= 0:
        all_history_index.append(last_corrected_id_index)

        with open(current_label_file, "w") as f:
            json.dump({"result": all_index_dict, "history_index": all_history_index, "bad_quality": all_bad_quality_index}, f, indent=1)


    #print("last_corrected_id_index", last_corrected_id_index)
    #print("current_id_index", current_id_index)

    file_prefix = "base2048"  # TODO: reid version

    # video_id_list = np.load(os.path.join(patch_folder, current_video_name, file_prefix + "_id.npy"))
    # feat_list = np.load(os.path.join(patch_folder, current_video_name, file_prefix + "_feat.npy"))
    # TODO:  np_feat_file_name
    # np_feat_file_name = os.path.join(patch_folder, 'label_all', current_video_name, '10000_patch_json_fix_time_filter_hard_merge_feat.npy')
    np_feat_file_name = os.path.join(patch_folder, current_video_name + '_mot_merge_final_feat.npy')
    feat_list = np.load(np_feat_file_name)
    feat_list = feat_list / np.linalg.norm(feat_list, axis=1)[:, np.newaxis]
    # feat_list = np.zeros((6322, 1))
    video_id_list = np.array(range(feat_list.shape[0]))

    # dist_matrix = np.load(os.path.join(patch_folder, current_video_name, file_prefix+"_dist.npy"))
    video_id_str_list = []
    for i in range(video_id_list.shape[0]):
        video_id_str_list.append(str(int(video_id_list[i])))

    t61 = time.time()
    if last_corrected_id_index >= 0:
        bad_quality_change = False
        if is_bad_quality:
            if last_corrected_id_index not in all_bad_quality_index:
                all_bad_quality_index.append(last_corrected_id_index)
                bad_quality_change = True
        if not is_bad_quality:
            if last_corrected_id_index in all_bad_quality_index:
                all_bad_quality_index.remove(last_corrected_id_index)
                bad_quality_change = True

        if last_corrected_id_index not in all_index_dict:
            last_uncorrected_same_id_index_list = []
        else:
            last_uncorrected_same_id_index_list = all_index_dict[last_corrected_id_index]
        print(last_uncorrected_same_id_index_list)

        last_corrected_same_id_index_list_json = []
        for same_id_name in last_corrected_same_id_name_list_json:
            for sub_id_name in same_id_name.split("|"):
                last_corrected_same_id_index_list_json.append(video_id_str_list.index(sub_id_name))

        print(last_corrected_same_id_index_list_json)

        id_need_add_list = [int(x) for x in last_corrected_same_id_index_list_json if x not in last_uncorrected_same_id_index_list]
        id_need_delete_list = [int(x) for x in last_uncorrected_same_id_index_list if x not in last_corrected_same_id_index_list_json]

        if id_need_add_list.__len__() > 0:
            print("id_need_add_list", last_corrected_id_index, id_need_add_list)

        if id_need_delete_list.__len__() > 0:
            print("id_need_delete_list", last_corrected_id_index, id_need_delete_list)

        all_index_dict = add_id_index(all_index_dict, last_corrected_id_index, id_need_add_list)
        all_index_dict = delete_id_index(all_index_dict, last_corrected_id_index, id_need_delete_list)
        if id_need_add_list.__len__() > 0 or id_need_delete_list.__len__() > 0 or bad_quality_change:
            with open(current_label_file, "w") as f:
                json.dump({"result": all_index_dict, "history_index": all_history_index, 'bad_quality': all_bad_quality_index}, f, indent=1)

            # retry_time = 10
            # while True:
            #     try:
            #         repo = git.Repo("/data/pic_liangjiang_test/")
            #         index = repo.index
            #         index.add([current_camera_name + '/label_all/' + current_video_name + '/' + current_labelperson_name + "_label_result.json"])
            #         newcommit = index.commit(current_user_name + '  ' + current_video_name)
            #         break
            #     except:
            #         print("git failed, retry time remain ", retry_time)
            #         retry_time -= 1
            #         if retry_time == 0:
            #             print("try 10 times but all failed")
            #             repo = git.Repo("/data/pic_liangjiang_test/")
            #             index = repo.index
            #             index.add([current_camera_name + '/label_all/' + current_video_name + '/' + current_labelperson_name + "_label_result.json"])
            #             newcommit = index.commit(current_user_name + '  ' + current_video_name)
            #             assert(False)
            #         time.sleep(1)

            # origin = repo.remotes.origin
            # origin.push() #time costing and not stable
            pass
    t6 = time.time()
    #jump already group id if button trigger
    if trigger_by_button and is_jump_labeled_ones:
        while current_id_index in all_index_dict:
            if current_id_index == video_id_list.__len__() - 1:
                break
            current_id_index += 1
            if current_id_index == video_id_list.__len__() - 1:
                break

    print(current_user_name, 'labeling', current_labelperson_name, current_video_name, last_corrected_id_index, "->",
          current_id_index)

    current_mot_id = video_id_list[current_id_index]
    # #TODO: json folder
    # current_mot_id_folder = os.path.join(patch_folder, '10000_patch_json_fix_time_filter_hard_merge', str(current_mot_id))
    # with open(os.path.join(current_mot_id_folder, 'patch_image_names.json'), 'r') as f:
    #     save_result = json.load(f)
    # current_mot_id_img_all_name_list = save_result['file_name']
    # current_mot_id_folder = os.path.join(patch_folder, current_video_name + '_patch', str(current_mot_id))
    # current_mot_id_img_all_name_list = sorted(os.listdir(current_mot_id_folder))
    current_mot_id_folder = os.path.join(patch_folder, current_video_name + '_mot_merge_img_final_json', str(current_mot_id))
    with open(os.path.join(current_mot_id_folder, 'patch_image_names.json'), 'r') as f:
        save_result = json.load(f)
    current_mot_id_img_all_name_list = save_result['file_name']
    current_mot_id_img_show_name_list = []
    current_mot_id_img_show_num = 10
    if current_mot_id_img_all_name_list.__len__() <= current_mot_id_img_show_num:
        current_mot_id_img_show_name_list = current_mot_id_img_all_name_list
    else:
        for i in range(0, int(current_mot_id_img_all_name_list.__len__() / (current_mot_id_img_show_num-1)) * (current_mot_id_img_show_num-1),
                       int(current_mot_id_img_all_name_list.__len__() / (current_mot_id_img_show_num-1))):
            current_mot_id_img_show_name_list.append(current_mot_id_img_all_name_list[i])
        current_mot_id_img_show_name_list.append(current_mot_id_img_all_name_list[-1])
    current_mot_id_img_url_list = []
    # all_patch_folder = os.path.join(patch_folder, '10000')
    for img_name in current_mot_id_img_show_name_list:
        # current_mot_id_img_url_list.append('data:image/jpeg;base64,'+base64.b64encode(open(os.path.join(all_patch_folder, img_name).encode('utf-8'), "rb").read()))
        current_mot_id_img_url_list.append(str(os.path.join('/static/local_images', current_database_name, current_camera_name, current_video_name, img_name)))
    current_mot_id_img_file_name_list = current_mot_id_img_show_name_list
    current_id_feat = feat_list[current_id_index, :]
    # dist_precompute = np.load(os.path.join(patch_folder, '10000_patch_json_fix_time_filter_hard_merge_feat_rerank_dist',
    #                                        str(current_id_index) + '.npy')).tolist()
    t7 = time.time()
    # use all_index_dict
    already_in_group_set = []
    merged_new_id_name_list = []
    merged_new_feat_list = []

    # dist_current_id = []

    for key, value in all_index_dict.items():
        if key in already_in_group_set:
            continue
        current_group = [key] + value
        if current_id_index in current_group:
            continue
            # split group if current_id_index in group to relabel in group relation
            # need in correct past wrong label

            # if current_group.__len__() == 2:
            #     continue
            # else:
            #     current_group.remove(current_id_index)
        new_id_name = ""
        current_group_feat_list = []
        # dist_list = []
        for index in current_group:
            assert (index not in already_in_group_set)
            already_in_group_set.append(index)
            if index in all_bad_quality_index:
                continue
            new_id_name = new_id_name + video_id_str_list[index] + "|"
            current_group_feat_list.append(feat_list[index, :])

        if current_group_feat_list.__len__() == 0:
            continue
            # dist_list.append(dist_precompute[index])
        merged_new_id_name_list.append(new_id_name[:-1])
        merged_new_feat_list.append(np.average(np.array(current_group_feat_list), axis=0))
        # dist_current_id.append(max(dist_list))
    t8 = time.time()
    for index in range(video_id_str_list.__len__()):
        if index in already_in_group_set:
            continue
        if current_id_index == index:
            continue
        # if index in all_bad_quality_index:
        #     continue
        merged_new_id_name_list.append(video_id_str_list[index])
        merged_new_feat_list.append(feat_list[index, :])
        # dist_current_id.append(dist_precompute[index])
    # dist_current_id = []
    # for i in range(merged_new_feat_list.__len__()):
    #     dist_current_id.append(reid_distance(current_id_feat, merged_new_feat_list[i]))
    dist_current_id = np.dot(current_id_feat, np.transpose(merged_new_feat_list)).tolist()

    # merged_new_feat_list_np = np.array([current_id_feat] + merged_new_feat_list)
    # merged_new_feat_list_np = merged_new_feat_list_np / np.linalg.norm(merged_new_feat_list_np, axis=1)[:, np.newaxis]
    # all_dist = np.dot(merged_new_feat_list_np, np.transpose(merged_new_feat_list_np))
    # rerank_dist = re_ranking(all_dist, all_dist, all_dist)
    # dist_current_id = (1 - rerank_dist[0, 1:]).tolist()


    t91 =time.time()
    # same id always on top
    if current_id_index in all_index_dict:
        for same_id_index in all_index_dict[current_id_index]:
            # same_id_index is force split to each one so can use name to index
            dist_current_id[merged_new_id_name_list.index(video_id_str_list[same_id_index])] = 2

    top_50_index = sorted(range(len(dist_current_id)), key=lambda k: -dist_current_id[k])
    # if current_id_index in top_50_index:
    #     top_50_index.remove(current_id_index)
    if top_50_index.__len__() >= 50:
        top_50_index = top_50_index[:50]

    top_50_distance = []
    for index in top_50_index:
        top_50_distance.append(dist_current_id[index])

    top_50_is_same_id = []
    for index in top_50_index:
        if dist_current_id[index] == 2:
            top_50_is_same_id.append(1)
        else:
            top_50_is_same_id.append(0)

    # top_50_index = [x for idx, x in enumerate(top_50_index)if top_50_is_same_id[idx] == 1]

    top_50_id_name = []
    for index in top_50_index:
        top_50_id_name.append(merged_new_id_name_list[index])

    t92 =time.time()
    top_50_img_url_list = []
    top_50_img_file_name_list = []
    for id_name in top_50_id_name:

        def get_5_url_img_by_name(patch_folder, current_video_name, mot_id):

            # #TODO: json folder
            mot_id_folder = os.path.join(patch_folder, current_video_name + '_mot_merge_img_final_json', str(mot_id))
            # r0=time.time()
            with open(os.path.join(mot_id_folder, 'patch_image_names.json'), 'r') as f:
                save_result = json.load(f)
            # r1=time.time()
            # print(r1-r0)
            img_all_name_list = save_result['file_name']
            # mot_id_folder = os.path.join(patch_folder, current_video_name+'_patch', str(mot_id))
            # img_all_name_list = sorted(os.listdir(mot_id_folder), key=lambda x: x.split("_")[0])  # sorted by frame

            img_5_name_list = []

            if img_all_name_list.__len__() <= 5:
                img_5_name_list = img_all_name_list
            else:
                for i in range(0, int(img_all_name_list.__len__() / 4) * 4, int(img_all_name_list.__len__() / 4)):
                    img_5_name_list.append(img_all_name_list[i])
                img_5_name_list.append(img_all_name_list[-1])
            # for img_name in img_5_name_list:
            #     img_5_np.append(cv2.imread(os.path.join(mot_id_folder, img_name)))
            # img_5_image = []
            # for img_np in img_5_np:
            #     img_5_image.append(array_to_image(img_np))
            # img_5_person_url = []
            # for img_image in img_5_image:
            #     img_5_person_url.append(base64.b64encode(img_image.read()))
            img_5_person_url = []
            # all_patch_folder = os.path.join(patch_folder, '10000')
            for img_name in img_5_name_list:
                image_url = str(os.path.join('/static/local_images', current_database_name, current_camera_name, current_video_name, img_name))
                img_5_person_url.append(str(image_url))
                # print(sys.getdefaultencoding())
                # img_5_person_url.append('data:image/jpeg;base64,'+base64.b64encode(open(os.path.join(all_patch_folder, img_name).encode('utf-8'), "rb").read()))
            return img_5_person_url, img_5_name_list

        img_person_url = []
        img_name_list = []
        for sub_id_name in id_name.split("|"):
            img_5_person_url, img_5_name = get_5_url_img_by_name(patch_folder, current_video_name, sub_id_name)
            img_person_url += img_5_person_url
            img_name_list += img_5_name
        top_50_img_url_list.append(img_person_url)
        top_50_img_file_name_list.append(img_name_list)
    resp = {}
    resp['video_list'] = video_list
    resp['vieo_labelperson_list'] = vieo_labelperson_list

    resp['video_id_str_list'] = video_id_str_list
    resp['top_50_img_url_list'] = top_50_img_url_list
    resp['top_50_img_file_name_list'] = top_50_img_file_name_list
    resp['current_mot_id_img_url_list'] = current_mot_id_img_url_list
    resp['current_mot_id_img_file_name_list'] = current_mot_id_img_file_name_list
    resp['top_50_is_same_id'] = top_50_is_same_id
    resp['top_50_id_name'] = top_50_id_name
    resp['current_id_index'] = current_id_index
    resp['all_history_index'] = all_history_index
    resp['top_50_distance'] = top_50_distance

    t9 = time.time()
    print(t1-t0,t2-t1,t3-t2,t4-t3,t5-t4,t6-t5,t7-t6,t8-t7,t9-t8)
    print(t9-t0,t61-t5)
    print(t9-t92,t92-t91,t91-t8)
    if current_id_index in all_bad_quality_index:
        current_id_is_bad = True
    else:
        current_id_is_bad =False

    resp['current_id_is_bad'] = current_id_is_bad
    resp_jsondata = json.dumps(resp)
    return HttpResponse(resp_jsondata)

#get_database_camera_list(0)