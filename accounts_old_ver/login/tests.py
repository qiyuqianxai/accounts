# from django.test import TestCase

# Create your tests here.

import os

def listimg():
	imglibs = {}
	imgroot = '../static/img'
	for dirpath, dirnames, filenames in os.walk(imgroot):
		if not filenames:
			continue
		realpth = os.path.relpath(dirpath, '../static')
		camera_info, person_id = dirpath.split('\\')[-2:]
		camera_info = camera_info.split('_')
		camera_id= camera_info[0]
		camera_time_range = '_'.join(camera_info[1:])
		select = [filenames[0], filenames[-1]]
		if camera_id not in imglibs:
				imglibs[camera_id] ={camera_time_range: {person_id: [os.path.join(realpth, name) for name in select]}}
		elif camera_time_range not in imglibs[camera_id]:
			imglibs[camera_id][camera_time_range] = {person_id: [os.path.join(realpth, name) for name in select]}
		else:
			imglibs[camera_id][camera_time_range][person_id] =  [os.path.join(realpth, name) for name in select]
	return imglibs

if __name__ == '__main__':
	listimg()