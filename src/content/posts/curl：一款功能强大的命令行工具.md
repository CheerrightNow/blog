---
title: "curl：一款功能强大的命令行工具"
category: 作业
description: "介绍 curl 这一功能强大的命令行网络传输工具，梳理其常用功能与典型使用场景，帮助读者快速上手并应用于日常开发与安全测试工作。"
published: 2026-10-27
tags: [curl, 命令行工具, 网络工具]
---

![image-20261027191030687](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/27/0f3d4d0b64a9429b096e1d32df75482c-image-20261027191030687.png)

**curl：一款功能强大的命令行工具**

**说明：**curl 在 Linux/macOS 中通常预装，Windows 10 及以上版本也自带。



**00 API简介**

API（Application Programming Interface，应用程序编程接口）本质上是**一套预先定义好的规则和约定**，用于让不同的软件系统之间进行通信和数据交换，而无需了解对方内部的具体实现细节。

简单来说，API 就像是餐厅里的**服务员**：你（应用程序）不需要知道厨房（服务器/系统）里具体是怎么做菜的，只需要看着菜单（API 文档）点单（发起请求），服务员就会把做好的菜（数据/结果）端给你。



**01 curl基本用法**

```
# 发送 GET 请求
curl https://example.com

# 发送 POST 请求
curl -X POST https://api.example.com/data -d '{"key":"value"}'

# 下载文件
curl -O https://example.com/file.zip

# 查看响应头
curl -I https://example.com
```



**常见参数：**

- `-X`：指定请求方法（GET/POST/PUT/DELETE 等）
- `-H`：添加请求头
- `-d`：发送请求体数据
- `-o`：将输出保存到文件
- `-I`：只获取响应头
- `-v`：显示详细通信过程（调试用）



**02 具体例子**

```
curl https://www.baidu.com
```

![image-20261027203214225](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/27/d4ff798a127ac35bf2b3aa72d7f65c91-image-20261027203214225.png)

```
curl -I https://www.baidu.com
```

![image-20261027203404878](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/27/132fb985ee62d52c8e64961b0cab78e9-image-20261027203404878.png)

```
测试本机的 80 端口上是否有 Web 服务在正常响应：
curl localhost:80
```

![image-20261027204442620](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/27/95ffe1ce87e53e6e7f94c1b392c8b2b7-image-20261027204442620.png)



**03 curl的发展与演进**

curl 并非一个“完成品”。2026 年的更新依然密集：8.22.0 版本带来了 HTTP Message Signatures 的实验性支持，同时修复了多个安全漏洞。更早的 8.20.0 版本则包含了一批内存泄漏和边界条件的修复。这意味着如果用于生产脚本，定期检查更新是有必要的。

官方文档站 `everything.curl.dev` 和 curl 项目自己的文档页是查阅完整选项的最佳去处，curl 支持超过两百个命令行选项，手册里能查到的远比这篇文章覆盖的多。
