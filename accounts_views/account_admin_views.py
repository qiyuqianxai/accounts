from django.http import JsonResponse
from django.http import HttpResponse,HttpResponseRedirect
import os
import json
import shutil
import math
import redis
import pymongo

mongodb = pymongo.MongoClient("10.128.128.82", 27017)

def index(request):
    return HttpResponseRedirect('/static/web/account_admin.html')

def get_date_task(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    all_task_db = mongodb["task_db"]
    cols = all_task_db["info"]
    all_date = cols.find_one()["all_date"]

    resp_jsondata = json.dumps({"all_date":all_date})
    return HttpResponse(resp_jsondata)

# 增加月份到数据库中
def add_date_to_db(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    user = request.session["user_name"]  # 当前用户
    if user != "zhangqi":
        response = JsonResponse({"msg": "抱歉，您没有权限浏览此页面！"})
        response.status_code = 403
        return response

    data_json = json.loads(request.body)
    all_date = data_json["all_date"]
    all_date_task_dict = data_json["all_date_task_dict"]
    # 记录日期列表
    all_data_db = mongodb["task_db"]
    col = all_data_db["info"]
    col.update({'info_name': "date_list"}, {'$set': {"all_date": all_date, "info_name": "date_list"}}, True)

    # 更新任务db,不存在就设为默认值
    for date in all_date_task_dict.keys():
        for db in all_date_task_dict[date]:
            db_name = date+'-'+db
            if db_name not in mongodb.database_names():
                task_db = mongodb[db_name]
                targetcol = task_db["target"]
                base_target = {
                    "info_name": "task_target",
                    "任务开始时间（年-月-日-时）": 0,
                    "任务用时（小时）": 0,
                    "每小时任务标注量": 0,
                    "框数": 0,
                    "费用": 0,
                    "任务总数": 0,
                }
                targetcol.update({"info_name": "task_target"}, {'$set': base_target}, True)

    all_date_task_dict = {}
    all_date_labeler_dict = {}
    for date in all_date:
        task_list = list(filter(lambda name:name.find(date) > -1 ,mongodb.database_names()))
        all_date_task_dict[date] = sorted(list(map(lambda name:name.replace(date+"-",""),task_list)))
        labeler_list = []
        for task_name in task_list:
            task_db = mongodb[task_name]
            labeler_list += list(filter(lambda name:name!="target", task_db.collection_names()))
        all_date_labeler_dict[date] = sorted(list(set(labeler_list)))

    resp_jsondata = json.dumps({"all_date":all_date,"all_date_task_dict":all_date_task_dict,"all_date_labeler_dict":all_date_labeler_dict})
    return HttpResponse(resp_jsondata)

# 根据任务名返回该任务下的标注人信息，以及该任务的指标指定
def get_task_target(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    user = request.session["user_name"]  # 当前用户
    if user != "zhangqi":
        response = JsonResponse({"msg": "抱歉，您没有权限浏览此页面！"})
        response.status_code = 403
        return response
    data_json = json.loads(request.body)
    task_name = data_json["task_name"]
    task_db = mongodb[task_name]
    # 获取指标
    targetcol = task_db["target"]
    # 如果没有指标则初始化
    if int(targetcol.count()) == 0:
        base_target = {
            "info_name": "task_target",
            "任务开始时间（年-月-日-时）": 0,
            "任务用时（小时）": 0,
            "每小时任务标注量": 0,
            "框数": 0,
            "费用": 0,
            "任务总数":0,
        }
        targetcol.update({"info_name":"task_target"},{'$set': base_target},True)
    target = targetcol.find_one()
    target.pop('_id')
    target.pop('info_name')

    labeler_list = task_db.collection_names()
    if "target" in labeler_list:
        labeler_list.remove("target")
    resp_jsondata = json.dumps({"target":target})
    return HttpResponse(resp_jsondata)

# 更新任务指标
def update_target(request):
    data_json = json.loads(request.body)
    task_name = data_json["task_name"]
    new_target = data_json["target"]
    cost_target = list(filter(lambda x: float(new_target[x]) > 0, list(new_target.keys())))
    new_target["info_name"] = "task_target"
    task_db = mongodb[task_name]
    targetcol = task_db["target"]
    targetcol.remove({"info_name": "task_target"})

    targetcol.update({"info_name":"task_target"},{'$set': new_target}, True)

    user_name_list = list(
        filter(lambda name: name.find("target") < 0 and name.find("system") < 0, task_db.collection_names()))

    for user_name in user_name_list:
        user_col = task_db[user_name]
        for dict in user_col.find():
            cost = 0
            for target in cost_target:
                try:
                    cost += int(dict[target])*float(new_target[target])
                except Exception as e:
                    print(e)
                    pass
            user_col.update({'子任务名称': dict['子任务名称']}, {'$set': {"费用":cost}}, True)
    # 更新新的
    resp_jsondata = json.dumps({"msg":"更新成功！"})
    return HttpResponse(resp_jsondata)

def get_labeler_info(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response

    data_json = json.loads(request.body)
    labeler_name = data_json["labeler_name"]
    date = data_json["current_date"]
    date_task_list = list(filter(lambda name: name.find(date) > -1, mongodb.database_names()))

    task_labeler_info = {}# 存储该标注人在该月份各个数据集下完成的任务信息
    all_task = []
    for task_name in date_task_list:
        task_db = mongodb[task_name]
        task_labeler_info[task_name] = []
        if labeler_name in task_db.collection_names():
            target = task_db["target"].find_one()
            target.pop("info_name")
            target.pop("_id")
            target["子任务名称"] = 0
            newtarget = {}
            newtarget["子任务名称"] = 0
            for key in target.keys():
                newtarget[key] = target[key]
            target = newtarget
            task_labeler_info[task_name+"_target"] = target
            all_task.append(task_name)
            info = task_db[labeler_name]
            for dict in info.find():
                dict.pop("_id")
                task_labeler_info[task_name].append(dict)

    resp_jsondata = json.dumps({"task_labeler_info": task_labeler_info,"all_task": all_task})
    return HttpResponse(resp_jsondata)

def save_labeler_info(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response

    data_json = json.loads(request.body)
    labeler_name = data_json["labeler_name"]
    labeler_task_info = data_json["labeler_task_info"]
    for task_name in labeler_task_info.keys():
        task_db = mongodb[task_name]
        labeler_col = task_db[labeler_name]
        for dict in labeler_task_info[task_name]:
            new_dict = {}
            for key in dict.keys():
                new_dict[key.split("/")[0]] = dict[key]
            labeler_col.update({'子任务名称': new_dict['子任务名称']}, {'$set': new_dict}, True)
    resp_jsondata = json.dumps({"msg": "更新成功！"})
    return HttpResponse(resp_jsondata)

def admin_get_total_cost(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    data_json = json.loads(request.body)
    date = data_json["date"]
    total_cost_info = {}
    task_list = list(filter(lambda name: name.find(date) > -1, mongodb.database_names()))
    for task_name in task_list:
        task_db =mongodb[task_name]
        user_name_list = list(filter(lambda name: name.find("target") < 0 and name.find("system") < 0, task_db.collection_names()))
        for user_name in user_name_list:
            user_db = task_db[user_name]
            for dict in user_db.find():
                if "费用" in dict.keys():
                    if user_name not in total_cost_info.keys():
                        total_cost_info[user_name] = 0.00
                    try:
                        total_cost_info[user_name] += float(dict["费用"])
                    except Exception as e:
                        print(e)
                        continue
                total_cost_info[user_name] = round(total_cost_info[user_name],2)
    resp_jsondata = json.dumps({"total_cost_info": total_cost_info})
    return HttpResponse(resp_jsondata)

def get_all_task_info(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    user = request.session["user_name"]  # 当前用户
    if user != "zhangqi":
        response = JsonResponse({"msg": "抱歉，您没有权限浏览此页面！"})
        response.status_code = 403
        return response
    all_task_db = mongodb["task_db"]
    cols = all_task_db["info"]
    all_date = cols.find_one()["all_date"]
    all_task_info = []
    for date in all_date:
        task_list = list(filter(lambda name: name.find(date) > -1, mongodb.database_names()))
        for task_name in task_list:
            task_db = mongodb[task_name]
            target = task_db["target"].find_one()
            if "_id" in target:
                target.pop("_id")
            if "info_name" in target:
                target.pop("info_name")
            all_task_info.append({task_name:target})
    resp_jsondata = json.dumps(all_task_info, indent=4, ensure_ascii=False)
    return HttpResponse(resp_jsondata,content_type="text/json/html;charset=UTF-8")

def paste_new_task(request):
    data_json = json.loads(request.body)
    copy_content = data_json["copy_content"]
    src_task = copy_content["date"]+"-"+copy_content["task"]
    dst_task = data_json["dst_date"]+"-"+copy_content["task"]

    target = mongodb[src_task]["target"].find_one()
    if "_id" in target:
        target.pop("_id")

    dst_target_col = mongodb[dst_task]["target"]
    dst_target_col.remove({"info_name": "task_target"})
    dst_target_col.update({"info_name": "task_target"}, {'$set': target}, True)
    print("任务粘贴成功")
    resp_jsondata = json.dumps({"msg": "更新成功！"})
    return HttpResponse(resp_jsondata)


