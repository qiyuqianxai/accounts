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
from io import BytesIO
import cv2
from PIL import Image

def index(request):
    return HttpResponseRedirect('/static/web/index_image_shower.html')

def query(request):
    req_json = json.loads(request.body)
    selected_folder_path = req_json['selected_folder_path']
    current_mot_id_name = req_json['current_mot_id_name']

    # get all mot id
    if os.path.isdir(selected_folder_path) == False:
        print("os.path.isdir(selected_folder_path) == False")
        ret_json = {
            'code': "query",
            'message': 'os.path.isdir(selected_folder_path) == False',
            'result': False,
            'data': req_json
        }
        response = JsonResponse(ret_json)
        response.status_code = 403
        return response

    sub_folder_name = os.listdir(selected_folder_path)
    mot_id_names = [x for x in sub_folder_name if str(x).isnumeric()]
    mot_id_names = sorted(mot_id_names, key=lambda x:int(x))

    if mot_id_names.__len__() < 1:
        print("mot_id_names.__len__() < 1")
        ret_json = {
            'code': "query",
            'message': 'mot_id_names.__len__() < 1',
            'result': False,
            'data': req_json
        }
        response = JsonResponse(ret_json)
        response.status_code = 403
        return response

    if current_mot_id_name not in mot_id_names:
        current_mot_id_name = mot_id_names[0]

    current_mot_id_folder = os.path.join(selected_folder_path, current_mot_id_name)
    # current_mot_id_img_all_name_list = sorted(os.listdir(current_mot_id_folder), key=lambda x: int(x.split('_')[0]))
    current_mot_id_img_all_name_list = sorted(os.listdir(current_mot_id_folder))
    # with open(os.path.join(current_mot_id_folder, 'patch_image_names.json'), 'r') as f:
    #     save_result = json.load(f)
    # current_mot_id_img_all_name_list = save_result['file_name']
    # current_mot_id_img_all_xywh_list = save_result['small_xywh']

    current_mot_id_img_show_name_list = []
    current_mot_id_img_show_num = 200
    if current_mot_id_img_all_name_list.__len__() <= current_mot_id_img_show_num:
        current_mot_id_img_show_name_list = current_mot_id_img_all_name_list
    else:
        for i in range(0, int(current_mot_id_img_all_name_list.__len__() / (current_mot_id_img_show_num-1)) * (current_mot_id_img_show_num-1),
                       int(current_mot_id_img_all_name_list.__len__() / (current_mot_id_img_show_num-1))):
            current_mot_id_img_show_name_list.append(current_mot_id_img_all_name_list[i])
        current_mot_id_img_show_name_list.append(current_mot_id_img_all_name_list[-1])
    current_mot_id_img_url_list = []

    # all_patch_folder = os.path.join(os.path.dirname(selected_folder_path), '10000')
    all_patch_folder = current_mot_id_folder
    for idx, img_name in enumerate(current_mot_id_img_show_name_list):
        # small_x, small_y, w, h = current_mot_id_img_all_xywh_list[idx]
        # img = cv2.imdecode(np.fromfile(os.path.join(all_patch_folder, img_name).encode('utf-8'), dtype=np.uint8), -1)
        # img_roi = img[small_y:small_y + h, small_x:small_x + w].copy()
        # pil_img_crop = Image.fromarray(cv2.cvtColor(img_roi, cv2.COLOR_BGR2RGB))
        # buff = BytesIO()
        # pil_img_crop.save(buff, format='JPEG')
        # current_mot_id_img_url_list.append('data:image/jpeg;base64,'+base64.b64encode(buff.getvalue()).decode("utf-8"))
        current_mot_id_img_url_list.append('data:image/jpeg;base64,'+base64.b64encode(open(os.path.join(all_patch_folder, img_name).encode('utf-8'), "rb").read()))

    resp = {}

    resp['current_mot_id_img_url_list'] = current_mot_id_img_url_list
    resp['current_mot_id_img_filename_list'] = current_mot_id_img_show_name_list

    resp['current_mot_id_name'] = current_mot_id_name
    resp['mot_id_name_list'] = mot_id_names

    resp_jsondata = json.dumps(resp)
    return HttpResponse(resp_jsondata)