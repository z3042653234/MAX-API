
# MAX API

> [!NOTE]
> 本项目为开源项目，在[New API](https://github.com/Calcium-Ion/new-api/)的基础上进行二次开发，感谢原作者的无私奉献。 
> 使用者必须在遵循 OpenAI 的[使用条款](https://openai.com/policies/terms-of-use)以及**法律法规**的情况下使用，不得用于非法用途。


> [!WARNING]
> 本项目为个人学习使用，不保证稳定性，且不提供任何技术支持，使用者必须在遵循 OpenAI 的使用条款以及法律法规的情况下使用，不得用于非法用途。  
> 根据[《生成式人工智能服务管理暂行办法》](http://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm)的要求，请勿对中国地区公众提供一切未经备案的生成式人工智能服务。


## 二开内容

> 本版本是由new-api的最新版本进行的二开！
### 具体美化页面看下方衙门是截图：

1. 侧边栏美化
![image|690x397](https://cdn.linux.do/uploads/default/optimized/3X/e/5/e58a3bc55e684a8e3757d291cb9a154510cfb7cb_2_1035x595.jpeg)

2. 顶栏美化
![image|690x397](https://cdn.linux.do/uploads/default/optimized/3X/0/4/0420879e84faaaf8c101142e8ff40760da6afd42_2_1035x595.jpeg)

3. 日志部分优化，增加下拉式菜单栏
![image|690x393](https://cdn.linux.do/uploads/default/optimized/3X/8/9/89d179f7d642df78351668b8537a2c6867f0c490_2_1035x589.jpeg)

4. 登录注册界面美化（注册页面同理）
![image|690x495](https://cdn.linux.do/uploads/default/optimized/3X/b/3/b3155e2cbd8f2d92b2eb21d58e100128daecd6d6_2_1035x742.png)

5. 将关于页面改为活动福利页面
![image|690x495](https://cdn.linux.do/uploads/default/optimized/3X/a/a/aa1f64d43b04cd6d529feeed2be24d44c80000a0_2_1035x742.jpeg)
![image|690x495](https://cdn.linux.do/uploads/default/optimized/3X/9/6/96fc880685b11a21857d61a7c3d387193b2c9f01_2_1035x742.jpeg)

6. 个人设置（稍微优化了一下ui）
![image|690x495](https://cdn.linux.do/uploads/default/optimized/3X/c/a/ca082ebd279e5facc6c6d0bb8a49dfeb197fa882_2_1035x742.jpeg)

7. 各种日志页面增加大标题（这里只放一张图，其他同理）
![image|690x495](https://cdn.linux.do/uploads/default/optimized/3X/7/f/7f2e1383a25be9afdfa806babed4de120f06459f_2_1035x742.jpeg)

8. 增加suno歌词生成器
![image|690x397](https://cdn.linux.do/uploads/default/optimized/3X/8/c/8cb84f0049a1382115b422e86c4e2d8842c16801_2_1035x595.jpeg)

9. 公告美化
![image|690x498](https://cdn.linux.do/uploads/default/optimized/3X/2/2/223e51654448712b71372deda2dea1d0e76441b4_2_1035x747.jpeg)

10. 我的令牌页美化
![image|690x498](https://cdn.linux.do/uploads/default/optimized/3X/d/2/d2323ed2dba52edc8d71d01562ec395c956f98e4_2_1035x747.jpeg)

11. 钱包页面美化（图片采用随机二次元图片，保障新鲜感🤭）
![image|690x498](https://cdn.linux.do/uploads/default/optimized/3X/e/9/e9a32e1e142afdfdd2445d9378e119ff7c40f283_2_1035x747.jpeg)


## 主要功能

1. 全新的UI界面（部分界面还待更新）
2. 添加[Midjourney-Proxy(Plus)](https://github.com/novicezk/midjourney-proxy)接口的支持，[对接文档](Midjourney.md)，支持的接口如下：
   + [x] /mj/submit/imagine
   + [x] /mj/submit/change
   + [x] /mj/submit/blend
   + [x] /mj/submit/describe
   + [x] /mj/image/{id} （通过此接口获取图片，**请必须在系统设置中填写服务器地址！！**）
   + [x] /mj/task/{id}/fetch （此接口返回的图片地址为经过One API转发的地址）
   + [x] /task/list-by-condition
   + [x] /mj/submit/action （仅midjourney-proxy-plus支持，下同）
   + [x] /mj/submit/modal
   + [x] /mj/submit/shorten
   + [x] /mj/task/{id}/image-seed
   + [x] /mj/insight-face/swap （InsightFace）
3. 支持在线充值功能，可在系统设置中设置，当前支持的支付接口：
   + [x] 易支付
4. 支持用key查询使用额度:
   + 配合项目[neko-api-key-tool](https://github.com/Calcium-Ion/neko-api-key-tool)可实现用key查询使用
5. 渠道显示已使用额度，支持指定组织访问
6. 分页支持选择每页显示数量
7. 兼容原版One API的数据库，可直接使用原版数据库（one-api.db）
8. 支持模型按次数收费，可在 系统设置-运营设置 中设置
9. 支持渠道**加权随机**
10. 数据看板
11. 可设置令牌能调用的模型
12. 支持Telegram授权登录。
    1. 系统设置-配置登录注册-允许通过Telegram登录
    2. 对[@Botfather](https://t.me/botfather)输入指令/setdomain
    3. 选择你的bot，然后输入http(s)://你的网站地址/login
    4. Telegram Bot 名称是bot username 去掉@后的字符串
13. 添加 [Suno API](https://github.com/Suno-API/Suno-API)接口的支持，[对接文档](Suno.md)，支持的接口如下：
    + [x] /suno/submit/music
    + [x] /suno/submit/lyrics
    + [x] /suno/fetch
    + [x] /suno/fetch/:id

## 模型支持
此版本额外支持以下模型：
1. 第三方模型 **gps** （gpt-4-gizmo-*）
2. 智谱glm-4v，glm-4v识图
3. Anthropic Claude 3 (claude-3-opus-20240229, claude-3-sonnet-20240229)
4. [Ollama](https://github.com/ollama/ollama?tab=readme-ov-file)，添加渠道时，密钥可以随便填写，默认的请求地址是[http://localhost:11434](http://localhost:11434)，如果需要修改请在渠道中修改
5. [Midjourney-Proxy(Plus)](https://github.com/novicezk/midjourney-proxy)接口，[对接文档](Midjourney.md)
6. [零一万物](https://platform.lingyiwanwu.com/)
7. 自定义渠道，支持填入完整调用地址
8. [Suno API](https://github.com/Suno-API/Suno-API) 接口，[对接文档](Suno.md)

您可以在渠道中添加自定义模型gpt-4-gizmo-*，此模型并非OpenAI官方模型，而是第三方模型，使用官方key无法调用。

## 渠道重试
渠道重试功能已经实现，可以在`设置->运营设置->通用设置`设置重试次数，**建议开启缓存**功能。  
如果开启了重试功能，第一次重试使用同优先级，第二次重试使用下一个优先级，以此类推。  
### 缓存设置方法
1. `REDIS_CONN_STRING`：设置之后将使用 Redis 作为缓存使用。
    + 例子：`REDIS_CONN_STRING=redis://default:redispw@localhost:49153`
2. `MEMORY_CACHE_ENABLED`：启用内存缓存（如果设置了`REDIS_CONN_STRING`，则无需手动设置），会导致用户额度的更新存在一定的延迟，可选值为 `true` 和 `false`，未设置则默认为 `false`。
    + 例子：`MEMORY_CACHE_ENABLED=true`
### 为什么有的时候没有重试
这些错误码不会重试：400，504，524
### 我想让400也重试
在`渠道->编辑`中，将`状态码复写`改为
```json
{
  "400": "500"
}
```
可以实现400错误转为500错误，从而重试


## 部署
### 基于 Docker 进行部署
```shell
# 使用 SQLite 的部署命令：
docker run --name max-api -d --restart always -p 3000:3000 -e TZ=Asia/Shanghai -v /home/ubuntu/data/max-api:/data registry.cn-hangzhou.aliyuncs.com/pochacco/max-api:v1.1
# 使用 MySQL 的部署命令，在上面的基础上添加 `-e SQL_DSN="root:123456@tcp(localhost:3306)/oneapi"`，请自行修改数据库连接参数。
# 例如：
docker run --name max-api -d --restart always -p 3000:3000 -e SQL_DSN="root:123456@tcp(localhost:3306)/oneapi" -e TZ=Asia/Shanghai -v /home/ubuntu/data/max-api:/data registry.cn-hangzhou.aliyuncs.com/pochacco/max-api:v1.1
```
### 使用宝塔面板Docker功能部署
```shell
# 使用 SQLite 的部署命令：
docker run --name max-api -d --restart always -p 3000:3000 -e TZ=Asia/Shanghai -v /home/ubuntu/data/max-api:/data registry.cn-hangzhou.aliyuncs.com/pochacco/max-api:v1.1
# 使用 MySQL 的部署命令，在上面的基础上添加 `-e SQL_DSN="root:123456@tcp(localhost:3306)/oneapi"`，请自行修改数据库连接参数。
# 例如：
# 注意：数据库要开启远程访问，并且只允许服务器IP访问
docker run --name max-api -d --restart always -p 3000:3000 -e SQL_DSN="root:123456@tcp(宝塔的服务器地址:宝塔数据库端口)/宝塔数据库名称" -e TZ=Asia/Shanghai -v /www/wwwroot/max-api:/data registry.cn-hangzhou.aliyuncs.com/pochacco/max-api:v1.1
# 注意：数据库要开启远程访问，并且只允许服务器IP访问
```
### 默认账号密码
默认账号root 密码123456

## Midjourney接口设置文档
[对接文档](Midjourney.md)

## Suno接口设置文档
[对接文档](Suno.md)

## 交流群
<img src="https://github.com/Calcium-Ion/new-api/assets/61247483/de536a8a-0161-47a7-a0a2-66ef6de81266" width="300">

## 界面截图
![image](https://github.com/Calcium-Ion/new-api/assets/61247483/ad0e7aae-0203-471c-9716-2d83768927d4)

![image](https://github.com/Calcium-Ion/new-api/assets/61247483/d1ac216e-0804-4105-9fdc-66b35022d861)

![image](https://github.com/Calcium-Ion/new-api/assets/61247483/3ca0b282-00ff-4c96-bf9d-e29ef615c605)  
![image](https://github.com/Calcium-Ion/new-api/assets/61247483/f4f40ed4-8ccb-43d7-a580-90677827646d)  
![image](https://github.com/Calcium-Ion/new-api/assets/61247483/90d7d763-6a77-4b36-9f76-2bb30f18583d)
![image](https://github.com/Calcium-Ion/new-api/assets/61247483/e414228a-3c35-429a-b298-6451d76d9032)
夜间模式  
![image](https://github.com/Calcium-Ion/new-api/assets/61247483/1c66b593-bb9e-4757-9720-ff2759539242)

![image](https://github.com/Calcium-Ion/new-api/assets/61247483/5b3228e8-2556-44f7-97d6-4f8d8ee6effa)  
![image](https://github.com/Calcium-Ion/new-api/assets/61247483/af9a07ee-5101-4b3d-8bd9-ae21a4fd7e9e)

## 相关项目
- [New API](https://github.com/Calcium-Ion/new-api)：原版项目
- [Midjourney-Proxy](https://github.com/novicezk/midjourney-proxy)：Midjourney接口支持
- [chatnio](https://github.com/Deeptrain-Community/chatnio)：下一代 AI 一站式 B/C 端解决方案
- [neko-api-key-tool](https://github.com/Calcium-Ion/neko-api-key-tool)：用key查询使用额度

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Calcium-Ion/new-api&type=Date)](https://star-history.com/#Calcium-Ion/new-api&Date)
