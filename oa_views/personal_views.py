from django.http import JsonResponse
from django.http import HttpResponse,HttpResponseRedirect
import json
import pymongo
import hashlib
import os
from django.shortcuts import render, redirect
import re
import datetime
mongodb = pymongo.MongoClient("10.128.128.82", 27017)
persondb = mongodb["all_person_info"]
admin_user = ["jianglijuan","zhangqi","yckj1989","蒋丽娟","zhouxiang"]

def index(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    return HttpResponseRedirect('/static/oa/index.html')

def get_person_data(request):
    if "user_name" not in request.session:
        response = JsonResponse({"msg": "抱歉，请先登录！"})
        response.status_code = 403
        return response
    user_name = request.session["user_name"]
    person_dict = persondb[user_name].find_one()
    person_dict.pop("_id")
    response = HttpResponse(json.dumps({"personal_data": person_dict}))
    return response

def update_person_data(request):
    user_name = request.session["user_name"]
    new_person_data = json.loads(request.body)
    if new_person_data["用户名"] == "":
        return HttpResponse(json.dumps({"msg": "填写不合法！"}))
    if user_name == new_person_data["用户名"]:
        userdb = persondb[user_name]
        userdb.update({"用户名":user_name},{"$set": new_person_data},True)
    elif new_person_data["用户名"] in persondb.collection_names():
        return HttpResponse(json.dumps({"msg": "该用户名已被注册！"}))
    else:
        new_userdb = persondb[new_person_data["用户名"]]
        new_userdb.update({"用户名":new_person_data["用户名"]},{"$set": new_person_data},True)
        persondb.drop_collection(user_name)
        request.session["user_name"] = new_person_data["用户名"]
    print(user_name,"个人信息更新完成")
    return HttpResponse(json.dumps({"msg": "更新成功"}))

def get_all_account_data(request):
    user_name = request.session["user_name"]
    user_db = persondb[user_name]
    user_dict = user_db.find_one()
    if user_dict.get("权限","") != "admin":
        response = JsonResponse({"msg": "抱歉，您没有权限！"})
        response.status_code = 403
        return response
    all_account_data = []
    person_lst = persondb.collection_names()
    for user_name in person_lst:
        if user_name.startswith("system"):
            continue
        user_db = persondb[user_name]
        user_dict = user_db.find_one()
        account_data = {
            "用户名":user_dict.get("用户名",""),
            "权限":user_dict.get("权限",""),
            "姓名":user_dict.get("姓名",""),
            "密码": user_dict.get("密码", ""),
            "注册时间": user_dict.get("注册时间", ""),
            "状态":user_dict.get("状态","")
        }
        all_account_data.append(account_data)
    all_account_data = sorted(all_account_data,key=lambda x:x["注册时间"],reverse=True)
    return HttpResponse(json.dumps({"all_account_data":all_account_data}))

def add_account(request,user_type):
    user_name = request.session["user_name"]
    user_db = persondb[user_name]
    user_dict = user_db.find_one()
    if user_dict.get("权限", "") != "admin":
        response = JsonResponse({"msg": "抱歉，您没有权限！"})
        response.status_code = 403
        return response
    register_time = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    user_name = hashlib.md5(register_time.encode(encoding="utf-8")).hexdigest()
    user_db = persondb[user_name]
    if user_type == "admin":
        base_dict = {
            "用户名": user_name,
            "密码": "123456",
            "权限": "admin",
            "姓名": "",
            "职级": "",
            "工龄": "",
            "身份证号码": "",
            "银行卡号": "",
            "状态":"正常",
            "注册时间": register_time,
        }
    else:
        base_dict = {
            "用户名": user_name,
            "密码": "123456",
            "权限": "normal",
            "姓名": "",
            "职级": "",
            "工龄": "",
            "身份证号码": "",
            "银行卡号": "",
            "状态": "正常",
            "注册时间": register_time,
        }
    user_db.update({"用户名":user_name},{"$set": base_dict},True)
    response = JsonResponse({"msg": "ok"})
    return response

def edit_account(request,opt,user):
    user_name = request.session["user_name"]
    user_db = persondb[user_name]
    user_dict = user_db.find_one()
    if user_dict.get("权限", "") != "admin":
        response = JsonResponse({"msg": "抱歉，您没有权限！"})
        response.status_code = 403
        return response
    userdb = persondb[user]
    if opt == "del":
        persondb.drop_collection(user)
    elif opt == "stop":
        userdb.update({"用户名":user},{"$set":{"状态":"停用"}})
    elif opt == "start":
        userdb.update({"用户名": user}, {"$set": {"状态": "正常"}})
    elif opt == "change_auth":
        orc_user_dict = userdb.find_one()
        if orc_user_dict["权限" ] == "normal":
            userdb.update({"用户名": user}, {"$set": {"权限": "admin"}})
        else:
            userdb.update({"用户名": user}, {"$set": {"权限": "normal"}})
    response = JsonResponse({"msg": "ok"})
    return response