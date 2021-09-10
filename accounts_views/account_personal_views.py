from django.http import JsonResponse
from django.http import HttpResponse,HttpResponseRedirect
import json
import pymongo
import re

mongodb = pymongo.MongoClient("10.128.128.82", 27017)
admin_user = ["zhouxiang","yckj1989","蒋丽娟","zhangqi"]
persondb = mongodb["all_person_info"]
person_lst = [name for name in persondb.collection_names() if not name.startswith("system")]

def sorted_aphanumeric(data):
    convert = lambda text: int(text) if text.isdigit() else text.lower()
    alphanum_key = lambda key: [ convert(c) for c in re.split('([0-9]+)', key) ]
    return sorted(data, key=alphanum_key)

def get_date_list(request,mark_name):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "Sorry, you have not logged in!"})
        response.status_code = 403
        return response
    auth = request.session["auth"]
    if auth != "admin":
        response = JsonResponse({"msg": "Sorry, you do not have permission to browse this page!"})
        response.status_code = 403
        return response
    all_date_info = {}
    mark_name = mark_name.strip()
    database_names = mongodb.database_names()
    database_names = [name for name in database_names if name.startswith("20")]
    database_names.sort()
    if len(database_names) > 12:
        database_names = database_names[-12:]
    for date in database_names:
        if date not in all_date_info:
            all_date_info[date] = {
                "工资":0,
                "工时":0,
                "完成任务数":0,
                "工作天数":0,
                "日平均工作时长":0,
                "平均收入时效":0
            }
        task_list = [task_name for task_name in mongodb[date].collection_names() if
                     not task_name.startswith("system") and task_name.find("_target") < 0]
        for task in task_list:
            for dict in mongodb[date][task].find():
                if dict["标注人"] != mark_name:
                    continue
                else:
                    all_date_info[date]["完成任务数"] += 1
                if "费用" in dict.keys():
                    try:
                        all_date_info[date]["工资"] += float(dict["费用"])
                    except Exception as e:
                        # print(e)
                        pass
                if "任务用时（小时）" in dict.keys():
                    try:
                        time = dict["任务用时（小时）"]
                        time_str = ""
                        for s in time:
                            if s.isdigit() or s == ".":
                                time_str += s
                            else:
                                break
                        all_date_info[date]["工时"] += float(time_str)
                    except Exception as e:
                        # print(e)
                        continue


    for date in all_date_info:
        all_date_info[date]["工资"] = round(all_date_info[date]["工资"], 2)
        all_date_info[date]["工时"] = round(all_date_info[date]["工时"], 2)
        try:
            all_date_info[date]["平均收入时效"] = round(all_date_info[date]["工资"]/all_date_info[date]["工时"],2)
        except Exception as e:
            pass
    personal_info = persondb[mark_name].find_one()
    if "_id" in personal_info:
        personal_info.pop("_id")
    resp_jsondata = json.dumps({"all_date": database_names,"all_date_info":all_date_info,"personal_info":personal_info})
    return HttpResponse(resp_jsondata)

def get_task_info(request,mark_name,date):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "Sorry, you have not logged in!"})
        response.status_code = 403
        return response
    total_cost = 0
    total_time = 0
    mark_name = mark_name.strip()
    task_list = [task_name for task_name in mongodb[date].collection_names() if
                     not task_name.startswith("system") and task_name.find("_target") < 0]
    for task_name in task_list:
        task_col = mongodb[date][task_name]
        for dict in task_col.find():
            if dict["标注人"] == mark_name:
                if "费用" in dict.keys():
                    try:
                        total_cost += float(dict["费用"])
                    except Exception as e:
                        # print(e)
                        pass
                if "任务用时（小时）" in dict.keys():
                    try:
                         time = dict["任务用时（小时）"]
                         time_str = ""
                         for s in time:
                            if s.isdigit() or s == ".":
                                time_str += s
                            else:
                                break
                         total_time += float(time_str)
                    except Exception as e:
                        # print(e)
                        continue
    total_cost = round(total_cost,2)
    total_time = round(total_time,2)
    resp_jsondata = json.dumps({"salary": total_cost,"work_time":total_time})
    return HttpResponse(resp_jsondata)

