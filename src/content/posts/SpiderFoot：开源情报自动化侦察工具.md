---
title: "SpiderFoot：开源情报自动化侦察工具"
category: 安全工具
description: "介绍 SpiderFoot 这一开源 OSINT 自动化平台。"
published: 2026-10-29
tags: [SpiderFoot, OSINT, 信息收集, 安全工具]
---

**一、OSINT简介**

**开源情报**（OSINT）指从公开或商业可获取的信息中，通过收集、验证与分析，提炼出具有情报价值的内容。它并非单纯的信息检索，而是一个将碎片化公开数据转化为可用于决策或调查的结构化情报的过程。

**核心特征与来源**

OSINT 的关键在于“公开性”：信息不依赖秘密手段获取，而是来自互联网、传统媒体、专业期刊、学术会议、照片、地理空间数据（如地图与商业影像）等渠道。其价值在于低成本、广覆盖，且能作为其他情报门类的先导或补充。



**二、SpiderFoot简介**

- **核心用途**：全自动 OSINT 聚合与关联分析。
- **能力**：内置 200 多个模块（其中大多数不需要 API 密钥），输入域名、IP、邮箱或手机号后，它会自动调用各类公开接口，甚至能查数据泄露和暗网信息，最后生成可视化的关系图谱。
- **优势**：开源免费，能帮你发现人工容易忽略的关联线索，适合做深度的资产与情报挖掘。



**三、安装（Docker）**

**01 Docker安装**

```
sudo apt update
sudo apt install -y docker.io 
```



**02 启动 Docker 服务并设置开机自启**

```
sudo systemctl start docker
sudo systemctl enable docker
```



**03 克隆源码并进入目录**

```
cd ~
git clone https://github.com/smicallef/spiderfoot.git
cd spiderfoot
```



**04 使用 Docker 本地构建**

```
docker build -t spiderfoot-local .
```



**05 后台启动容器**

```
docker run -d -p 5001:5001 --name spiderfoot spiderfoot-local
```



**06 检查状态并访问**

```
检查容器是否正常运行：
docker ps

如果看到 spiderfoot 的状态是 Up，就可以打开浏览器访问：http://127.0.0.1:5001。（5001为SpiderFoot默认端口）
```



**07 开机启动**

```
docker start spiderfoot
docker ps           #确认
```



**四、使用**

![图片.png](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/29/a5ac5b202e9ec41f14efb6e36d920ab3-file.webp)

📝 **第一步：填写基本信息（左侧）**

1. **Scan Name（扫描名称）**：给这次任务起个名字，比如“测试扫描_百度”。
2. **Scan Target（扫描目标）**：输入你要调查的域名、IP 或邮箱（例如 `example.com` 或 `8.8.8.8`）。SpiderFoot 会根据你输入的格式自动识别类型。

🎯 **第二步：选择扫描模式（中间）**

界面提供了四种模式，根据你的目的选择：

| 模式            | 含义与适用场景                                               |
| --------------- | ------------------------------------------------------------ |
| **All**         | 启用所有模块，获取最全信息，但速度最慢。                     |
| **Footprint**   | 了解目标暴露在互联网上的资产（子域名、IP、端口等），适合资产梳理。 |
| **Investigate** | 在基础信息上，增加黑名单和恶意性查询，适合怀疑目标有威胁时使用。 |
| **Passive**     | **纯被动模式**，只查询第三方数据源，**不直接接触目标**，隐蔽性最好，符合你最初的被动信息搜集需求。 |

🚀 **第三步：开始扫描（底部）**

点击左下角的红色按钮 **`Run Scan Now`**，扫描就会在后台启动。

🔍 **扫描后看什么**

扫描开始后，页面会自动跳转到结果视图。你主要关注几个地方：

- **Browse Data**：以表格形式列出所有发现的数据（如邮箱、IP、子域名），方便筛选。
- **Graph**：可视化关系图，能直观看到不同资产间的关联。
- **导出报告**：右上角通常有导出按钮，支持导出为 JSON、CSV 或 HTML 格式，方便后续分析。

