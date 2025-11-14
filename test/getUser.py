from getToken import http_get, split_token

class config:
    def __init__(self):
        self.userUrl = "http://10.211.55.2:8000/api/users"
        self.tokenUrl = "http://10.211.55.2:8000/getToken"
        self.userHeaders = {"token": "jEbu5SJWtDxFdtwx7ZDK-1762308508","Content-Type": "application/json"}

    def setToken(self, token : str = ""):
        self.userHeaders['token'] = token

if __name__ == "__main__":
    cfg = config()

    #获取token返回
    response = http_get(cfg.tokenUrl)
    #分离token
    token = split_token(response=response)
    #写入header
    cfg.setToken(token=token)
    #请求用户信息
    userResponse = http_get(cfg.userUrl, cfg.userHeaders)
    #打印
    print(userResponse.text)