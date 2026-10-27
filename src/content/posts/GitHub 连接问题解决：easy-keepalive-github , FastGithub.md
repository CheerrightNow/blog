---
title: "GitHub 连接问题解决：easy-keepalive-github / FastGithub"
category: Github
description: "easy-keepalive-github -- GitHub 直连保活工具介绍，用于缓解国内访问 GitHub 时的连接不稳定问题; FastGithub: github加速神器，解决github打不开、git-clone、git-pull、git-push失败等问题。"
published: 2026-10-11
tags: [GitHub, 网络工具, 连接优化]
---

**01 easy-keepalive-github（仅Windows）**

**更多详细信息请见文章：**

@zicolasjac-ai/easy-keepalive-github

[easy-keepalive-github的安装与使用]: https://www.npmjs.com/package/@zicolasjac-ai/easy-keepalive-github?activeTab=readme	"按下 CTRL + 点击 以打开 此链接"



**01-1 日志清理**

```
第一步：创建一个清理脚本

在任意位置（比如 C:\Scripts\）新建一个文本文件，命名为 clear-github-log.bat，内容就一行：

@echo off
powershell.exe -NoProfile -Command "Clear-Content -Path 'C:\ProgramData\GitHubKeepalive\logs\keepalive.log' -Force"

第二步：创建计划任务指向这个脚本

在管理员 PowerShell 或 CMD 里执行（路径按你实际放的位置改）：

schtasks /create /tn "GitHubKeepalive日志清理" /tr "C:\Scripts\clear-github-log.bat" /sc weekly /d SUN /st 03:00 /ru SYSTEM /f

#说明：
/tn：任务名称
/tr：执行的 PowerShell 命令（清空日志）
/sc weekly /d SUN /st 03:00：每周日凌晨 3 点执行
/ru SYSTEM：以 SYSTEM 权限运行，无需输入密码
/f：覆盖同名任务而不提示
```



**01-2 遇到的问题**

经个人测试发现以下新问题：

1.连接github成功但github网页只显示文本"OK"（目前较少见）

```
“统一指向同一个 IP”有理论上的局限性。GitHub 的不同子域名（如 api.github.com 和 github.githubassets.com）在 DNS 上可能对应不同的服务端 IP。如果强制指向同一个 IP，某些子域名可能会因为服务端不匹配而无法正常响应。

这也能解释你之前遇到的“显示 OK”现象——很可能就是某个子域名被统一指向了不合适的 IP，导致资源加载失败。不过，工具本身会持续检测并切换，直到找到一个能让整体工作正常的 IP。
```

可能的解决方案：

```
手动触发一次任务让它立刻重新检测

# 手动触发一次，然后查看日志
schtasks /Run /TN GitHubKeepAlive
Start-Sleep 30   # 最坏情况 7 个候选 × 6 秒超时
Get-Content C:\ProgramData\GitHubKeepalive\logs\keepalive.log -Encoding UTF8

-正卡在“显示 OK”那种异常状态，手动触发大概率会换到一个新 IP，从而恢复正常：当你手动触发时，工具会重新执行完整检测流程。旧 IP 虽然之前返回过 200，但如果此刻它的 TLS 握手或 200 响应不稳定或超时（“假活”状态本身就是不稳定的），就会被判定为不可用，工具随即从候选池中选一个新 IP 切换过去。
```



**02 FastGithub（Linux，Windows均可使用）**

**更多详细信息请见文章：**https://github.com/creazyboyone/FastGithub/blob/master/README.md



**这里以Linux为例：**

**02-1 下载**

```
wget -c -O /opt/fastgithub_linux-x64.zip https://gitee.com/chcrazy/FastGithub/releases/download/2.1.4/fastgithub_linux-x64.zip && sudo unzip -d /opt /opt/fastgithub_linux-x64.zip && rm /opt/fastgithub_linux-x64.zip && sudo /opt/fastgithub_linux-x64/fastgithub start

从 Gitee 下载 2.1.4 版本的 Linux 包到 /opt 目录，解压后立即以服务方式启动。
```

说明：`/opt`，全称"Optional"，在 Linux 文件系统标准（FHS）中，专门用来存放**第三方软件**（也就是不是通过系统自带包管理器 `apt` 安装的、非系统核心的附加软件程序）。



**02-2  代理配置**

只在终端做代理：

**终端（Terminal）**：它只看系统环境变量（比如 `http_proxy`）或者 Git 自己的配置文件（`git config`）。只要终端里配了，你在终端里敲 `git clone`、`wget`、`curl` 就会走 FastGithub 的加速通道。

```
git config --global http.proxy http://127.0.0.1:38457
git config --global https.proxy http://127.0.0.1:38457
```

**最后记得：** 确保你的 FastGithub 服务在后台运行着（`sudo ./fastgithub start`），然后在终端里随便测一下 `curl -I https://github.com`，如果能返回 `HTTP/2 200` 就说明成功了！



--服务端代理设置详见开头链接文章。



**02-3 遇到的问题**

**1. Windows -/> kali**

Windows上下载的`.tar.gz`压缩包经共享文件夹传到kali上时解压失败，可能与操作系统不同有关。

**2.  git操作提示`SSL certificate problem`**

需要关闭git的证书验证：

`git config --global http.sslverify false`
