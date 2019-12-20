# -*- coding: utf8 -*-
"""
Django settings for mysite project.

Generated by 'django-admin startproject' using Django 2.1.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.1/ref/settings/
"""

import os


import sys

# print(sys.getdefaultencoding())

PROJECT_ROOT = os.path.dirname(os.path.dirname(__file__))


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '=dyctjk*x%bh7+e&a#d-7ilw%!s^ysr7me^i+^@h+g+^zoi86)'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['10.135.24.58','localhost','127.0.0.1']


# Application definition

INSTALLED_APPS = [
    'login',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'mysite.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['./static/'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'mysite.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = 'zh-hans'

TIME_ZONE = 'Asia/Chongqing'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static/"),
]

LOGGING = {
    'version': 1,#日志版本
    'disable_existing_loggers': False,#True：disable原有日志相关配置
    'formatters': {#日志格式
        'verbose': {#详细格式
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {#简单格式
            'format': '%(levelname)s %(message)s'
        },
    },
    # 'filters': {#日志过滤器
    #     'special': {#特殊过滤器，替换foo成bar，可以自己配置
    #         '()': 'project.logging.SpecialFilter',
    #         'foo': 'bar',
    #     },
    #     'require_debug_true': {#是否支持DEBUG级别日志过滤
    #         '()': 'django.utils.log.RequireDebugTrue',
    #     },
    # },
    'handlers': {#日志handlers
        'file': {#文件handler
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': './all_log.log'
        },
        # 'console': {#控制器handler，INFO级别以上的日志都要Simple格式输出到控制台
        #     'level': 'INFO',
        #     'filters': ['require_debug_true'],
        #     'class': 'logging.StreamHandler',
        #     'formatter': 'simple'
        # },
        # 'mail_admins': {#邮件handler，ERROR级别以上的日志要特殊过滤后输出
        #     'level': 'ERROR',
        #     'class': 'django.utils.log.AdminEmailHandler',
        #     'filters': ['special']
        # }
    },
    'loggers': {
        # 'django': {
        #     'handlers': ['console'],
        #     'propagate': True,
        # },
        # 'django.request': {
        #     'handlers': ['mail_admins'],
        #     'level': 'ERROR',
        #     'propagate': False,
        # },
        'label': {
            # 'handlers': ['console', 'mail_admins', 'file'],
            'handlers': ['file'],
            'level': 'INFO',
            # 'filters': ['special']
        }
    }
}
