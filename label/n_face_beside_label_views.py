# -*- coding: utf8 -*-

# Create your views here.
# 人脸类间清理标注后端源码
from django.http import JsonResponse
from django.http import HttpResponse,HttpResponseRedirect
import os
import json
import shutil
import math
import redis

# 使用redis存储用户信息
pool = redis.ConnectionPool(host="127.0.0.1",port="6379",db=1)
r = redis.Redis(connection_pool=pool)

# 所有数据存放目录
all_folder_path = "E:/data/class_exclude"

def index(request):
    return HttpResponseRedirect('/static/web/face_beside_label.html')

def multi_get_database(request):
    # 返回数据库列表
    if "user_name" not in request.session:
        print("未登陆")
        ret_json = {
            'code': "get_database_camera_list",
            'message': '未登陆',
            'result': False,
            'data': None
        }
        response = JsonResponse({"msg": "请先登录！"})
        response.status_code = 403
        return response
    all_database_folder = all_folder_path#'/data/multi_dataset/'
    # 数据库列表
    database_list = os.listdir(all_database_folder)
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
        response = JsonResponse({"msg": "请先登录！"})
        response.status_code = 404
        return response

    req_json = json.loads(request.body)
    current_database_name = req_json['current_database_name']  # 当前数据库
    current_labelperson_name = request.session["user_name"]  # 当前用户

    # 获取标注人在该数据集下的range
    merged_dataset_images_path = os.path.join(all_folder_path, current_database_name, "label_all")
    all_id = os.listdir(merged_dataset_images_path)
    id_count = len(all_id)
    # 获取该用户已标的id列表
    if r.exists(current_database_name+"_"+current_labelperson_name):
        all_keys = r.lrange(current_database_name+"_"+current_labelperson_name, 0 , -1)
        user_labeled_id = list(map(lambda x:all_id[int(x)], all_keys))
    else:
        if not r.hexists(current_database_name+"_info","last_id"):
            r.hset(current_database_name+"_info","last_id",0)
        last_id = int(r.hget(current_database_name+"_info","last_id"))
        if last_id > id_count - 1:
            response = JsonResponse({"msg":"该批数据已分配完成，请选择另外的数据集开始！"})
            response.status_code = 404
            return response
        else:
            r.rpush(current_database_name+"_"+current_labelperson_name,last_id)
            user_labeled_id = [last_id]
            r.hset(current_database_name + "_info", "last_id", last_id + 1)

    current_id_range = "0--%d" % len(user_labeled_id)
    resp = {}
    resp['current_id_range'] = current_id_range  # 当前标注人的标注范围
    resp['user_labeled_id'] = user_labeled_id
    resp['labeler'] = current_labelperson_name
    resp_jsondata = json.dumps(resp)
    return HttpResponse(resp_jsondata)

def get_cluster_label_result(current_database_name, current_cluster_id_index, current_labelperson_name):

    all_database_folder = all_folder_path

    merged_dataset_label_result_path = os.path.join(all_database_folder, current_database_name, 'label_all')
    all_id = os.listdir(merged_dataset_label_result_path)
    all_keys = r.lrange(current_database_name + "_" + current_labelperson_name, 0, -1)
    user_labeled_id = list(map(lambda x: all_id[int(x)], all_keys))
    if current_cluster_id_index < len(user_labeled_id):
        cluster_id = user_labeled_id[current_cluster_id_index]
    else:
        last_id = int(r.hget(current_database_name+"_info","last_id"))
        if last_id > len(all_id) - 1:
            return []
        else:
            r.rpush(current_database_name + "_" + current_labelperson_name, last_id)
            user_labeled_id.append(all_id[last_id])
            cluster_id = all_id[last_id]
            # 更新最新的id
            r.hset(current_database_name + "_info","last_id",last_id+1)

    # 读取当前聚类id的标注结果
    if os.path.exists(os.path.join(merged_dataset_label_result_path,cluster_id,"label_info.json")):
        with open(os.path.join(merged_dataset_label_result_path,cluster_id,"label_info.json"),"r",encoding="utf-8")as f:
            cluster_label_result = json.load(f)
    else:
        with open(os.path.join(merged_dataset_label_result_path,cluster_id,"info.json"),"r",encoding="utf-8")as f:
            cluster_label_result = json.load(f)
    return cluster_label_result

def get_cluster_info(all_folder, current_database_name, cluster_label_data):
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
        for pic_name in os.listdir(os.path.join(all_folder,current_database_name,"images",id)):
            if pic_name.lower().endswith('.jpg') or pic_name.lower().endswith('.png') or pic_name.lower().endswith('.jpeg'):
                temp.append(os.path.join(all_folder,current_database_name,"images",id, pic_name).replace(all_folder,'/static/multi_dataset_base/class_exclude'))
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
    current_cluster_id_index = int(req_json['current_cluster_id_index']) # 当前聚类的序列
    current_user_name = request.session["user_name"]  # 当前用户

    # 将当前聚类被标为一类的进行保存
    # 标注数据
    cluster_label_data = get_cluster_label_result(current_database_name,current_cluster_id_index,current_user_name)

    # 获取当前聚类所含id，及每个id所含的图片列表，所有聚类集合
    current_cluster_contains_id,current_ids_img_url_list,all_clusters = \
            get_cluster_info(all_folder_path, current_database_name, cluster_label_data)


    # 当前标注人
    if not current_labelperson_name:
        current_labelperson_name = current_user_name

    resp = {}
    resp['all_clusters'] = all_clusters  # 所有聚类类别id
    resp['current_labeler_last_index'] = last_label_index# 当前标注人标注的最后位置
    resp['current_cluster_id_index'] = current_cluster_id_index
    resp['current_ids_img_url_list'] = current_ids_img_url_list# 当前聚类所含id的图片连接字典
    resp['current_cluster_contains_id'] = current_cluster_contains_id# 当前聚类所含id
    resp['all_label_result'] = all_label_data #所有的标注数据
    resp['current_label_name'] = current_labelperson_name # 当前标注人

    resp_jsondata = json.dumps(resp)
    return HttpResponse(resp_jsondata)

def save_label_info(request):
    pass