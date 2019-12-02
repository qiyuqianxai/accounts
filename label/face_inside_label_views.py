# -*- coding: utf8 -*-

# Create your views here.
# 人脸类内清理标注后端源码
from django.http import JsonResponse
from django.http import HttpResponse,HttpResponseRedirect
import os
import json
import shutil
import math
import re
# 所有数据存放目录
all_folder_path = "E:/data"
# 主类删除的图片备份的目录
# del_pic_save_path = "E:/del_pic"

def index(request):
    return HttpResponseRedirect('/static/web/face_inside_reid_label.html')

def multi_get_database(request):
    # 返回数据库列表和每个数据库对应的分块列表
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
    current_user_name = request.session["user_name"]  # 当前用户

    all_database_folder = all_folder_path#'/data/multi_dataset/'

    # 数据库列表
    database_list = os.listdir(all_database_folder)

    pass
    resp = {}
    resp['database_list'] = database_list
    resp_jsondata = json.dumps(resp)
    return HttpResponse(resp_jsondata)

def get_id_range(request):
    # 返回数据库列表和每个数据库对应的分块列表
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
    req_json = json.loads(request.body)

    current_database_name = req_json['current_database_name']  # 当前数据库
    current_labelperson_name = request.session["user_name"]  # 当前用户
    merged_dataset_label_result_path = os.path.join(all_folder_path, current_database_name, 'label_all')
    # 生成label_all文件夹
    if not os.path.exists(merged_dataset_label_result_path):
        os.mkdir(merged_dataset_label_result_path)

    # 对数据集进行划分
    merged_dataset_images_path = os.path.join(all_folder_path, current_database_name, "images")
    all_id = os.listdir(merged_dataset_images_path)

    id_count = len(all_id)
    # print(database_name, id_count)
    id_range_list = []
    id_split = 30
    for i in range(int(math.ceil(1.0 * id_count / id_split))):
        if i == int(math.ceil(1.0 * id_count / id_split) - 1):
            id_range_name = str(i * id_split) + '--' + str(id_count - 1)
        else:
            id_range_name = str(i * id_split) + '--' + str(i * id_split + id_split - 1)
        id_range_list.append(id_range_name)

    current_id_range = ""
    current_labeler_last_index = 0
    # 发现用户是否有标注记录
    all_labels = sorted_aphanumeric(os.listdir(merged_dataset_label_result_path))
    all_labels.reverse()
    for label_josn in all_labels:
        if label_josn.find(current_labelperson_name) > -1:
            current_id_range = label_josn.split('_')[0]
            with open(os.path.join(merged_dataset_label_result_path,label_josn),'r')as f:
                info = json.load(f)
                max_index = int(current_id_range.split('--')[1]) - int(current_id_range.split('--')[0])
                # 若是该id已标完
                if info["last_label_index"] == max_index:
                    current_id_range = ""
                else:
                    current_labeler_last_index = info["last_label_index"]
            break
    # 若是新用户或者需要新分配的，则分配一批新的出来
    if current_id_range == "":
        if os.listdir(merged_dataset_label_result_path):
            latest_id_range_index = id_range_list.index(sorted_aphanumeric(os.listdir(merged_dataset_label_result_path))[-1].split('_')[0])
            if latest_id_range_index < len(id_range_list) - 1:
                current_id_range = id_range_list[latest_id_range_index + 1]
            else:
                # 代表该数据已分配完
                current_id_range = ""
        else:
            current_id_range = id_range_list[0]

    resp = {}
    resp['current_id_range'] = current_id_range  # 当前标注人的标注范围
    resp['current_labeler_last_index'] = current_labeler_last_index # 当前标注人最后标注的位置 ，即当前主类图片序列
    resp['current_database_name'] = current_database_name
    resp['all_id'] = all_id
    resp_jsondata = json.dumps(resp)
    return HttpResponse(resp_jsondata)

def get_labelperson_list(current_database_name, current_id_range_name, current_labelperson, current_id_index):
    all_database_folder = all_folder_path


    merged_dataset_label_result_path = os.path.join(all_database_folder, current_database_name, 'label_all')

    if not os.path.exists(merged_dataset_label_result_path):
        os.mkdir(merged_dataset_label_result_path)

    if not os.path.exists(os.path.join(merged_dataset_label_result_path, current_id_range_name + "_" + current_labelperson + "_label_result.json")):
        with open(os.path.join(merged_dataset_label_result_path, current_id_range_name + "_" + current_labelperson + "_label_result.json"), "w",encoding="utf-8") as f:
                json.dump({"last_label_index": 0},f,ensure_ascii=False,indent=4)
    # 读取上次操作的位置
    with open(os.path.join(merged_dataset_label_result_path,
                           current_id_range_name + "_" + current_labelperson + "_label_result.json"), "r",encoding="utf-8") as f:
        try:
            last_label_index = json.load(f)["last_label_index"]
        except Exception as e:
            print(e)
            last_label_index = 0
    # 保存这一次的位置
    with open(os.path.join(merged_dataset_label_result_path, current_id_range_name + "_" + current_labelperson + "_label_result.json"), "w") as f:
                json.dump({"last_label_index": current_id_index},f)
    return last_label_index

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

    req_json = json.loads(request.body)

    current_database_name = req_json['current_database_name'] # 当前数据库
    current_id_range_name = req_json['current_id_range_name'] # 当前显示的分区范围
    current_id_index = int(req_json['current_id_index']) # 当前主类图片的序列
    current_user_name = request.session["user_name"] # 当前用户
    current_id_del_pics = req_json['current_id_del_pics'] # 主类中待删的图片列表
    current_add_pics = req_json['current_add_pics']  # 从次类加入主类的图片

    # 主类待删图片 删除图片同时删除json里面的主类图片名称
    if current_id_del_pics:
        current_id_del_pics = [pic.replace('\\', '/') for pic in current_id_del_pics]
        id_name = current_id_del_pics[0].split('/')[-2]
        data_path = os.path.join(all_folder_path, current_database_name, "images", id_name,"good.json")
        if not os.path.exists(data_path.replace("good","bad")):
            with open(data_path.replace("good", "bad"), "w", encoding="utf-8") as f:
                json.dump([],f,indent=4,ensure_ascii=False)
        with open(data_path, "r",encoding="utf-8")as f:
            main_pic_names = json.load(f)
        with open(data_path.replace("good","bad"),"r",encoding="utf-8") as f:
            sec_pic_names = json.load(f)

        for pic in current_id_del_pics:
            pic = pic.replace('/static/multi_dataset_base',all_folder_path)
            if pic.split('/')[-1] in main_pic_names:
                main_pic_names.remove(pic.split('/')[-1])
                sec_pic_names.append(pic.split('/')[-1])

        with open(data_path, "w",encoding="utf-8")as f:
            json.dump(main_pic_names,f,ensure_ascii=False,indent=4)

        with open(data_path.replace("good","bad"),"w",encoding="utf-8") as f:
            json.dump(sec_pic_names,f,ensure_ascii=False,indent=4)

    # 获取标注人列表 ,以及当前标注人标注的最后位置
    last_label_index = get_labelperson_list(current_database_name, current_id_range_name, current_user_name, current_id_index)
    # 次类加入主类的图片
    # 现根据待加入主类的图片修改bad.json和good.json
    if current_add_pics:
        id_name = current_add_pics[0].replace('\\', '/').split('/')[-2]
        data_path = os.path.join(all_folder_path, current_database_name, "images",id_name,"bad.json")
        # bad.json
        with open(data_path,"r",encoding="utf-8")as f:
            sec_pic_names = json.load(f)

        # good.json
        with open(data_path.replace("bad","good"),"r",encoding="utf-8")as f:
            main_pic_names = json.load(f)

        for pic in current_add_pics:
            pic = pic.replace('\\', '/')
            if pic.split('/')[-1] in sec_pic_names:
                sec_pic_names.remove(pic.split('/')[-1])
                main_pic_names.append(pic.split('/')[-1])


        with open(data_path,"w",encoding="utf-8")as f:
            json.dump(sec_pic_names,f,ensure_ascii=False,indent=4)

        with open(data_path.replace("bad","good"),"w", encoding='utf-8')as f:
            json.dump(main_pic_names,f,ensure_ascii=False,indent=4)

    # 获取主类图片，次类图片列表，图片类别id
    current_main_img_file_name_list,current_sec_img_url_list,all_id = \
            get_main_sec_class_pic_list(all_folder_path, current_database_name, current_id_index + int(current_id_range_name.split('--')[0]))



    resp = {}
    resp['all_id'] = all_id  # 所有图片类别id
    resp['current_labeler_last_index'] = last_label_index# 当前标注人标注的最后位置
    resp['current_id_index'] = current_id_index
    resp['current_main_img_url_list'] = current_main_img_file_name_list# 当前主类图片链接列表
    resp['current_sec_img_url_list'] = current_sec_img_url_list# 次类图片链接集合

    resp_jsondata = json.dumps(resp)
    return HttpResponse(resp_jsondata)

def moveTree(src, dst):
    dirs = '/'.join(dst.split('/')[:-1])
    if not os.path.exists(dirs):
        os.makedirs(dirs)
    shutil.move(src, dst)

def get_main_sec_class_pic_list(all_folder, current_database_name, current_id_index):

    data_path=os.path.join(all_folder,current_database_name,"images")
    all_id = os.listdir(data_path)
    # 获取主类图片
    main_pic_urls_txt = os.path.join(data_path, all_id[current_id_index], "good.json")
    if os.path.exists(main_pic_urls_txt):
        with open(main_pic_urls_txt, "r", encoding='utf-8')as f:
            main_pic_names = json.load(f)
        main_pic_names = [pic.replace('/','') for pic in main_pic_names]
        main_pic_urls = [os.path.join(data_path, all_id[current_id_index], pic).replace(all_folder,
                                                                                              '/static/multi_dataset_base') for pic in main_pic_names]
    else:
        main_pic_urls = []

    # 获取次类图片
    sec_pic_urls_txt = os.path.join(data_path,all_id[current_id_index],"bad.json")
    if os.path.exists(sec_pic_urls_txt):
        with open(sec_pic_urls_txt,"r",encoding='utf-8')as f:
            sec_pic_names=json.load(f)
        sec_pic_urls = [os.path.join(data_path,all_id[current_id_index],pic).replace(all_folder,'/static/multi_dataset_base') for pic in sec_pic_names]
    else:
        sec_pic_urls = []
    return main_pic_urls, sec_pic_urls, all_id

def sorted_aphanumeric(data):
    convert = lambda text: int(text) if text.isdigit() else text.lower()
    alphanum_key = lambda key: [ convert(c) for c in re.split('([0-9]+)', key) ]
    return sorted(data, key=alphanum_key)