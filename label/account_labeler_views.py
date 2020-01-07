from django.http import JsonResponse
from django.http import HttpResponse,HttpResponseRedirect
import os
import json
import shutil
import math
import redis
import pymongo

mongodb = pymongo.MongoClient("10.135.24.58", 27017)

def index(request):
    return HttpResponseRedirect('/static/web/account_labeler.html')

# 返回日期列表
def get_date_and_task(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    all_task_db = mongodb["task_db"]
    cols = all_task_db["info"]
    all_date = cols.find_one()["all_date"]
    all_date_task_dict = {}
    for date in all_date:
        task_list = list(filter(lambda name:name.find(date) > -1 ,mongodb.database_names()))
        all_date_task_dict[date] = list(map(lambda name:name.replace(date+"-",""),task_list))

    resp_jsondata = json.dumps({"all_date": all_date,"all_date_task_dict":all_date_task_dict})
    return HttpResponse(resp_jsondata)

# 获取标注人在该任务下的信息
def get_task_detail_info(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    user_name = request.session["user_name"]
    data_json = json.loads(request.body)
    task_name = data_json["task_name"]
    # 记录任务列表
    task_db = mongodb[task_name]
    user_info = task_db[user_name]
    targetcol = task_db["target"]
    # 指标以target为准
    target = targetcol.find_one()
    target.pop("_id")
    target.pop("info_name")
    all_child_task_info = []
    for dict in user_info.find():
        child_task_info = {}
        child_task_info["子任务名称"] = dict["子任务名称"]
        for key in target.keys():
            if key in dict.keys():
                child_task_info[key] = dict[key]
            else:
                child_task_info[key] = ""
        all_child_task_info.append(child_task_info)
    resp_jsondata = json.dumps({"all_child_task_info": all_child_task_info,"target":["子任务名称"]+list(target.keys()),"target_weight":target})
    return HttpResponse(resp_jsondata)

# 保存标注人员的记录
def save_child_task_info(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    user_name = request.session["user_name"]
    data_json = json.loads(request.body)
    task_name = data_json["task_name"]
    child_info = data_json["child_task_info"]
    task_db = mongodb[task_name]
    task_db.drop_collection(user_name)
    user_col = task_db[user_name]
    for info in child_info:
        if info["子任务名称"] == "":
            continue
        user_col.update({"子任务名称":info["子任务名称"]},{'$set': info},True)
        print(info,"update success")
    resp_jsondata = json.dumps({"msg": "success"})
    return HttpResponse(resp_jsondata)

# 标注人该月总费用
def get_total_cost(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    user_name = request.session["user_name"]
    data_json = json.loads(request.body)
    date = data_json["date"]
    total_cost = 0
    task_list = list(filter(lambda name: name.find(date) > -1, mongodb.database_names()))
    for task_name in task_list:
        task_db =mongodb[task_name]
        user_db = task_db[user_name]
        for dict in user_db.find():
            if "费用" in dict.keys():
                try:
                    total_cost += float(dict["费用"])
                except Exception as e:
                    print(e)
                    continue
    resp_jsondata = json.dumps({"total_cost": total_cost})
    return HttpResponse(resp_jsondata)


