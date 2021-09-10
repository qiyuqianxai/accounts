import pymongo
import xlwt
import json
import os
import shutil
import sys
import zipfile

mongodb = pymongo.MongoClient("10.128.128.82", 27017)
persondb = mongodb["all_person_info"]
work_book=xlwt.Workbook(encoding='utf-8')
mongodb = pymongo.MongoClient("10.128.128.82", 27017)
#获取工资表
def extract_db(date):
    total_cost_info = {}
    user_info = list(mongodb["all_person_info"].collection_names())
    task_list = [task_name for task_name in mongodb[date].collection_names() if
                 not task_name.startswith("system") and task_name.find("_target") < 0]

    for task_name in task_list:
        task_db = mongodb[date][task_name]
        for dict in task_db.find():
            user_name = dict["标注人"]
            if user_name in user_info:
                user_name = mongodb["all_person_info"][user_name].find_one()["姓名"]
            if "费用" in dict.keys():
                if user_name not in total_cost_info.keys():
                    total_cost_info[user_name] = 0.0
                try:
                    if dict["费用"] == "":
                        continue
                    total_cost_info[user_name] += float(dict["费用"])
                except Exception as e:
                    print(user_name, "费用：", task_name, dict)
                    print(e)
                    continue
    # print(total_cost_info)
    return total_cost_info

def create_excel(total_cost_info,date):
    # with open("accounts_views/user_info.json","r",encoding="utf-8")as f:
    #     user_info = json.load(f)
    user_info = {}
    for user in persondb.collection_names():
        if user.startswith("system"):
            continue
        if user not in user_info:
            user_db = persondb[user]
            user_dict = user_db.find_one()
            user_info[user] = {
                "姓名": user_dict["姓名"],
                "身份证号": user_dict["身份证号码"],
                "银行卡号": user_dict["银行卡号"]
            }
    work_book = xlwt.Workbook(encoding='utf-8')
    sheet = work_book.add_sheet('sheet1')
    sheet.write(0, 0, '姓名')
    sheet.write(0, 1, '日期')
    sheet.write(0, 2, '费用')
    sheet.write(0, 3, '身份证号')
    sheet.write(0, 4, '银行卡号')
    all_names = list(total_cost_info.keys())
    for i in range(len(all_names)):
        if all_names[i] not in user_info:
            print(user_info)
            print(all_names[i],"no information!")
            continue
        sheet.write(i+1, 0, user_info[all_names[i]]["姓名"])
        sheet.write(i+1, 1, date)
        sheet.write(i+1, 2, total_cost_info[all_names[i]])
        sheet.write(i+1, 3, user_info[all_names[i]]["身份证号"])
        sheet.write(i+1, 4, user_info[all_names[i]]["银行卡号"])
        # if user_info[all_names[i]]["姓名"] == "张旭":
        #     sheet.write(i+1, 5, "招商银行武汉分行解放公园支行")
    work_book.save('static/file/accounts/'+date+'重庆标注人员工资表.xls')

# 获取详细信息
def extract_db_count(date):
    # with open("accounts_views/user_info.json","r",encoding="utf-8")as f:
    #     user_info = json.load(f)
    user_info = {}
    for user in persondb.collection_names():
        if user.startswith("system"):
            continue
        if user not in user_info:
            user_db = persondb[user]
            user_dict = user_db.find_one()
            user_info[user] = {
                "姓名": user_dict["姓名"],
                "身份证号": user_dict["身份证号码"],
                "银行卡号": user_dict["银行卡号"]
            }
    result_info = {}
    other_task_info = {}
    task_list = [task_name for task_name in mongodb[date].collection_names() if
                 not task_name.startswith("system") and task_name.find("_target") < 0]
    month_task_sumerise = []
    for task_name in task_list:
        task_total_cost = 0
        task_col = mongodb[date][task_name]
        task_tar = mongodb[date][task_name + "_target"]
        target = task_tar.find_one()
        other_task_info[task_name] = {}
        if "每小时任务标注量" in target:
            other_task_info[task_name]["每小时任务标注量"] = target["每小时任务标注量"]
        if "任务总数" in target:
            other_task_info[task_name]["任务总数"] = target["任务总数"]
        if "任务总张数" in target:
            other_task_info[task_name]["任务总张数"] = target["任务总张数"]
        if "任务总框数" in target:
            other_task_info[task_name]["任务总框数"] = target["任务总框数"]

        result_info[task_name] = []
        for dict in task_col.find():
            user_name = dict["标注人"]
            dict.pop("_id")
            dict.pop("标注人")
            new_dict = {}
            if user_name in user_info:
                new_dict["姓名"] = user_info[user_name]["姓名"]
            else:
                # query没有记录的用户信息
                new_dict["姓名"] = user_name
                pass
            for key in dict:
                new_dict[key] = dict[key]
            result_info[task_name].append(new_dict)
            try:
                task_total_cost += float(new_dict.get("费用", 0))
            except Exception as e:
                pass
        month_task_sumerise.append([task_name, task_total_cost])
    # print(result_info)
    create_excel_detail(result_info, other_task_info,month_task_sumerise,date)

def create_excel_detail(result_info, other_task_info,month_task_sumerise,date):
    if os.path.exists("static/file/accounts"):
        shutil.rmtree("static/file/accounts")
    os.makedirs("static/file/accounts/detail_info_cq/")
    for table in result_info:
        table_name = table+".xls"
        work_book = xlwt.Workbook(encoding='utf-8')
        sheet = work_book.add_sheet('sheet1')
        all_keys = list(other_task_info[table].keys())
        for i in range(len(all_keys)):
            sheet.write(0,i,all_keys[i]+":"+str(other_task_info[table][all_keys[i]]))
        for dict in result_info[table]:
            for i in range(len(list(dict.keys()))):
                sheet.write(1, i, list(dict.keys())[i])
            break
        for i in range(len(result_info[table])):
            for j in range(len(result_info[table][i].keys())):
                key = list(result_info[table][i].keys())[j]
                sheet.write(i+2, j, result_info[table][i][key])

        work_book.save("static/file/accounts/detail_info_cq/"+table_name)
    # 汇总
    work_book = xlwt.Workbook(encoding='utf-8')
    sheet = work_book.add_sheet('sheet1')
    sheet.write(0, 0, "任务名称")
    sheet.write(0, 1, "任务总费用")
    total_cost = 0
    for i, info in enumerate(month_task_sumerise):
        sheet.write(i + 1, 0, info[0])
        sheet.write(i + 1, 1, info[1])
        total_cost += info[1]
    total_cost = round(total_cost, 2)
    sheet.write(len(month_task_sumerise) + 1, 0, "本月总费用：" + str(total_cost))
    work_book.save("static/file/accounts/detail_info_cq/{}_任务费用汇总.xlsx".format(date))

def zip_out_file(root):
    if os.path.exists(root+".zip"):
        os.remove(root+".zip")
    file_lst = []
    getallfile(root, file_lst)
    with zipfile.ZipFile(root+".zip", "w", zipfile.ZIP_DEFLATED) as zf:
        for file in file_lst:
            zf.write(file)

def getallfile(directory,file_lst):
    for file in os.listdir(directory):
        if os.path.isdir(os.path.join(directory, file)):
            getallfile(os.path.join(directory, file),file_lst)
        else:
            file_lst.append(os.path.join(directory,file))

if __name__ == '__main__':
    while True:
        date = input("请输入任务日期，如：2020-4\n")
        extract_db_count(date)
        total_cost_info = extract_db(date)
        create_excel(total_cost_info,date)
        print("导出完成！")
