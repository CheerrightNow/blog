---
title: Metasploit工具启动注意事项
description: 启动Metasploit的步骤
published: 2026-09-27
tags:
- Linux
  - kali	
    -工具使用说明
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

