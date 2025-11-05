import requests
import json

"""重写get请求"""
def http_get(url : str = "", headers : dict = None):
    if headers is None:
        headers = {"Content-Type": "application/json"}
    return requests.get(url=url, headers=headers)

"""获取token值"""
def split_token(response):
    return response.json()['newtoken']
