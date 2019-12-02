# -*- coding: utf8 -*-

# Create your views here.
# 人脸类间清理标注后端源码
from django.http import JsonResponse
from django.http import HttpResponse,HttpResponseRedirect
import os
import json
import shutil
import math

# 所有数据存放目录
all_folder_path = "E:/data"
# 主类删除的图片备份的目录
del_pic_save_path = "E:/del_pic"

def index(request):
    return HttpResponseRedirect('/static/web/face_beside_reid_label.html')

def multi_get_database_id_range_list(request):
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

    all_database_folder = all_folder_path#'/data/multi_dataset/'

    # 数据库列表
    database_list = os.listdir(all_database_folder)

    # 数据库分块列表
    database_id_range_list = []
    for database_name in database_list:
        merged_dataset_label_result_path = os.path.join(all_database_folder, database_name, "label_all","cluster_result.json")
        with open(merged_dataset_label_result_path,'r',encoding='utf-8')as f:
            temp = json.load(f)
        all_clusters = []
        for cluster in temp:
            if len(cluster)>1:
                all_clusters.append(cluster)

        id_count = len(all_clusters)
        # print(database_name, id_count)
        id_range_list = []

        id_split = 50
        for i in range(int(math.ceil(1.0 * id_count / id_split))):
            if i == int(math.ceil(1.0 * id_count / id_split) - 1):
                id_range_name = str(i * id_split) + '--' + str(id_count - 1)
            else:
                id_range_name = str(i * id_split) + '--' + str(i * id_split + id_split-1)
            id_range_list.append(id_range_name)
        database_id_range_list.append(id_range_list)
    pass
    resp = {}
    resp['database_list'] = database_list
    resp['database_id_range_list'] = database_id_range_list
    resp_jsondata = json.dumps(resp)
    return HttpResponse(resp_jsondata)

def get_labelperson_label_data(current_database_name, current_id_range_name, current_labelperson, current_cluster_id_index, all_cluster_label_result):
    labelperson_list = []

    all_database_folder = all_folder_path

    merged_dataset_label_result_path = os.path.join(all_database_folder, current_database_name, 'label_all')

    if not os.path.exists(merged_dataset_label_result_path):
        os.mkdir(merged_dataset_label_result_path)

    if not os.path.exists(os.path.join(merged_dataset_label_result_path, current_labelperson + "_" + current_id_range_name + "_label_result.json")):
        with open(os.path.join(merged_dataset_label_result_path, current_labelperson + "_" + current_id_range_name + "_label_result.json"), "w",encoding="utf-8") as f:
                json.dump({"last_label_index": 0,"last_label_info":{}},f,ensure_ascii=False,indent=4)

    # 读取上次的标注数据
    with open(os.path.join(merged_dataset_label_result_path,
                           current_labelperson + "_" + current_id_range_name + "_label_result.json"), "r",encoding="utf-8") as f:
        label_data = json.load(f)
        # 读取上一次标注位置
        last_label_index = label_data["last_label_index"]
        # 读取上一次的聚类标注信息
        last_label_info = label_data["last_label_info"]

    # 保存这一次的位置,标注数据
    with open(os.path.join(merged_dataset_label_result_path, current_labelperson + "_" + current_id_range_name + "_label_result.json"), "w") as f:
        # 如果传回的标注数据为空，则将本地的标注数据上传
        if all_cluster_label_result == {}:
            all_cluster_label_result = last_label_info

        json.dump({"last_label_index": current_cluster_id_index,"last_label_info":all_cluster_label_result}, f, indent=4, ensure_ascii=False)

    # 获取标注人的列表
    for sub_name in sorted(os.listdir(merged_dataset_label_result_path)):
        if not os.path.isdir(os.path.join(merged_dataset_label_result_path, sub_name)):
            if sub_name.endswith("_" + current_id_range_name + "_label_result.json"):
                #TODO: bad man might produce problem
                labelperson_list.append(sub_name.split('_')[0])

    return labelperson_list, last_label_index, all_cluster_label_result

def moveTree(src, dst):
    dirs = '/'.join(dst.split('/')[:-1])
    if not os.path.exists(dirs):
        os.makedirs(dirs)
    shutil.move(src, dst)

def get_cluster_info(all_folder, current_database_name, current_id_index):
    # 获取所有聚类结果列表
    data_path=os.path.join(all_folder,current_database_name,"label_all","cluster_result.json")
    with open(data_path, 'r', encoding='utf-8')as f:
        temp = json.load(f)
    all_clusters = []
    for cluster in temp:
        if len(cluster) > 1:
            all_clusters.append(cluster)
    # 获取当前聚类所含id列表
    current_cluster_contains_id = all_clusters[current_id_index]

    # 获取当前聚类所含id对应的图片链接
    current_ids_img_url_list = {}
    for id in current_cluster_contains_id:
        temp = []
        for pic_name in os.listdir(os.path.join(all_folder,current_database_name,"images",id,"good")):
            if pic_name.lower().endswith('.jpg') or pic_name.lower().endswith('.png') or pic_name.lower().endswith('.jpeg'):
                temp.append(os.path.join(all_folder,current_database_name,"images",id,"good",pic_name).replace(all_folder,'/static/multi_dataset_base'))
        current_ids_img_url_list[id] = temp

    return current_cluster_contains_id, current_ids_img_url_list, all_clusters

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
    current_labelperson_name = req_json['current_labelperson_name'] # 当前显示的标注人
    current_cluster_id_index = int(req_json['current_cluster_id_index']) # 当前聚类的序列
    current_del_pics = req_json['current_del_pics'] # 聚类中待删的图片列表
    all_cluster_label_result = req_json['all_cluster_label_result']  # 将前端保存的标注数据传回本地保存

    current_user_name = request.session["user_name"]  # 当前用户

    # 当前聚类待删图片
    if current_del_pics:
        current_del_pics = [pic.replace('\\', '/') for pic in current_del_pics]
        for pic in current_del_pics:
            pic=pic.replace('/static/multi_dataset_base',all_folder_path)
            dst = pic.replace("good", "bad")
            moveTree(pic,dst)
            print(pic,'-->',dst)

    # 将当前聚类被标为一类的进行保存
    # 获取标注人列表 ,当前标注人标注的最后位置, 标注数据
    labelperson_list, last_label_index, all_label_data = get_labelperson_label_data(current_database_name,
                                                                              current_id_range_name, current_user_name,
                                                                                current_cluster_id_index, all_cluster_label_result)

    # 获取当前聚类所含id，及每个id所含的图片列表，所有聚类集合
    current_cluster_contains_id,current_ids_img_url_list,all_clusters = \
            get_cluster_info(all_folder_path, current_database_name, current_cluster_id_index + int(current_id_range_name.split('--')[0]))


    # 当前标注人
    if not current_labelperson_name:
        current_labelperson_name = current_user_name

    print(all_label_data)
    resp = {}
    resp['labelperson_list'] = labelperson_list # 标注人物列表
    resp['all_clusters'] = all_clusters  # 所有聚类类别id
    resp['current_labeler_last_index'] = last_label_index# 当前标注人标注的最后位置
    resp['current_cluster_id_index'] = current_cluster_id_index
    resp['current_ids_img_url_list'] = current_ids_img_url_list# 当前聚类所含id的图片连接字典
    resp['current_cluster_contains_id'] = current_cluster_contains_id# 当前聚类所含id
    resp['all_label_result'] = all_label_data #所有的标注数据
    resp['current_label_name'] = current_labelperson_name # 当前标注人

    resp_jsondata = json.dumps(resp)
    return HttpResponse(resp_jsondata)