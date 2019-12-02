# -*- coding: utf8 -*-

# Create your views here.

import os
import json
import base64
import git
import time

if __name__ == '__main__':
    while True:
        repo = git.Repo("/home/yufufu/dataset/video/mall_video/mot/patch/")
        # index = repo.index
        # index.add([current_video_name + '/' + current_labelperson_name + "_label_result.json"])
        # newcommit = index.commit(current_user_name)
        origin = repo.remotes.origin
        origin.push() #time costing and not stable
        print(time.localtime(time.time()))
        time.sleep(3600)
