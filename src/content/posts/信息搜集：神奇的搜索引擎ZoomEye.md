---
title: "信息搜集：神奇的搜索引擎ZoomEye"
category: 作业
description: "本次作业围绕网络空间搜索引擎的对比分析，结合ZoomEye进行信息检索，并系统梳理了子域名收集的常见工具与实战流程。"
published: 2026-10-22
tags: [ZoomEye, 渗透测试, 信息收集, 安全工具]
---

![image-20261022105421299](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/22/fe9e7eaa4e43f9cfdb6025b64739a00c-image-20261022105421299.png)

**信息搜集：神奇的搜索引擎ZoomEye**



**01 ZoomEye简介**

ZoomEye（钟馗之眼）是知道创宇404实验室推出的网络空间测绘搜索引擎，它不索引网页内容，而是扫描并索引互联网上暴露的设备、IP、端口及服务组件指纹，支持通过`app`、`port`、`country`、`vul.cve`等语法精确检索全球网络资产，是信息收集和攻击面梳理中用于发现资产暴露面的基础工具。



**02 ZoomEye访问**

浏览器访问 `zoomeye.org` ，登录账号即可开始搜索，不一定要下载庞大的安装包。



**03 与ZoomEye功能类似的搜索引擎**

ZoomEye（钟馗之眼）属于**网络空间测绘**类搜索引擎，和传统网页搜索不同，它索引的是网络空间中的资产本身——IP、端口、服务指纹、协议 banner、证书等。功能相近的平台主要有以下几类：

| 平台           | 所属机构/国家                           | 核心定位                        |
| -------------- | --------------------------------------- | ------------------------------- |
| **Shodan**     | [Shodan.io](https://shodan.io/)（美国） | 最早的IoT/设备搜索引擎          |
| **Censys**     | 密歇根大学（美国）                      | 学术背景，强在TLS证书与主机测绘 |
| **FOFA**       | 白帽汇（中国）                          | 支持HTML源码级检索，语法灵活    |
| **Quake**      | 360（中国）                             | 资产测绘，数据更新快            |
| **Hunter鹰图** | 奇安信（中国）                          | 国内资产覆盖率高                |



**04 结合ZoomEye进行相关搜索**

![image-20261022110451200](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/22/f9aad0e7dcd54e7c7ae284d432db020c-image-20261022110451200.png)

**04-1 子域名收集**

| 语法           | 写法示例                 | 说明                                                 |
| -------------- | ------------------------ | ---------------------------------------------------- |
| **`domain`**   | `domain="example.com"`   | 专门用于搜索域名及其子域名相关的资产                 |
| **`hostname`** | `hostname="example.com"` | 搜索主机名中包含该字符串的资产，能从结果中提取子域名 |

**针对某高校主域名(example.edu.cn)的子域名信息收集（example仅作为占位替代作用）：**

`domain="example.com"`

![image-20261022141037073](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/22/f6a46b38c6f080e8dbd9baedee85dbc6-image-20261022141037073.png)

**04-2 地理定位**

**查找部署在北京的 Web 资产：**

`city="Beijing" && service="http"`

![image-20261022141848030](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/22/d5971fab14d5b5e1168126c65c4c930d-image-20261022141848030.png)

**04-3 搜索特定ip地址**

**搜索 Google 的公共 DNS 服务器 IP：**

`ip='8.8.8.8'：`

![image-20261022142456966](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/22/ee5bdffc7caf9aec6edc38cd3bbe7572-image-20261022142456966.png)



**更多详细用法说明**请移步至以下链接查看：

```
https://github.com/knownsec/security-skills/blob/main/zoomeye-org-search/SKILL.md
```



**05 子域名收集的其它方法**

04-1中我们已经了解了ZoomEye收集子域名的方法，该方法属于**被动收集**的一种。除了被动收集，我们还可以选择**主动收集**的方法：

用字典尝试常见的子域名前缀（如 `admin`、`mail`、`dev`、`test`、`api`），配合DNS解析来发现隐藏的子域名。可采用的工具有Subfinder、Sublist3r，等等。

**以Subfinder为例：**

```
# Kali直接安装
sudo apt install subfinder -y

# 枚举单个域名的子域名
subfinder -d example.com -silent -o subdomains.txt

# 配合httpx做存活验证
subfinder -d example.com -silent | httpx -silent -o alive.txt
```



**06 总结**

​	与传统搜索引擎不同，ZoomEye 直面网络资产本身，通过 `app`、`port`、`domain`、`ip` 等丰富的专用语法，能够精准过滤出全球范围内的设备指纹、开放服务及 Web 应用。实际操作中，我们不仅可以通过组合语法完成对特定资产的检索与数据分布分析，还可以利用其具备的 ZoomEye GPT 功能，实现从自然语言到 Dork 语句的智能转换，极大降低了语法构建的门槛。掌握 ZoomEye 的核心不在于死记硬背各种参数，而在于建立“以资产为核心”的检索思维，结合丰富的搜索字段构建出精确的查询逻辑，从而在信息收集与攻击面评估中快速摸清目标的真实暴露情况。



**07 安全声明**

​	本文所涉及的网络空间测绘（ZoomEye 等）及子域名收集技术，仅用于网络安全知识学习、企业授权内的资产梳理与安全防护评估。文中的搜索示例、截图及工具用法均基于公开数据与学习目的。**严禁任何个人或组织在未经目标所有者明确授权的情况下，使用本文提及的技术手段对真实目标进行扫描、探测或破坏。** 任何因未授权测试、恶意利用及违反相关法律法规（如《网络安全法》）而产生的一切后果，均由操作者自行承担，本文作者及发布平台不承担任何连带法律责任。
