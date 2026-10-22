---
title: Metasploit：启动注意事项与操作步骤
category: Metasploit
description: 梳理 Metasploit 在 Kali Linux 环境下的启动流程与关键注意事项，帮助使用者规范、安全地完成工具初始化。
published: 2026-09-27
tags: [Linux, Kali, Metasploit, 工具使用说明]
---

Metasploit安装：

```
sudo apt update
sudo apt install metasploit-framework
```



每次开机后启动一下数据库服务：

```
sudo msfdb start
```

然后输入：

```
msfconsole
```

进入到 msf> 时进行确认：

```
db_status
```



显示 Connected to msf. 即为成功。



退出msf：

```
exit
```

