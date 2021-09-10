"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin
from login import views as login_views
from django.conf.urls import include
from accounts_views import account_labeler_views
from accounts_views import account_admin_views


urlpatterns = [
    url(r'^admin/', admin.site.urls),
    # 注册
    url(r'^index/', login_views.index),
    url(r'^login/', login_views.login),
    url(r'^register/', login_views.register),
    url(r'^logout/', login_views.logout),

    # 管理员结账页面
    url(r'^account_admin/$', account_admin_views.index),
    url(r'^add_date_to_db/$', account_admin_views.add_date_to_db),
    url(r'^get_date_task/$', account_admin_views.get_date_task),
    url(r'^get_task_target/$', account_admin_views.get_task_target),
    url(r'^update_target/$', account_admin_views.update_target),
    url(r'^get_labeler_info/$', account_admin_views.get_labeler_info),
    url(r'^save_labeler_info/$', account_admin_views.save_labeler_info),
    url(r'^admin_get_total_cost/$', account_admin_views.admin_get_total_cost),
    url(r'^get_all_task_info/$', account_admin_views.get_all_task_info),
    url(r'^paste_new_task/$', account_admin_views.paste_new_task),
    url(r'^get_task_done_target/$', account_admin_views.get_task_done_target),
    url(r'^delete_task/(.+)/$',account_admin_views.delete_task),
    # 标注员结账页面
    url(r'^get_date_and_task/$', account_labeler_views.get_date_and_task),
    url(r'^account_labeler/$', account_labeler_views.index),
    url(r'^get_task_detail_info/$', account_labeler_views.get_task_detail_info),
    url(r'^save_child_task_info/$', account_labeler_views.save_child_task_info),
    url(r'^get_total_cost/$',account_labeler_views.get_total_cost),

]
