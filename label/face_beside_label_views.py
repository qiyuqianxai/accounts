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

def multi_get_database_list(request):
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
        response.status_code = 403
        return response

    all_database_folder = all_folder_path

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
    merged_dataset_cluster_path = os.path.join(all_folder_path, current_database_name, "all_clusters")
    all_cluster_id = os.listdir(merged_dataset_cluster_path)
    id_count = len(all_cluster_id)
    # 获取该用户已标的id列表
    if r.exists(current_database_name + "_" + current_labelperson_name):
        all_keys = r.lrange(current_database_name + "_" + current_labelperson_name, 0, -1)
        user_labeled_id = list(map(lambda x: all_cluster_id[int(x)], all_keys))
    else:
        if not r.hexists(current_database_name + "_info", "last_id"):
            r.hset(current_database_name + "_info", "last_id", 0)
        if not r.hexists(current_database_name + "_info", "last_id_checked"):
            r.hset(current_database_name + "_info", "last_id_checked", 0)
        if current_labelperson_name.find("check") > -1:
            last_id = int(r.hget(current_database_name + "_info", "last_id_checked"))
        else:
            last_id = int(r.hget(current_database_name + "_info", "last_id"))

        if last_id > id_count - 1:
            response = JsonResponse({"msg": "该批数据已分配完成，请选择另外的数据集开始！"})
            response.status_code = 404
            return response
        else:
            r.rpush(current_database_name + "_" + current_labelperson_name, last_id)
            user_labeled_id = [last_id]
            if current_labelperson_name.find("check") > -1:
                r.hset(current_database_name + "_info", "last_id_checked", last_id + 1)
            else:
                r.hset(current_database_name + "_info", "last_id", last_id + 1)

    current_id_range = "0--%d" % len(user_labeled_id)
    resp = {}
    resp['current_id_range'] = current_id_range  # 当前标注人的标注范围
    resp['user_labeled_id'] = user_labeled_id
    resp['labeler'] = current_labelperson_name
    resp_jsondata = json.dumps(resp)
    return HttpResponse(resp_jsondata)

def moveTree(src, dst):
    dirs = '/'.join(dst.split('/')[:-1])
    if not os.path.exists(dirs):
        os.makedirs(dirs)
    shutil.move(src, dst)

def get_cluster_info(current_database_name,cluster_id):
    # 获取所有聚类结果列表
    cluster_id_path =os.path.join(all_folder_path,current_database_name,"all_clusters",cluster_id)
    with open(os.path.join(cluster_id_path,"info.json"), 'r', encoding='utf-8')as f:
        current_cluster_contains_id = json.load(f)

    if os.path.exists(os.path.join(cluster_id_path,"label_result.json")):
        with open(os.path.join(cluster_id_path,"label_result.json"),"r",encoding="utf-8")as f:
            cluster_label_result = json.load(f)
    else:
        cluster_label_result = []

    # 获取当前聚类所含id对应的图片链接
    current_ids_img_url_list = {}
    for id in current_cluster_contains_id:
        temp = []
        for pic_name in os.listdir(os.path.join(all_folder_path,current_database_name,"images",id)):
            if pic_name.lower().endswith('.jpg') or pic_name.lower().endswith('.png') or pic_name.lower().endswith('.jpeg'):
                temp.append(os.path.join(all_folder_path,current_database_name,"images",id, pic_name).replace(all_folder_path,'/static/multi_dataset_base/class_exclude'))
        current_ids_img_url_list[id] = temp

    return current_cluster_contains_id, current_ids_img_url_list, cluster_label_result

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
    current_labelperson_name = request.session["user_name"]  # 当前用户

    # 当前聚类待删图片
    # if current_del_pics:
    #     current_del_pics = [pic.replace('\\', '/') for pic in current_del_pics]
    #     for pic in current_del_pics:
    #         pic=pic.replace('/static/multi_dataset_base',all_folder_path)
    #         dst = pic.replace("good", "bad")
    #         moveTree(pic,dst)
    #         print(pic,'-->',dst)

    #
    data_path = os.path.join(all_folder_path, current_database_name, "all_clusters")
    all_cluster_id = os.listdir(data_path)
    all_keys = r.lrange(current_database_name + "_" + current_labelperson_name, 0, -1)
    user_labeled_id = list(map(lambda x: all_cluster_id[int(x)], all_keys))

    if current_cluster_id_index < len(user_labeled_id):
        cluster_id = user_labeled_id[current_cluster_id_index]
    else:
        if current_labelperson_name.find("check") > -1:
            last_id = int(r.hget(current_database_name + "_info", "last_id_checked"))
        else:
            last_id = int(r.hget(current_database_name + "_info", "last_id"))

        if last_id > len(all_cluster_id) - 1:
            response = JsonResponse({"msg": "该批数据集已标完，请选择其它数据集继续！"})
            response.status_code = 404
            return response
        else:
            r.rpush(current_database_name + "_" + current_labelperson_name, last_id)
            user_labeled_id.append(all_cluster_id[last_id])
            cluster_id = all_cluster_id[last_id]
            # 更新最新的id
            if current_labelperson_name.find("check") > -1:
                r.hset(current_database_name + "_info", "last_id_checked", last_id + 1)
            else:
                r.hset(current_database_name + "_info", "last_id", last_id + 1)

    # 获取当前聚类所含id，及每个id所含的图片列表
    current_cluster_contains_id, current_ids_img_url_list, cluster_label_result = get_cluster_info(current_database_name,cluster_id)
    current_id_range = "0--%d"%len(user_labeled_id)

    # 获取标注人，审核人
    if r.hexists(current_database_name+"_id_checker",cluster_id):
        checker = r.hget(current_database_name+"_id_checker",cluster_id).decode("utf-8")
    else:
        checker = ""
    if r.hexists(current_database_name+"_id_labeler",cluster_id):
        labeler = r.hget(current_database_name+"_id_labeler",cluster_id).decode("utf-8")
    else:
        labeler = ""

    resp = {}
    resp['current_cluster_contains_id'] = current_cluster_contains_id # 当前聚类所含id
    resp['current_ids_img_url_list'] = current_ids_img_url_list # 当前聚类所含id的图片集合{id: [img1url, imgurl2, ...], }
    resp['user_labeled_id'] = user_labeled_id
    resp['current_id_range'] = current_id_range
    resp['cluster_label_result'] = cluster_label_result # 当前聚类id的标注结果[[id0, id1], [id2, id3]]，如果是[]，则没标注
    resp['labeler'] = labeler
    resp['checker'] = checker

    resp_jsondata = json.dumps(resp)
    return HttpResponse(resp_jsondata)

def save_label_info(request):
    req_json = json.loads(request.body)
    current_database_name = req_json["current_database_name"]
    current_cluster_id_index = req_json["current_cluster_id_index"]
    current_labelperson_name = request.session["user_name"]  # 当前用户
    label_result = req_json["label_result"]
    merged_dataset_cluster_path = os.path.join(all_folder_path, current_database_name, "all_clusters")
    all_cluster_id = os.listdir(merged_dataset_cluster_path)
    all_keys = r.lrange(current_database_name + "_" + current_labelperson_name, 0, -1)
    user_labeled_id = list(map(lambda x: all_cluster_id[int(x)], all_keys))
    current_cluster_id = user_labeled_id[current_cluster_id_index]
    cluster_id_path = os.path.join(all_folder_path,current_database_name,"all_clusters",current_cluster_id)
    with open(os.path.join(cluster_id_path ,"label_result.json"),"w",encoding="utf-8")as f:
        f.write(json.dumps(label_result,indent=4,ensure_ascii=False))
    # 将标注人,审核人与id对应保存起来
    if current_labelperson_name.find("check") > -1:
        if not r.hexists(current_database_name+"_id_checker",current_cluster_id):
            r.hset(current_database_name+"_id_checker",current_cluster_id,current_labelperson_name)
    else:
        if not r.hexists(current_database_name+"_id_lebeler",current_cluster_id):
            r.hset(current_database_name + "_id_labeler", current_cluster_id, current_labelperson_name)
    # 打印标注结果
    print(current_labelperson_name,current_database_name,current_cluster_id,label_result)
    resp_jsondata = json.dumps({"msg": current_cluster_id + "保存成功"})
    return HttpResponse(resp_jsondata)