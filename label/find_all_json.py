import os

all_database_folder = '/home/yufufu/dataset/video/mall_video/mot/patch'

sub_folders = sorted(os.listdir(all_database_folder))
sub_folders = [os.path.join(all_database_folder, x) for x in sub_folders if os.path.isdir(os.path.join(all_database_folder, x))]
sub_folders = [x for x in sub_folders if os.path.isdir(x)]

for sub_folder in sub_folders:
    for sub_file in sorted(os.listdir(sub_folder)):
        if sub_file.endswith(".json"):
            print(os.path.join(sub_folder, sub_file))
            with open(os.path.join(sub_folder, sub_file), 'w') as f:
                pass