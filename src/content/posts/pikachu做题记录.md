---
title: pikachu
description: pikachu做题记录
published: 2026-10-16
tags:
- Web
  - pikachu
    - 靶场实战
---

# <font size='5'>业务逻辑漏洞学习笔记</font>

**越权漏洞**

**(1)水平越权**

根据提示信息发现默认用户名称与密码：

![1](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/16/a14cdcb0e25d117dc550ecad7b0ed2f3-1.png)

登录kobe账号，发现URL中包含了很明显的鉴别权限ID的参数username：

![2](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/16/4fe1a27b3e8efcfde93f39e082a152b8-2.png)

将username的值改成lucy，成功登录lucy账号。

![3](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/16/5cd594f12f291e0d3fc89e0cc48d0b7d-3.png)



**(2)垂直越权**
