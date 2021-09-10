import pymongo
import xlwt
import json

work_book=xlwt.Workbook(encoding='utf-8')


mongodb = pymongo.MongoClient("10.128.128.82", 27018)
#获取工资表
def extract_db(date):
    total_cost_info = {}
    task_list = list(filter(lambda name: name.find(date) > -1, mongodb.database_names()))
    for task_name in task_list:
        task_db = mongodb[task_name]
        user_name_list = list(filter(lambda name: name.find("target") < 0, task_db.collection_names()))
        for user_name in user_name_list:
            user_db = task_db[user_name]
            for dict in user_db.find():
                if "费用" in dict.keys():
                    if user_name not in total_cost_info.keys():
                        total_cost_info[user_name] = 0.0
                    try:
                        if dict["费用"] == "":
                            continue
                        total_cost_info[user_name] += float(dict["费用"])
                    except Exception as e:
                        print(user_name,"费用：",task_name,dict)
                        print(e)
                        continue

    print(total_cost_info)
    return total_cost_info

def create_excel(total_cost_info):
    with open("user_info_sh.json","r",encoding="utf-8")as f:
        user_info = json.load(f)

    work_book = xlwt.Workbook(encoding='utf-8')
    sheet = work_book.add_sheet('sheet1')
    sheet.write(0, 0, '姓名')
    sheet.write(0, 1, '日期')
    sheet.write(0, 2, '费用')
    sheet.write(0, 3, '身份证号')
    sheet.write(0, 4, '银行卡号')
    all_names = list(total_cost_info.keys())
    for i in range(len(all_names)):
        # if all_names[i] not in user_info:
        #     print(all_names[i],"no information!")
        #     continue
        sheet.write(i+1, 0, all_names[i])
        sheet.write(i+1, 1, date)
        sheet.write(i+1, 2, total_cost_info[all_names[i]])
        sheet.write(i+1, 3, "")
        sheet.write(i+1, 4, "")
    work_book.save(date+'上海标注人员工资表.xls')

# 获取详细信息
def extract_db_count(date):
    with open("user_info_sh.json","r",encoding="utf-8")as f:
        user_info = json.load(f)
    result_info = {}
    other_task_info = {}
    task_list = list(filter(lambda name: name.find(date) > -1, mongodb.database_names()))
    for task_name in task_list:
        task_db = mongodb[task_name]
        target = task_db["target"].find_one()
        other_task_info[task_name] = {}
        if "每小时任务标注量" in target:
            other_task_info[task_name]["每小时任务标注量"] = target["每小时任务标注量"]
        if "任务总数" in target:
            other_task_info[task_name]["任务总数"] = target["任务总数"]
        if "任务总张数" in target:
            other_task_info[task_name]["任务总张数"] = target["任务总张数"]
        if "任务总框数" in target:
            other_task_info[task_name]["任务总框数"] = target["任务总框数"]

        user_name_list = list(filter(lambda name: name.find("target") < 0, task_db.collection_names()))
        result_info[task_name] = []
        for user_name in user_name_list:
            if user_name == "system.indexes":
                continue
            user_db = task_db[user_name]
            for dict in user_db.find():
                if "_id" in dict:
                    dict.pop("_id")
                new_dict = {}
                if user_name in user_info:
                    new_dict["姓名"] = user_info[user_name]["姓名"]
                else:
                    new_dict["姓名"] = user_name
                for key in dict:
                    new_dict[key] = dict[key]
                result_info[task_name].append(new_dict)

    print(result_info)
    create_excel_detail(result_info, other_task_info)

def create_excel_detail(result_info, other_task_info):
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
        work_book.save("detail_info_shanghai/"+table_name)

if __name__ == '__main__':
    date = "2020-3"
    total_cost_info = extract_db(date)
    create_excel(total_cost_info)
    extract_db_count(date)
