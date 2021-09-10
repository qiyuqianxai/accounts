from django.http import JsonResponse
from django.http import HttpResponse,HttpResponseRedirect
import json
import pymongo
import re
mongodb = pymongo.MongoClient("10.128.128.82", 27017)

def index(request):
    return HttpResponseRedirect('/static/web/account_labeler.html')

# 返回日期列表
def get_date_and_task(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    show_date = ["2020-6"]
    all_task_db = mongodb["task_db"]
    cols = all_task_db["info"]
    all_date = cols.find_one()["all_date"]
    all_date = list(filter(lambda date:date in show_date,all_date))
    all_date_task_dict = {}
    for date in all_date:
        task_list = list(filter(lambda name:name.find(date) > -1 ,mongodb.database_names()))
        all_date_task_dict[date] = sorted_aphanumeric(list(map(lambda name:name.replace(date+"-",""),task_list)))

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
    if "_id" in target:
        target.pop("_id")
    if "info_name" in target:
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
    target_keys = list(filter(lambda key:key.find("任务总数") < 0 and key.find("每小时任务标注量") < 0 and key.find("任务总张数") < 0 and key.find("任务总框数") < 0,list(target.keys())))
    resp_jsondata = json.dumps({"all_child_task_info": all_child_task_info,"target":["子任务名称"]+target_keys,"target_weight":target})
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

    targetcol = task_db["target"]
    # 指标以target为准
    target = targetcol.find_one()
    if "_id" in target.keys():
        target.pop("_id")
    if "info_name" in target.keys():
        target.pop("info_name")

    for info in child_info:
        if info["子任务名称"] == "":
            continue
        ckey = ""
        for key in info.keys():
            if key.find("费用")>-1:
                ckey = key
                break
        if ckey=="":
            ckey = "费用"
        info[ckey] = 0
        for key in info.keys():
            if key != ckey and key in target.keys():
                if float(target[key]) > 0.0:
                    print(key,target[key],info[key])
                    info[ckey] += round(float(target[key])*float(info[key]),2)
        user_col.update({"子任务名称":info["子任务名称"]},{'$set': info},True)
        print("update success")
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
                    total_cost += round(float(dict["费用"]),2)
                except Exception as e:
                    print(e)
                    continue
    resp_jsondata = json.dumps({"total_cost": total_cost})
    return HttpResponse(resp_jsondata)

def sorted_aphanumeric(data):
    convert = lambda text: int(text) if text.isdigit() else text.lower()
    alphanum_key = lambda key: [ convert(c) for c in re.split('([0-9]+)', key) ]
    return sorted(data, key=alphanum_key)
