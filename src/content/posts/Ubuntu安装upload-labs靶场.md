---
title: Ubuntu安装upload-labs靶场
description: Ubuntu安装upload-labs靶场
published: 2026-09-26
tags:
- Web  
  - 文件上传漏洞
- Linux
  - 靶场安装
    - upload-labs
---

**前言：**使用AI在虚拟机上安装靶场的时候，遭遇了许多麻烦事，建了改，改了删，删了建，还有什么镜像、容器、目录设置等一堆乱七八糟的事情，令人烦恼。在尝试了不知道多久后，也是终于在Ubuntu上搭建好了这个靶场。以下是本人整理的一些搭建过程，希望对以后的学习有所帮助。

**虚拟机：**Ubuntu

​	**AI：**Deepseek



1.安装Docker

```
apt update && apt install -y docker.io
```

安装完验证一下

```
docker --version
```



2.启动Docker服务

```
sudo systemctl start docker
```

验证

```
sudo systemctl status docker
```

设置开机自启

```
sudo systemctl enable docker
```



3.拉取镜像（一堆镜像源因为各种各样原因拉取失败）

显式指定镜像源拉取：

```
docker pull docker.1ms.run/c0ny1/upload-labs
```

（终于找到一个能用的）



4.打标签

```
docker tag docker.1ms.run/c0ny1/upload-labs:latest c0ny1/upload-labs
```

（打标签 = 给镜像起别名，让命令更短、更不容易踩官方源超时的坑，不占额外磁盘空间。）

-Docker镜像完整名字格式：

```
仓库地址/命名空间/镜像名:标签
```



5.启动容器

```
docker run -d --name upload-labs -p 8080:80 c0ny1/upload-labs
```

确认源码

```
docker exec -it upload-labs ls /var/www/html/
```

（能看到 `index.php`、`pass-01`、`pass-02` 这些文件/文件夹）



6.设置上传目录权限

```
docker exec -it upload-labs /bin/bash
```

```
chmod 777 /var/www/html/upload
```

```
exit
```



7.访问靶场

```
http://xxxxxxxxx:8080/
```



8.下一次启动容器



```
docker start upload-labs
```



--pikachu：

area39/pikachu
