from django.http import JsonResponse
from django.http import HttpResponse,HttpResponseRedirect
from .extrac_table import extract_db, create_excel, extract_db_count,zip_out_file
import json
import pymongo
from django.shortcuts import render, redirect
import re
mongodb = pymongo.MongoClient("10.128.128.82", 27017)
admin_user = ["jianglijuan","zhangqi","yckj1989","蒋丽娟","zhouxiang"]
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
    auth = request.session["auth"]
    if auth != "admin":
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
    show_date = col.find_one().get("show_date",[])

    # 更新任务db,不存在就设为默认值
    for date in all_date_task_dict.keys():
        for db in all_date_task_dict[date]:
            if db + "_target" in mongodb[date].collection_names():
                continue
            task_db_tar_col = mongodb[date][db+"_target"]
            base_target = {
                "info_name": "task_target",
                "任务开始时间（年-月-日-时）": 0,
                "任务用时（小时）": 0,
                "每小时任务标注量": 0,
                "框数": 0,
                "费用": 0,
                "任务总张数": 0,
                "任务总框数": 0
            }
            task_db_tar_col.update({"info_name": "task_target"}, {'$set': base_target}, True)

    all_date_task_dict = {}
    all_date_labeler_dict = {}
    for date in all_date:
        task_list = [task_name.replace("_target","") for task_name in mongodb[date].collection_names() if not task_name.startswith("system")]
        task_list = list(set(task_list))
        all_date_task_dict[date] = sorted_aphanumeric(task_list)
        labeler_list = []
        for task_name in task_list:
            task_col = mongodb[date][task_name]
            for dict in task_col.find():
                name = dict.get("标注人",False)
                if name:
                    labeler_list.append(name)
        all_date_labeler_dict[date] = sorted(list(set(labeler_list)))
    all_person_list = mongodb["all_person_info"].collection_names()
    all_person_list = [name for name in all_person_list if name.find("system") < 0]
    resp_jsondata = json.dumps({"all_date":all_date,
                                "all_date_task_dict":all_date_task_dict,
                                "all_date_labeler_dict":all_date_labeler_dict,
                                "all_person_list":all_person_list,
                                "show_date": show_date})
    return HttpResponse(resp_jsondata)

# 根据任务名返回该任务下的标注人信息，以及该任务的指标指定
def get_task_target(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    auth = request.session["auth"]
    if auth != "admin":
        response = JsonResponse({"msg": "抱歉，您没有权限浏览此页面！"})
        response.status_code = 403
        return response
    data_json = json.loads(request.body)
    task_name = data_json["task_name"]
    date = "-".join(task_name.split("-")[:2])
    task_name = "-".join(task_name.split("-")[2:])
    # 获取指标
    targetcol = mongodb[date][task_name+"_target"]
    # 如果没有指标则初始化
    if int(targetcol.count()) == 0:
        base_target = {
            "info_name": "task_target",
            "任务开始时间（年-月-日-时）": 0,
            "任务用时（小时）": 0,
            "每小时任务标注量": 0,
            "框数": 0,
            "费用": 0,
            "任务总张数": 0,
            "任务总框数": 0,
        }
        targetcol.update({"info_name":"task_target"},{'$set': base_target},True)
    target = targetcol.find_one()
    target.pop('_id')
    target.pop('info_name')

    resp_jsondata = json.dumps({"target":target})
    return HttpResponse(resp_jsondata)

# 更新任务指标
def update_target(request):
    data_json = json.loads(request.body)
    task_name = data_json["task_name"]
    new_target = data_json["target"]
    date = "-".join(task_name.split("-")[:2])
    task_name = "-".join(task_name.split("-")[2:])
    cost_target = list(filter(lambda x: float(new_target[x]) > 0, list(new_target.keys())))
    new_target["info_name"] = "task_target"
    task_col = mongodb[date][task_name]
    targetcol = mongodb[date][task_name+"_target"]
    targetcol.remove({"info_name": "task_target"})
    targetcol.update({"info_name":"task_target"},{'$set': new_target}, True)
    for dict in task_col.find():
        cost = 0
        for target in cost_target:
            try:
                cost += float(round(float(dict[target])*float(new_target[target]),2))
            except Exception as e:
                # print(e)
                pass
        task_col.update(dict, {'$set': {"费用":cost}}, True)
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
    date_task_list = list(filter(lambda name: name.find("_target") < 0 and not name.startswith("system"), mongodb[date].collection_names()))

    task_labeler_info = {}# 存储该标注人在该月份各个数据集下完成的任务信息
    all_task = []
    for task_name in date_task_list:
        task_col = mongodb[date][task_name]
        task_tar_col = mongodb[date][task_name+"_target"]
        target = task_tar_col.find_one()
        target.pop("info_name")
        target.pop("_id")
        target["子任务名称"] = 0
        newtarget = {}
        newtarget["子任务名称"] = 0
        for key in target.keys():
            newtarget[key] = target[key]
        target = newtarget
        # task_labeler_info[date+"-"+task_name+"_target"] = target
        for dict in task_col.find():
            if dict["标注人"] == labeler_name:
                dict.pop("_id")
                dict.pop("标注人")
                if date+"-"+task_name not in task_labeler_info:
                    task_labeler_info[date+"-"+task_name] = []
                task_labeler_info[date+"-"+task_name].append(dict)
                if date+"-"+task_name+"_target" not in task_labeler_info:
                    task_labeler_info[date+"-"+task_name+"_target"] = target
                if date + "-" + task_name not in all_task:
                    all_task.append(date + "-" + task_name)
    # print(task_labeler_info)
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
        date = "-".join(task_name.split("-")[:2])
        task = "-".join(task_name.split("-")[2:])
        task_db = mongodb[date][task]
        for dict in labeler_task_info[task_name]:
            new_dict = {}
            cost = 0.0
            for key in dict.keys():
                new_dict[key.split("/")[0]] = dict[key]
                if len(key.split("/")) > 1:
                    danjia = "".join([s for s in key.split("/")[1] if s.isdigit() or s=="." ])
                    print(float(danjia))
                    try:
                        cost += float(round(float(dict[key])*float(danjia),2))
                    except Exception as e:
                        pass
                new_dict["费用"] = cost
            task_db.update({'子任务名称': new_dict['子任务名称'],'标注人':labeler_name}, {'$set': new_dict}, True)
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
    task_list = [task_name for task_name in mongodb[date].collection_names() if not task_name.startswith("system") and task_name.find("_target") < 0]
    for task_name in task_list:
        task_col = mongodb[date][task_name]
        for dict in task_col.find():
            user_name = dict["标注人"]
            if "费用" in dict.keys():
                if user_name not in total_cost_info.keys():
                    total_cost_info[user_name] = 0.00
                try:
                    total_cost_info[user_name] += float(dict["费用"])
                except Exception as e:
                    # print(e)
                    continue
            total_cost_info[user_name] = round(total_cost_info[user_name],2)
    temp = sorted(total_cost_info.items(),key=lambda x:x[1],reverse=True)
    total_cost_info = {}
    for val in temp:
        total_cost_info[val[0]] = val[1]
    resp_jsondata = json.dumps({"total_cost_info": total_cost_info})
    return HttpResponse(resp_jsondata)

def get_all_task_info(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    auth = request.session["auth"]
    if auth != "admin":
        response = JsonResponse({"msg": "抱歉，您没有权限浏览此页面！"})
        response.status_code = 403
        return response

def personal_info(request,person_name):
    print(person_name)
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
    cols = all_task_db["info"]
    all_date = cols.find_one()["all_date"]
    all_task_info = []
    for date in all_date:
        task_list = [task_name for task_name in mongodb[date].collection_names() if not task_name.startswith("system") and task_name.find("_target") < 0]
        for task_name in task_list:
            task_tar = mongodb[date][task_name+"_target"]
            target = task_tar.find_one()
            if "_id" in target:
                target.pop("_id")
            if "info_name" in target:
                target.pop("info_name")
        all_task_info.append({date+"-"+task_name:target})
        resp_jsondata = json.dumps(all_task_info, indent=4, ensure_ascii=False)
    return HttpResponse(resp_jsondata,content_type="text/json/html;charset=UTF-8")


# all_task_db:

def paste_new_task(request):
    data_json = json.loads(request.body)
    copy_content = data_json["copy_content"]
    src_date = copy_content["date"]
    src_task = copy_content["task"]
    dst_date = data_json["dst_date"]
    dst_task = copy_content["task"]
    target = mongodb[src_date][src_task+"_target"].find_one()
    if "_id" in target:
        target.pop("_id")

    dst_target_col = mongodb[dst_date][dst_task+"_target"]
    dst_target_col.remove({"info_name": "task_target"})
    dst_target_col.update({"info_name": "task_target"}, {'$set': target}, True)
    # db.command({"renameCollection": "%s.target"%src_task, "to": "%s.target"%dst_task})
    print("任务粘贴成功")
    resp_jsondata = json.dumps({"msg": "更新成功！"})
    return HttpResponse(resp_jsondata)

def sorted_aphanumeric(data):
    convert = lambda text: int(text) if text.isdigit() else text.lower()
    alphanum_key = lambda key: [ convert(c) for c in re.split('([0-9]+)', key) ]
    return sorted(data, key=alphanum_key)

def get_task_done_target(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    auth = request.session["auth"]
    if auth != "admin":
        response = JsonResponse({"msg": "抱歉，您没有权限浏览此页面！"})
        response.status_code = 403
        return response
    data_json = json.loads(request.body)
    task_name = data_json["task_name"]
    date = "-".join(task_name.split("-")[:2])
    task = "-".join(task_name.split("-")[2:])
    task_db = mongodb[date][task]

    all_labeler_info = {}
    for dict in task_db.find():
        labeler = dict["标注人"]
        if labeler not in all_labeler_info:
            all_labeler_info[labeler] = []
        dict.pop("_id")
        dict.pop("标注人")
        all_labeler_info[labeler].append(dict)
    resp_jsondata = json.dumps({"all_labeler_info": all_labeler_info})
    return HttpResponse(resp_jsondata)

def delete_task(request, dataset):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    user = request.session["user_name"]  # 当前用户
    auth = request.session["auth"]
    if auth != "admin":
        response = JsonResponse({"msg": "抱歉，您没有权限浏览此页面！"})
        response.status_code = 403
        return response
    task_name = "-".join(dataset.split("-")[2:])
    date = "-".join(dataset.split("-")[:2])
    db = mongodb[date]
    db.drop_collection(task_name)
    db.drop_collection(task_name + "_target")
    print(user,"delete:",dataset)
    response = JsonResponse({})
    response.status_code = 200
    return response

def personal_info(request,person_name):
    print(person_name)
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    auth = request.session["auth"]
    if auth != "admin":
        response = JsonResponse({"msg": "抱歉，您没有权限浏览此页面！"})
        response.status_code = 403
        return response
    person_info = {
        "mark_name":person_name,
        "work_year":0,
        "grade":0
    }
    return render(request, 'web/account_admin_personinfo.html', person_info)

def get_static_task_info(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    auth = request.session["auth"]
    if auth != "admin":
        response = JsonResponse({"msg": "抱歉，您没有权限浏览此页面！"})
        response.status_code = 403
        return response
    return render(request, 'web/static_task.html', {})

def download_payroll(request,month_date):
    print(month_date)
    extract_db_count(month_date)
    total_cost_info = extract_db(month_date)
    create_excel(total_cost_info,month_date)
    zip_out_file("static/file/accounts")
    print("导出完成！")
    return HttpResponseRedirect("/static/file/accounts.zip")

def switch_date(request,date):
    all_data_db = mongodb["task_db"]
    col = all_data_db["info"]
    show_date = col.find_one().get("show_date", [])
    if date not in show_date:
        show_date.append(date)
    else:
        show_date.remove(date)
    col.update({'info_name': "date_list"}, {'$set': {"show_date": show_date}}, True)
    print("当前显示日期：",show_date)
    response = JsonResponse({"msg": "success"})
    response.status_code = 200
    return response

def task_add_chi_task(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    add_task_info = json.loads(request.body)
    date = add_task_info["date"]
    task = add_task_info["task"]
    dict = add_task_info["dict"]
    all_person_list = mongodb["all_person_info"].collection_names()
    all_person_list = [name for name in all_person_list if name.find("system") < 0]
    if dict["标注人"] not in all_person_list:
        response = JsonResponse({"msg": "标注人不在人员库中，请检查标注人是否正确！"})
        response.status_code = 403
        return response
    if dict["子任务名称"] == "":
        response = JsonResponse({"msg": "子任务名称为空！"})
        response.status_code = 403
        return response
    col = mongodb[date][task]
    col_tar = mongodb[date][task+"_target"]
    tar_dict = col_tar.find_one()
    cost = 0
    for key in dict:
        try:
            cost += float(dict[key])*float(tar_dict.get(key,0))
        except Exception as e:
            print(e)
            continue
    dict["费用"] = round(cost,2)
    col.update({"子任务名称":dict["子任务名称"],"标注人":dict["标注人"]},{'$set': dict},True)
    print(dict)
    if cost == 0:
        col.delete_one(dict)
    response = JsonResponse({"msg": "更新成功"})
    response.status_code = 200
    return response
