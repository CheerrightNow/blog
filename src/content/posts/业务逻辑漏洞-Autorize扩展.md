---
title: 业务逻辑漏洞-Autorize扩展
description: burpsuite-Autorize扩展介绍
published: 2026-10-17
tags:
- Web
  - 业务逻辑漏洞
- burpsuite
  - Autorize扩展 
---

**Autorize扩展的使用**

**一、下载扩展**

进入burpsuite，点击上方“扩展”模块，再点击“BApp商店”，搜索“Autorize”，进行下载。



**二、配置（以pikachu为例）**

进入Autorize模块，点击右上角“Users”

![image-20261017120751418](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/17/3858bc7105665f7df81ad790cb8a3c03-image-20261017120751418.png)

将报头内容删除，更换成以下格式：

```
Cookie: PHPSESSID=...........
```

点击"Configuration"，确保"Autorize is on"

![image-20261017121042141](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/17/76159e0ae485d6f3ff47963fdc9b4153-image-20261017121042141.png)



**三、使用**

确保burpsuite Proxy中拦截功能保持关闭；

确保浏览器中burpsuite插件（比如Foxyproxy功能开启）。

![image-20261017121524124](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/17/7a9c47f16f141cb62b9f036ebdba7415-image-20261017121524124.png)

然后在靶场中进行验证。

![image-20261017123309391](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/17/5f33a0c35204d5cbd3e239795f80e5fb-image-20261017123309391.png)

（一行是admin正常添加，一行是Autorize使用pikachu cookie添加)

```
第一步：过滤噪音（忽略红色，先看绿色）
你看截图的第 1、2、3 行，全红。但你仔细想，你登录网站后，看主页、看公共列表，普通用户当然能看，这不叫漏洞，这叫正常业务。
所以，第一步是找出那些本不该标红、却标红了的地方。

第二步：关注“反常”的请求（重点看 POST 和特定动作）
在渗透测试中，越权往往发生在“增删改查”这些动作上。
    GET 请求：通常是查看页面，就算越权了，也就是看到了不该看的信息（越权读取）。
    POST 请求（如你截图第 6 行）：通常是提交数据、修改配置。如果 POST 请求 Bypassed，那大概率是越权操作（比如低权限用户修改了管理员配置）。

第三步：抓住“Is enforced???”（高价值目标）
第 6 行（你高亮的那行），Unauth. Status 和 User 3 Authz 显示的是 Is enforced???。
	为什么显示问号？因为服务器返回了 302 Found（重定向）。

    Autorize 的机制是：它用 pika 的 Cookie 发了 POST 包，服务器返回 302 说“去另一个页面”。Autorize 比较了长度，发现 admin 发也是 302，长度 34541；pika 发也是 302，长度也是 34541。它不知道该算成功还是失败，所以打了问号。

    但在黑客眼里，只要服务器没有明确返回“403 Forbidden”或“无权限”，就说明服务器大概率执行了你的请求！ 这就是重点怀疑对象。

第四步：点开请求，人工对比（最关键的一步）
不要只看表格，你要点击那一行，看右侧的 Request/Response Viewers。
	点开第 6 行。
	看 Original Response（admin的响应）：里面有没有 SQL 报错？有没有 alert('添加成功')？
	看 User 1 Request（pika的伪造请求）：里面的 Cookie 是不是真的变成了 pika 的 PHPSESSID？
	看 User 1 Response（pika的响应）：是不是和 admin 的响应一模一样？如果一模一样，说明 pika 的行为和 admin 完全等效。

第五步：去浏览器（或数据库）寻找“案发现场”
工具里看懂了，去实际环境验证：
    退出 pika，重新登录 admin。
    去查看用户列表，或者刷新刚才操作的页面。
    看看有没有你刚才在 Autorize 里伪造添加/修改的数据。 如果有，实锤越权漏洞。
```





```
附加说明：

1. 基础对比列（看请求成没成功）

    Orig. Len (Original Length 原始长度)：
    这是你用高权限（admin）在浏览器里正常访问时，服务器返回的数据包长度（字节数）。

    Unauth. Len (Unauthenticated Length 未授权长度)：
    这是 Autorize 自动去掉 Cookie（相当于未登录的游客）去访问同一个 URL 时，服务器返回的数据包长度。

    Unauth. Status (未授权状态)：
    这是服务器对“游客”的判定结果。

绿色 Enforced!：意思是“拦截成功（强制执行）”。说明服务器要求必须登录，把游客踢走了（通常长度会变小，比如从 35911 变成 31046，说明返回了登录页）。

红色 Bypassed!：意思是“绕过成功”。说明连游客都能直接拿到和 admin 一样大的数据包（长度一样），说明这个页面根本没做鉴权。

2. 你配置的测试账号列（重点看这里）

User 1 Modif... (User 1 Modified Length 修改后的长度)：
这是 Autorize 用你填在 Users 里的 pikachu 账号的 Cookie，去重放请求时，服务器返回的响应长度。

User 1 Authz... (User 1 Authorization Status 越权状态)：
这是最终结论。
如果 User 1 Modif 的长度和 Orig. Len （admin的长度）一样，它就会标红显示 Bypassed!，意思是：普通用户拿到了管理员一样的数据，越权成功！

如果长度不一样（比如返回了无权访问的提示），它就会标绿。

💡 结合截图分析：

    第一行（大片的红）：
    Orig.Len 35389，User 1 Modif 35389，一样大。说明 pika 访问这个页面，和 admin 拿到的东西完全一样。因为这是靶场首页或者公共列表，本来就允许看，所以标红没毛病。

    第 4、5 行（标绿了）：
    说明 pika 访问这些接口时，被服务器拦截了（长度变短了），返回了错误提示，所以标绿。

    第 6 行（你高亮的这行）：
    这就是最经典的 302 状态码那一行。Unauth. Status 显示 Is enforced??? (...)。因为这是一个 POST 请求（比如添加用户），服务器返回了 302 跳转，Autorize 有点懵，不知道你到底加没加成功，所以打个问号。

注意看 User 1 Authz... 这一整列（也就是 pika 的测试结果）：
    全都是红色的 Bypassed!！
    这说明什么？说明只要是用 pika 的 Cookie 去发包，服务器一个请求都没有拦截，全给放行了。
```

