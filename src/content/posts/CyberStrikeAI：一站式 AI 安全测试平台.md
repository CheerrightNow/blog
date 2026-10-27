---
title: "CyberStrikeAI：一站式 AI 安全测试平台"
category: 安全工具
description: "介绍 CyberStrikeAI 这一一站式 AI 安全测试平台，梳理其核心功能定位与应用场景，为安全测试工作提供参考。"
published: 2026-10-23
tags: [AI安全, 安全测试平台, 安全工具]
---

**更多详细内容请见**https://github.com/AIPentest/CyberStrikeAI/blob/main/README_CN.md



**01 简介**

​	CyberStrike是一个一站式 AI 安全测试平台，兼容 OpenAI、DeepSeek、Claude 等模型，内置 100+ 安全工具模版，支持角色化测试，能根据任务调用工具进行自动化分析 。



**02 启动**

```
cd ~/CyberStrikeAI
./run.sh
```

**03 关于 /tools 的一些说明**

![image-20261023151504367](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/23/e95ceb2b0ebfbf1e3a3a52524d56d465-image-20261023151504367.png)

**前言：**这些 YAML 文件本身**不是工具**，而是**工具的定义说明书**。在 Kali 上，很多工具（如 `nmap`, `sqlmap`, `ffuf`, `gobuster`, `gdb`）是自带的，但有些（如 `nuclei`, `subfinder`）可能需要 `apt install` 或者去 GitHub 下。验证工具存在：`sqlmap -h`，看有没有输出。

**02-1  Web 渗透与漏洞扫描**

- **`sqlmap.yaml`**：神器，自动 SQL 注入检测和利用。
- **`nuclei.yaml`**：基于模板的快速漏洞扫描器（非常适合 CTF 找常见漏洞）。
- **`nikto.yaml`**：Web 服务器扫描器，找危险文件、过时组件。
- **`xsser.yaml`**：专门针对 XSS 漏洞的扫描和利用。
- **`dirsearch.yaml` / `gobuster.yaml` / `feroxbuster.yaml` / `ffuf.yaml`**：四大目录/文件爆破工具，找隐藏路径和后台。
- **`wafw00f.yaml`**：WAF（Web 应用防火墙）指纹识别，判断有没有防火墙拦截。
- **`jwt-analyzer.yaml`**：专门分析测试 JWT（JSON Web Token）漏洞。

**02-2  信息收集与资产发现**

- **`nmap.yaml`**：网络探测和端口扫描的“祖师爷”。
- **`masscan.yaml`**：超高速端口扫描器（比 nmap 快很多）。
- **`subfinder.yaml`**：子域名收集。
- **`amass.yaml`**：更高级的子域名和资产枚举。
- **`shodan_search.yaml` / `fofa_search.yaml` / `quake_search.yaml`**：对接网络空间搜索引擎，查目标资产。

**02-3  密码爆破与凭证攻击**

- **`hydra.yaml`**：极其强大的网络登录爆破工具（支持 SSH、FTP、Web 表单等）。
- **`john.yaml` / `hashcat.yaml`**：密码哈希破解双雄。
- **`dnsenum.yaml` / `dnslog.yaml`**：DNS 信息收集与 DNSLog 测试（常用于盲打漏洞验证）。

**02-4  主机与权限提升（打内网/提权用）**

- **`linpeas.yaml`**：Linux 本地提权信息收集神器。
- **`enum4linux-ng.yaml`**：针对 SMB/Windows 主机的信息枚举。
- **`bloodhound.yaml`**：域渗透神器，分析 Active Directory 攻击路径。

**02-5  二进制/Pwn/逆向**

- **`gdb.yaml`**：Linux 下最经典的调试器。
- **`pwntools.yaml` / `one-gadget.yaml`**：Pwn 题必备神器。
- **`ropper.yaml` / `ropgadget.yaml`**：寻找 ROP 利用链的工具。
- **`checksec.yaml`**：检查二进制程序的保护机制（NX, Canary 等）。

**02-6  后渗透/利用框架**

- **`metasploit.yaml`**：大名鼎鼎的 MSF 渗透框架。
- **`responder.yaml`**：内网 LLMNR/NBT-NS 欺骗中毒工具。



**03 一些执行语句**

![image-20261023151935553](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/23/494bf8143bf83382cdaf0590e51eab49-image-20261023151935553.png)
