import os
import json
import sqlite3
from sqlite3 import Error
import argparse
from shutil import copyfile
import numpy as np
from multiprocessing import Pool
import sys

if __name__ == '__main__':
    sqldb = sqlite3.connect("db.sqlite3")
    cur = sqldb.cursor()
    sql_str = "select name,passwd from login_user;"
    cur.execute(sql_str)
    rst = cur.fetchall()
    user_pwd = []
    for e in rst:
        print(e)
        user_pwd.append(e)
    cur.close()
    # sqldb.commit()
    sqldb.close()
    with open("user_pwd.txt","w",encoding="utf-8")as f:
        f.write(json.dumps(user_pwd,indent=4,ensure_ascii=False))
