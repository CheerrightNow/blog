---
title: Pikachu 靶场实战：做题记录与反思
category: Web-靶场实战
description:  记录在 Pikachu 靶场中的实战做题过程，通过 Kali 访问（kali-ip:8090）进行 Web 漏洞练习。
published: 2026-10-16
tags: [Web, Pikachu, 靶场实战]
---

**越权漏洞**

**(1)水平越权**

根据提示信息发现默认用户名称与密码：

![1](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/16/a14cdcb0e25d117dc550ecad7b0ed2f3-1.png)

登录kobe账号，发现URL中包含了很明显的鉴别权限ID的参数username：

![2](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/16/4fe1a27b3e8efcfde93f39e082a152b8-2.png)

将username的值改成lucy，成功登录lucy账号。

![3](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/16/5cd594f12f291e0d3fc89e0cc48d0b7d-3.png)



**(2)垂直越权**

![image-20261017101839026](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/17/2b401181f17e57b07c496dfaed501631-image-20261017101839026.png)

测试1：burpsuite测试admin账户添加用户，发现异常：

![image-20261017101953754](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/17/dae516082efedac6ec140d9632ee8b58-image-20261017101953754.png)

查找资料，使用了很多方法都没解决。

后来再详细查看burpsuite Repeater界面，发现右上角有“目标”url

![image-20261017102627825](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/17/b3979f201828e2a384f5ff09e4a5f56c-image-20261017102627825.png)

把localhost改成靶场所在虚拟机的ip就行了，然后发送报文，回复302，页面渲染里是添加用户的初始界面，回到admin页面发现新用户被添加，？？？

![image-20261017103443493](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/17/2b70c87ac9e05826ea03058f5556f6d8-image-20261017103443493.png)

Host，Origin，Referer等还是原来的localhost:8090，这样还能成功，不知道为什么？

**总之，测试1测试成功。删除测试用例，开始测试2：越权漏洞。**

测试2：越权漏洞

```
PHP 的会话（Session）机制是按“浏览器”来区分的，而不是按“登录账号”区分的。

当你用同一个浏览器（即使开了新的标签页或窗口）先后登录 pikachu 和 admin 时，后登录的账号会覆盖掉前一个账号在服务器上的会话信息，因此 Burp Suite 抓到的 PHPSESSID 自然是一样的。
```

登录admin，对添加用户抓包，进行测试1的修改后退出登录。

登录pikachu获取cookie，保持pikachu登录状态。

pikachu原始：

![image-20261017110950878](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/17/2acbe24b852e9de2d51efb3d99f27587-image-20261017110950878.png)

将抓取的数据包里的cookie值改成pikachu登录时的cookie值（普通用户cookie），发送报文。回复302且location: op2_admin.php，疑似成功。

重新登录admin查看，发现成功添加用户thompson。

![image-20261017111319070](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/17/fedfa7fa3dd6b87618034d87cf3211c2-image-20261017111319070.png)

另外也可以用burpsuite里的**Autorize**工具找越权漏洞，详细方法见文章“业务逻辑漏洞-Autorize扩展”，这里不再叙述。
