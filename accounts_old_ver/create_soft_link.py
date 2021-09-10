import os

src = "E:/data/"    #要链接的文件
dst = "static/multi_dataset_base/"#创建好的软链接
print(os.listdir('static'))
os.symlink(src, dst)