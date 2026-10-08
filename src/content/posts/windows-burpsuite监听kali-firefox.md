---
title: windows-burpsuite监听kali-firefox
description: 物理机监听虚拟机
published: 2026-10-01
tags:
- burpsuite
---

**怎么让windows上的burpsuite监听kali上的靶场 ?**

### <font size='5'>第一步：配置 Windows 上的 Burp Suite 监听</font>

Burp 默认只监听本机（127.0.0.1），Kali 连不上，需要改为监听所有网络接口。

1. 打开 Burp Suite，进入 **Settings（设置）** > **Tools** > **Proxy**。
2. 在 **Proxy Listeners** 区域，点击 **Add（添加）**。
3. 在 **Binding** 标签页中：
   - **Bind to port**：保持默认的 `8080` 或自定义一个空闲端口。
   - **Bind to address**：**选择 “All interfaces”**（即 `0.0.0.0`）。这是最关键的一步，让 Burp 接受来自局域网的连接。
4. 点击 **OK** 保存。如果系统弹出防火墙提示，务必选择**允许访问**，否则流量会被拦截。



### <font size='5'>第二步：确认 Kali 与 Windows 的网络连通性</font>

在 Kali 终端里 `ping` 一下 Windows 的 IP 地址，确认能通。Windows 的 IP 可以通过 `ipconfig` 命令查看。



NAT 模式下，Kali 访问 Windows 用的是 **Windows 在 NAT 虚拟网络里的那个 IP**，通常不是你家路由器的 192.168.1.x，而是类似：

- VMware NAT：`192.168.x.1`（VMnet8 网关，通常就是宿主机的虚拟网卡地址）

**具体怎么找 Windows 的 IP：**

**VMware 下：**

1. 在 Windows 上运行 `ipconfig`，找 **VMnet8** 那块网卡的 IPv4 地址，例如 `192.168.152.1`。
2. Kali 里浏览器代理填这个 `192.168.152.1:8080`。



### <font size='5'>第三步：在 Kali 里设置浏览器代理</font>

现在需要让 Kali 里的浏览器把流量发给 Windows。

1. 在 Kali 的浏览器（如 Firefox）中，找到**网络设置**。
2. 手动配置代理：
   - **HTTP Proxy**：填入 **Windows 的 IP 地址**。
   - **Port**：填入刚才 Burp 监听的端口（如 `8080`）。
   - 勾选 **“也为 HTTPS 使用此代理”**（或类似选项）。
3. 保存设置。



### <font size='5'>第四步：安装 Burp 的 CA 证书（针对 HTTPS）</font>

upload-labs 是 HTTP 靶场的话，这步可以跳过。但为了通用性，建议完成，否则访问 HTTPS 网站会报错。

1. 在 Kali 的浏览器里访问 `http://burpsuite`（Burp 需在运行）。
2. 点击 **CA Certificate** 下载证书文件。
3. 在浏览器的证书管理里导入该证书，并勾选**信任此 CA 来标识网站**。



### <font size='5'>第五步：验证抓包</font>

1. 确保 Burp 的 **Proxy > Intercept is on**（拦截开启）。
2. 在 Kali Firefox 中访问 靶场。
3. 切回 Windows 的 Burp，应该在 **Proxy > Intercept** 或 **HTTP history** 中看到请求出现。

如果没抓到，依次排查：Windows 防火墙是否放行 8080、Kali 能否 ping 通 Windows IP、Burp 监听是否确实是 All interfaces、Firefox 代理 IP 是否填错。
