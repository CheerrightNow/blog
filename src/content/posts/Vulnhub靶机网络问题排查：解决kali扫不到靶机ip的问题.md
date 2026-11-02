---
title: "Vulnhub靶机网络问题排查：解决kali扫不到靶机ip的问题"
category: 问题排查
description: "解决导入 VulnHub 靶机后 arp-scan 扫不到、靶机没有 IP、网卡不生效的问题，适用于绝大多数 Debian/Ubuntu 系靶机。"
published: 2026-11-02
tags: [问题排查, Vulnhub, kali]
---

​	起初在尝试扫描Vulnhub靶机时发现扫不到靶机ip（VMWare上操作），kali和靶机都已设置为NAT模式，DHCP也已经开启，这就有点奇怪了。

查资料过程中发现了一篇很实用的文章，帮助我很好地解决了这个问题：

```
https://www.freebuf.com/articles/web/488906.html
```

按照文章上的步骤排查即可。



--提示：旧版系统兼容命令前面不要写`systemctl`！！！



**补充知识：**

**1. 什么是 GRUB？为什么要按 E？**

GRUB 就像是电脑开机时的“选择菜单”（类似于你按 F12 选 U 盘启动那个界面）。按 `E` 键的作用是：**在系统正式启动前，临时拦截它，给它下达特殊的启动指令**。
我们下达的指令是：跳过输入密码，直接给我最高权限（root），进去改网络配置。



**2. 怎么呼出 GRUB？**

**第一步：关掉靶机**
直接在你的 VMware 里，把 虚拟机关机。

**第二步：准备“抢按” Shift 键**
选中这台虚拟机，点击“开启此虚拟机”。
**在点击开机的那一瞬间，你的左手立刻按住键盘上的 `Shift` 键，死死按住不要松手！** （有时用键盘左上角的 `Esc` 键也行，你可以两个都试一下）。

--本人按`Esc`成功了，按`Shift`却不行，不知道什么原因。

--按`Esc`时不是长按，而是疯狂点击，直到出现类似这种页面：

![image-20261102214022713](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/02/82a7ab28a4a191afc8c215c85ba1d79f-image-20261102214022713.png)
