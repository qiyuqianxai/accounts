from django.http import JsonResponse
from django.http import HttpResponse,HttpResponseRedirect
import json
import pymongo
import re

mongodb = pymongo.MongoClient("10.128.128.82", 27017)
admin_user = ["zhouxiang","yckj1989","蒋丽娟","zhangqi"]

def sorted_aphanumeric(data):
    convert = lambda text: int(text) if text.isdigit() else text.lower()
    alphanum_key = lambda key: [ convert(c) for c in re.split('([0-9]+)', key) ]
    return sorted(data, key=alphanum_key)

def get_date_task_info(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "Sorry, you have not logged in!"})
        response.status_code = 403
        return response
    auth = request.session["auth"]
    if auth != "admin":
        response = JsonResponse({"msg": "Sorry, you do not have permission to browse this page!"})
        response.status_code = 403
        return response
    all_date_task_info = {}
    person_total_info = {}
    database_names = mongodb.database_names()
    database_names = [name for name in database_names if name.startswith("20")]
    database_names.sort()
    if len(database_names) > 12:
        database_names = database_names[-12:]
    for date in database_names:
        task_list = [task_name for task_name in mongodb[date].collection_names() if
                     not task_name.startswith("system") and task_name.find("_target") < 0]
        if date not in all_date_task_info:
            all_date_task_info[date] = {
                "月完成数据量": 0,
                "月工作时长": 0,
                "月总支出": 0,
                "月工作人数": [],
                "月完成任务数": len(task_list),
                "月任务成本时效":0
            }
        for task in task_list:
            try:
                all_date_task_info[date]["月完成数据量"] += \
                    int(mongodb[date][task + "_target"].find_one()["任务总张数"]) + int(
                        mongodb[date][task + "_target"].find_one()["任务总框数"])
            except Exception as e:
                pass
            for dict in mongodb[date][task].find():
                user_name = dict["标注人"]
                if user_name not in person_total_info:
                    person_total_info[user_name] = {
                        "总收入":0,
                        "总工作时长":0,
                        "总工作天数":0,
                        "总任务数":1,
                        "总时效":0
                    }
                else:
                    person_total_info[user_name]["总任务数"] += 1
                if "费用" in dict.keys():
                    try:
                        all_date_task_info[date]["月总支出"] += float(dict["费用"])
                        person_total_info[user_name]["总收入"] += float(dict["费用"])
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
                        all_date_task_info[date]["月工作时长"] += float(time_str)
                        person_total_info[user_name]["总工作时长"] += float(time_str)
                    except Exception as e:
                        # print(e)
                        continue
                all_date_task_info[date]["月工作人数"].append(user_name)

    for date in all_date_task_info:
        all_date_task_info[date]["月工作时长"] = round(all_date_task_info[date]["月工作时长"],2)
        all_date_task_info[date]["月总支出"] = round(all_date_task_info[date]["月总支出"],2)
        all_date_task_info[date]["月工作人数"] = len(set(all_date_task_info[date]["月工作人数"]))
        try:
            all_date_task_info[date]["月任务成本时效"] = round(all_date_task_info[date]["月总支出"]/all_date_task_info[date]["月工作时长"],2)
        except Exception as e:
            pass
    for person in person_total_info:
        try:
            person_total_info[person]["总时效"] = round(person_total_info[person]["总收入"]/person_total_info[person]["总工作时长"],2)
        except Exception as e:
            pass
    person_total_info_sorted = {
        "总收入":[],
        "总工作时长":[],
        "总工作天数":[],
        "总任务数":[],
        "总时效":[]
    }
    onjob_person = mongodb["all_person_info"].collection_names()
    onjob_person = [name for name in onjob_person if name.find("system") < 0]
    for person in person_total_info:
        if person not in onjob_person:
            continue
        for key in person_total_info_sorted:
            person_total_info_sorted[key].append([person,round(person_total_info[person][key],2)])
    for key in person_total_info_sorted:
        person_total_info_sorted[key] = sorted(person_total_info_sorted[key],key=lambda x:x[1],reverse=True)

    resp_jsondata = json.dumps({"all_date_task_info": all_date_task_info,"person_total_info_sorted":person_total_info_sorted,"person_total_info":person_total_info})
    return HttpResponse(resp_jsondata)

def get_date_info(request,current_date):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "Sorry, you have not logged in!"})
        response.status_code = 403
        return response
    auth = request.session["auth"]
    if auth != "admin":
        response = JsonResponse({"msg": "Sorry, you do not have permission to browse this page!"})
        response.status_code = 403
        return response
    date_task_info = {}
    date_person_info = {}
    person_cost_ef = {}
    database_names = mongodb.database_names()
    database_names.sort()
    task_list = [task_name for task_name in mongodb[current_date].collection_names() if
                 not task_name.startswith("system") and task_name.find("_target") < 0]
    for task_name in task_list:
        task_col = mongodb[current_date][task_name]
        if task_name not in date_task_info:
            date_task_info[task_name] = {
                "任务所用时间":0,
                "任务所用人数":0,
                "任务所用费用":0,
                "任务数据量":0,
                "预估任务数量时效":0
            }
        if task_name not in person_cost_ef:
            person_cost_ef[task_name] = []
        try:
            date_task_info[task_name]["任务数据量"] = \
                int(mongodb[current_date][task_name+"_target"].find_one()["任务总张数"]) + int(
                    mongodb[current_date][task_name+"_target"].find_one()["任务总框数"])
        except Exception as e:
            print(e)
            pass
        try:
            date_task_info[task_name]["预估任务数量时效"] = mongodb[current_date][task_name+"_target"].find_one()["每小时任务标注量"]
        except Exception as e:
            pass
        use_persons = []
        for dict in task_col.find():
            use_persons.append(dict["标注人"])
            user_name = dict["标注人"]
            if user_name not in date_person_info:
                date_person_info[user_name] = {
                    "月工作时长":0,
                    "月收入":0,
                    "月工作天数":0,
                    "月完成任务数":1,
                    "月工作时效":0,
                }
            else:
                date_person_info[user_name]["月完成任务数"] += 1
            person_task_salary = 0
            person_task_time = 0
            if "费用" in dict.keys():
                try:
                    date_task_info[task_name]["任务所用费用"] += float(dict["费用"])
                    date_person_info[user_name]["月收入"] += float(dict["费用"])
                    person_task_salary += float(dict["费用"])
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
                    date_task_info[task_name]["任务所用时间"] += float(time_str)
                    date_person_info[user_name]["月工作时长"] += float(time_str)
                    person_task_time += float(time_str)
                except Exception as e:
                    # print(e)
                    continue
            try:
                person_task_ef = round(person_task_salary/person_task_time,2)
            except Exception as e:
                person_task_ef = 0
                pass
            person_cost_ef[task_name].append([user_name,person_task_ef])
        date_task_info[task_name]["任务所用人数"] = len(set(use_persons))
        date_task_info[task_name]["任务所用费用"] = round(date_task_info[task_name]["任务所用费用"], 2)
        date_task_info[task_name]["任务所用时间"] = round(date_task_info[task_name]["任务所用时间"], 2)

    for person in date_person_info:
        try:
            date_person_info[person]["月工作时效"] = round(date_person_info[person]["月收入"]/date_person_info[person]["月工作时长"],2)
        except Exception as e:
            pass
        date_person_info[person]["月收入"] = round(date_person_info[person]["月收入"],2)
        date_person_info[person]["月工作时长"] = round(date_person_info[person]["月工作时长"], 2)

    for task_name in person_cost_ef:
        person_cost_ef[task_name] = sorted(person_cost_ef[task_name],key=lambda x:x[1],reverse=True)

    month_person_info_sorted = {
        "月工作时长": [],
        "月收入": [],
        "月工作天数": [],
        "月完成任务数": [],
        "月工作时效":[]
    }
    for peron in date_person_info:
        for key in month_person_info_sorted:
            month_person_info_sorted[key].append([peron, round(date_person_info[peron][key], 2)])
    for key in month_person_info_sorted:
        month_person_info_sorted[key] = sorted(month_person_info_sorted[key], key=lambda x: x[1], reverse=True)
    resp_jsondata = json.dumps({"date_task_info": date_task_info,"month_person_info_sorted":month_person_info_sorted,'person_cost_ef':person_cost_ef})
    return HttpResponse(resp_jsondata)