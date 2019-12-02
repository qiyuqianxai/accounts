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
from label import views as label_views
from label import face_beside_label_views
from image_shower import views as image_shower_views
from label import face_inside_label_views
from label import quality_score_each_label_views
from label import quality_score_multi_label_views
from label import face_inside_label_shenhe_views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^index/', login_views.index),
    url(r'^login/', login_views.login),
    url(r'^register/', login_views.register),
    url(r'^logout/', login_views.logout),
    #url(r'^captcha', include('captcha.urls')),
    url(r'^get_database_camera_list/$', label_views.get_database_camera_list, name='get_database_camera_list'),
    url(r'^get_all_data/$', label_views.get_all_data, name='get_all_data'),
    url(r'^single_camera_reid_label/$', label_views.index),
    # 类间
    url(r'^face_beside_reid_label/$', face_beside_label_views.index),
    url(r'^face_beside_get_database_id_range_list/$', face_beside_label_views.multi_get_database_id_range_list),
    url(r'^face_beside_get_all_data/$', face_beside_label_views.get_all_data),
    # url(r'^multi_get_database_id_range_list/$', multi_label_views.multi_get_database_id_range_list),

    url(r'^q_index/', image_shower_views.index),
    url(r'^query/$', image_shower_views.query),

    # 类内
    url(r'^face_inside_reid_label/$', face_inside_label_views.index),
    url(r'^face_inside_get_database_id_range_list/$', face_inside_label_views.multi_get_database),
    url(r'^face_inside_get_all_data/$', face_inside_label_views.get_all_data),
    url(r'^get_id_range/$',face_inside_label_views.get_id_range),

    url(r'^quality_score_each_label/$', quality_score_each_label_views.index),
    url(r'^quality_get_database_batch_list/$', quality_score_each_label_views.quality_get_database_batch_list),
    url(r'^quality_get_all_data/$', quality_score_each_label_views.quality_get_all_data),

    url(r'^quality_score_multi_label/$', quality_score_multi_label_views.index),
    url(r'^quality_multi_get_database_batch_list/$', quality_score_multi_label_views.quality_multi_get_database_batch_list),
    url(r'^quality_multi_get_all_data/$', quality_score_multi_label_views.quality_multi_get_all_data),
]
