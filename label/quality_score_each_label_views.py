# -*- coding: utf8 -*-

# Create your views here.

from django.http import JsonResponse
from django.http import HttpResponse,HttpResponseRedirect
import os
import json
import numpy as np
import base64
# import git
import time
import math
import logging
import pyfcntl as fcntl

def index(request):
    return HttpResponseRedirect('/static/web/quality_score_each_label.html')


def quality_get_database_batch_list(request):

    if "user_name" not in request.session:
        print("未登陆")
        ret_json = {
            'code': "not allowed",
            'message': '未登陆',
            'result': False,
            'data': None
        }
        response = JsonResponse(ret_json)
        response.status_code = 403
        return response

    all_database_folder = '/data/pedestrian_score/'

    database_list = [
        "dataset_v1",
    ]

    database_batch_list = []
    for database_name in database_list:
        batch_all_folder = os.path.join(all_database_folder, database_name)
        batch_list = sorted(os.listdir(batch_all_folder))
        batch_list = [x for x in batch_list if x != "label_all" and x.isdigit()]
        batch_list = sorted(batch_list, key=lambda x: int(x))
        database_batch_list.append(batch_list)

    resp = {}
    resp['database_list'] = database_list
    resp['database_batch_list'] = database_batch_list
    resp_jsondata = json.dumps(resp)
    return HttpResponse(resp_jsondata)

def get_labelperson_list(current_database_name, current_batch_name, current_labelperson):
    labelperson_list = []

    all_database_folder = '/data/pedestrian_score/'

    label_result_folder = os.path.join(all_database_folder, current_database_name, 'label_all', current_batch_name)

    if not os.path.exists(label_result_folder):
        os.makedirs(label_result_folder)

    if not os.path.exists(os.path.join(label_result_folder, current_labelperson + "_label_result.json")):
        with open(os.path.join(label_result_folder, current_labelperson + "_label_result.json"), "w") as f:
            json.dump({"history_index":[], "img_result_dict":{}}, f)

    for sub_name in sorted(os.listdir(label_result_folder)):
        if not os.path.isdir(os.path.join(label_result_folder, sub_name)):
            if sub_name.endswith("_label_result.json"):
                labelperson_list.append(sub_name[:-18])

    return labelperson_list

def quality_get_all_data(request):

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
    current_database_name = req_json['current_database_name']
    current_batch_name = req_json['current_batch_name']
    current_labelperson_name = req_json['current_labelperson_name']
    current_id_index = req_json['current_id_index']
    last_label_id_index = req_json['last_label_id_index']
    last_label_result_dict_json = req_json['last_label_result_dict_json']

    current_user_name = request.session["user_name"]
    labelperson_list = get_labelperson_list(current_database_name, current_batch_name, current_user_name)

    if not current_labelperson_name:
        current_labelperson_name = labelperson_list[0]
        current_id_index = 0

    all_database_folder = '/data/pedestrian_score/'

    label_result_folder = os.path.join(all_database_folder, current_database_name, 'label_all', current_batch_name)

    current_label_file = os.path.join(label_result_folder, current_labelperson_name + "_label_result.json")

    if ((not os.path.exists(current_label_file)) or (not os.path.getsize(current_label_file))):
        with open(current_label_file, "w") as f:
            json.dump({"history_index":[], "img_result_dict":{}}, f)

    with open(current_label_file, "r") as f:
        label_result = json.load(f)



    if "history_index" in label_result:
        all_history_index = label_result["history_index"]
        all_history_index = [int(x) for x in all_history_index]
    else:
        all_history_index = []

    batch_img_folder = os.path.join(all_database_folder, current_database_name, current_batch_name)
    batch_id_name_list = os.listdir(batch_img_folder)
    batch_id_name_list.sort(key=lambda x: int(x.split(".")[0].split("_")[-1]))

    possible_confict = False

    if last_label_id_index >= 0:
        all_history_index.append(last_label_id_index)

        with open(current_label_file, "w") as f:
            label_result["history_index"] = all_history_index
            json.dump(label_result, f, indent=1)

        if batch_id_name_list[last_label_id_index] not in label_result["img_result_dict"]:
            label_result["img_result_dict"][batch_id_name_list[last_label_id_index]] = last_label_result_dict_json
            with open(current_label_file, "w") as f:
                json.dump(label_result, f, indent=1)
        else:
            old_label_result = label_result["img_result_dict"][batch_id_name_list[last_label_id_index]]
            new_label_result = last_label_result_dict_json
            if old_label_result == new_label_result:
                pass
            else:
                label_result["img_result_dict"][batch_id_name_list[last_label_id_index]] = last_label_result_dict_json
                possible_confict = True
                with open(current_label_file, "w") as f:
                    json.dump(label_result, f, indent=1)

    if possible_confict:
        current_id_index_for_front = last_label_id_index
    else:
        current_id_index_for_front = current_id_index

    current_id_name = batch_id_name_list[current_id_index_for_front]
    current_id_img_url = str(os.path.join('/static/quality_images', current_database_name, current_batch_name, current_id_name))

    if current_id_name in label_result["img_result_dict"]:
        current_id_label_result_dict = label_result["img_result_dict"][current_id_name]
    else:
        current_id_label_result_dict ={
            "is_real_man" : -1,
            "has_vehicle" : -1,
            "has_print" : -1,
            "is_multi_person" : -1,
            "crop_level" : -1,
            "crop_bad_border_level" : -1,
            "occlusion_level" : -1,
            "blur_level" : -1,
            "brightness_level" : -1,
            "pose_level" : -1,
            "contrast_level" : -1,
            "is_after_glass" : -1
        }

    resp = {}
    resp['labelperson_list'] = labelperson_list

    resp['batch_id_name_list'] = batch_id_name_list

    resp['current_id_img_url'] = current_id_img_url
    resp['current_id_index_for_front'] = current_id_index_for_front

    all_history_index_for_front = all_history_index
    resp['all_history_index_for_front'] = all_history_index_for_front

    resp['possible_confict'] = possible_confict

    resp['current_id_label_result_dict'] = current_id_label_result_dict


    resp_jsondata = json.dumps(resp)
    return HttpResponse(resp_jsondata)