---
title: upload-labs做题记录
description: upload-labs个人做题全过程
published: 2026-09-22
tags:
- Web
  - 文件上传漏洞
    - 靶场实战
---

**upload-labs靶场通关**

### <font size="5">**前言：如何确认自己真的通关了？**</font>

1. 访问执行：复制上传后的文件路径，在浏览器访问。如果看到 phpinfo 页面或者代码没有直接以文本形式泄露，说明解析成功。
2. 工具连接：对于一句话木马，用蚁剑或菜刀尝试连接。如果显示“连接成功”并能执行命令，才算真正拿到了服务器的控制权。

。。。。。。。。。。。。。。。。。。。。。。。。



**Pass01**

上传一个3.php发现弹出弹窗, 考察 JS 前端验证绕过

![屏幕截图 2026-09-22 193349](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/22/22bf63a43f433334e5e5dd64c12755bf-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-22%20193349.png)

**方式一：禁用javascript**

### <font size="5">Firefox</font>

1. 地址栏输入 `about:config`
2. 搜索 `javascript.enabled`
3. 切换为 `false`
4. 刷新页面

再次上传webshell.php(3.php),疑似上传成功，打开蚁剑连接站点查看，确实上传成功

![屏幕截图 2026-09-22 200221](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/22/460e854b377f07c58c033bceae094d9d-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-22%20200221.png)



**方式二：burpsuite抓包**

将webshell2.php后缀改为.jpg，burpsuite抓包时再改回原.php后缀，蚁剑查看成功上传

![屏幕截图 2026-09-22 205133](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/22/9f6e3436280b5ff74c9e7cc086ae0f2d-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-22%20205133.png)

![屏幕截图 2026-09-22 205424](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/22/6aeadcd288575821c511b0f531d6ff05-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-22%20205424.png)

![屏幕截图 2026-09-22 205223](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/22/cfc5186de5725d010cfe9db23f005706-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-22%20205223.png)





**Pass02**

能上传.jpg图片；改了很久的文件后缀，结果都不行，查看提示发现想错了。本题考查MIME类型校验绕过

![屏幕截图 2026-09-22 212316](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/22/374cdc6133cd8a918e51007851534036-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-22%20212316.png)



把Content-Type: application/octet-stream改成image/jpeg就好了



![屏幕截图 2026-09-22 212240](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/22/6b557f59146da0659f1c209e36ee4426-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-22%20212240.png)

。。。。。。。。。。。。。。。。。。。。。。。。

![屏幕截图 2026-09-22 212203](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/22/d46a2eda902d47e8622b70b873d8bcdf-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-22%20212203.png)

。。。。。。。。。。。。。。。。。。。。。。。。。

![](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/22/97c93a3b7062f715d24c4a15c4a5f2b5-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-22%20212302.png)



**Pass03**

传入.php文件后发现考察黑名单绕过：

![屏幕截图 2026-09-23 213939](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/23/4e5f8af4f923ebc682f34aadf8da1036-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-23%20213939.png)

试验之后发现.pphphp，.php3，.php5，.phtml等等都行

-然后发现使用蚁剑连不上，查看上传文件才知道文件被重命名了

![屏幕截图 2026-09-23 220154](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/23/233c1d09981c88b874bd9312da75e85a-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-23%20220154.png)

-知道了文件名之后尝试用蚁剑再次连接，显示数据为空。

查资料发现：

**Apache**：默认配置里通常只解析 `.php`，`.phtml` 需要手动添加 `AddType application/x-httpd-php .phtml` 才会生效。

**Nginx**：默认只把请求转发给 PHP-FPM 处理 `.php` 文件，`.phtml` 会被当作静态文件直接返回源码。

即：服务器没有把 `.phtml` 当作 PHP 文件解析，而是当成普通文本文件返回了。



新版 PHPStudy（如 8.x）的 Apache 默认已经不再使用传统的 `mod_php` 模块来处理 PHP 请求，而是改用了 `mod_fcgid`（FastCGI）。打开 Apache 的 `httpd.conf`,找到之前添加 `AddType` 的地方，用下面这套配置替换它：

```
# 1. 告诉 Apache 哪些后缀应交给 fcgid 处理

AddHandler fcgid-script .php .php5 .phtml

# 2. 设置 PHP 运行环境（指向你的 php 目录）

FcgidInitialEnv PHPRC "D:/../php/phpx.x.xnts"

# 3. 为每个后缀指定对应的 PHP 解释器路径

FcgidWrapper "D:/../php/phpx.x.xnts/php-cgi.exe" .php
FcgidWrapper "D:/./php/phpx.x.xnts/php-cgi.exe" .php5
FcgidWrapper "D:/...../php/phpx.x.xnts/php-cgi.exe" .phtml
```

![image-20260924142155495](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/24/7bfbf00ff01341ab928d357fdc1c8bab-image-20260924142155495.png)

**Pass04**

![屏幕截图 2026-09-24 194539](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/24/11cf9c006f4451671d9ddacf06fc585d-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-24%20194539.png)

今天调好了burpsuite的fuzz测试功能，试用一下。

**ps：测试的时候最好关掉安全中心的“病毒与威胁保护”设置。**

发现14个长度1000的响应，逐一测试。

测试成功的有三个：.aspx.png ; .jsp` ; .jsp!

查资料发现，之前自己的个人理解存在一个误区：php语言文件后缀换.jsp，.asa绕过，这在大部分情况下是错误的做法。

- ```
  如果你把一个内容为 <?php ... ?> 的文件命名为 .jsp：
  
  - 服务器会把它交给 JSP 引擎；
  - JSP 引擎看不懂 <?php ?>，会当成模板文本原样输出，或者直接报错；
  - PHP 代码不会被执行。
  ```

  

所以对上述文件后缀进行更改：

```
.aspx.png -> .php.png
.jsp` -> .php`
.jsp! -> .php!
```

最终结果：

![屏幕截图 2026-09-24 121057](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/24/092a13b9846e8369b8e0c6430580d790-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-24%20121057.png)

emm，貌似没什么用，看看源码，用.htaccess覆盖试试：

```
.htaccess 介绍

.htaccess 是 Apache HTTP Server 专属的分布式配置文件（也叫“分散式组态档”）。它的核心作用是：让没有服务器 root 权限的普通用户，也能对自己目录下的 Apache 行为进行配置。

生效条件：服务器主配置中 AllowOverride 允许相应指令，且通常需 AllowOverride All
```

-FastCGI 模式下对应的.htaccess文件写法

```
<FilesMatch "\.png$">
    AddHandler fcgid-script .png
    # 把 .png 后缀的文件标记为 FastCGI 脚本
    FcgidWrapper "php-cgi.exe完整路径" .png
    # 执行 .png 脚本时，具体调用哪个程序
</FilesMatch>
```

成功。

![image-20260925101152021](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/25/3cf127b17cd362550ab02ea0f494fbdb-image-20260925101152021.png)



**Pass05**

.htaccess文件不让上传了，fuzz测试没有明显切入点。

手工测试：

![image-20260924200248067](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/24/cfd16a273a0cb1242aad55676686bcde-image-20260924200248067.png)

貌似没什么用，看看源码，发现去.和去空没有循环。

用点号绕过试试看：xxx.php. .

![屏幕截图 2026-09-25 103458](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/25/4a26aab8c72f57b2b32f5597c5f22d09-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-25%20103458.png)

可行（xxx.php. . -> xxx.php. ->xxx.php）

![image-20260925104120303](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/25/536951b48cab7cf0107eaec3a5d3e30f-image-20260925104120303.png)



还有一种方法：.user.ini文件上传：

```
一、什么是 .user.ini
.user.ini 是 PHP 提供的一种用户级配置文件，从 PHP 5.3.0 开始引入。
它的设计目的是为了让普通用户（非管理员）也能修改部分 PHP 配置，而不需要去改动全局的 php.ini。

本题：.user.ini 让指定的那一个文件被 include 进 PHP

二、auto_prepend_file 是什么
ini:
auto_prepend_file = <filename>

含义
自动前置文件：在执行任何 PHP 脚本之前，PHP 会先自动包含（include）这个指定的文件。

执行流程
请求 index.php
      ↓
先执行 auto_prepend_file 指定的文件
      ↓
再执行 index.php 本身

三、auto_append_file 是什么
ini
auto_append_file = <filename>

含义
自动后置文件：在执行完任何 PHP 脚本之后，PHP 会自动包含这个指定的文件。
执行流程
请求 index.php
      ↓
执行 index.php 本身
      ↓
再执行 auto_append_file 指定的文件
```

.txt：

```
<?php @eval($_POST['cmd']); ?>
```

.user.ini：

```
auto_prepend_file=test.txt
```

成功。

![屏幕截图 2026-09-25 105628](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/25/22cbb312704c04c9d2f3adb0fd09cf62-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-25%20105628.png)



图片马同样可以：

![image-20260925112536933](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/25/0284614c6ef9da05e5187f8767bb904b-image-20260925112536933.png)

(不要看到网页上显示一堆乱码就认为失败，具体要看蚁剑能不能连)



**Pass06**

fuzz一下，没发现有用的东西。

手工尝试，发现大小写混合能够上传。(.Php)

![image-20260925115614040](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/25/36953ea2248d98d1f88dff794a22e0e3-image-20260925115614040.png)

```
FastCGI模式下（非FastCGI不用这一步）：

配置里同时存在两条针对 .php 后缀的指令：

    AddHandler fcgid-script .php .phtml ...
这条指令告诉 Apache：“凡是看到 .php（以及列出的其他后缀），就把它们当作 FastCGI 脚本处理。” 注意，AddHandler 对大小写通常不敏感，所以它也会把 .Php 识别为 FastCGI 脚本。

    FcgidWrapper "D:/xxx/php-cgi.exe" .php：这条指令告诉 mod_fcgid 模块：“当处理 .php 后缀的文件时，请调用这个具体的 php-cgi.exe 程序。”

问题就出在这里。AddHandler 把 .Php 交给了 FastCGI 系统，但 FcgidWrapper 只为小写的 .php 指定了具体的 PHP 解释器路径。当 Apache 试图处理一个 .Php 文件时，它进入了 FastCGI 处理流程，却找不到对应的包装器（Wrapper）来执行它，进程创建失败，最终抛出 500 错误。
```

![106c6ae6c5c24b40f6b285d5e7c3f5a6_720](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/25/3af8c73ec4fe3ae9254248876cb9fcf8-106c6ae6c5c24b40f6b285d5e7c3f5a6_720.png)

添加.Php后重启Apache就可以了。成功连接。

![image-20260925120127012](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/25/d29b5086315095364f2021f82b72ddef-image-20260925120127012.png)



**Pass07**

fuzz一下，没发现有用的东西。

手工尝试，发现空格绕过能够上传。(.php )

![image-20260927114907599](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/27/ceff819916f4742ef3dfacfa8e07c190-image-20260927114907599.png)

。。。。。。。。。。。。。。。。。。。。。。。。。。。

![image-20260927114954089](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/27/4451f0c0eaa0998d59bba6a099ff0629-image-20260927114954089.png)

成功。

![image-20260927115134452](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/27/868fc6ae48a82c5adc5793965a7b94e5-image-20260927115134452.png)



**pass08**

fuzz一下发现“pass08.php.”上传成功

![image-20261001153839654](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/01/cce3e29e2583f10233026b891603bc86-image-20261001153839654.png)

。。。。。。。。。。。。。。。。。。。。。。。。。

![image-20261001153939948](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/01/11fa61c36a9d9f01af744bec6221291f-image-20261001153939948.png)



**Pass09**

fuzz一下，没发现有用信息。

手工测试，发现 .php::$DATA成功上传且带有 .php 后缀

![image-20261001155025754](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/01/547c12753a296b8384050d47771a7736-image-20261001155025754.png)

。。。。。。。。。。。。。。。。。。。。。。。。

![image-20261001155047217](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/01/ad2c557de00b585166cff9f28ab6dffa-image-20261001155047217.png)

成功。

![image-20261001155135126](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/01/135531303a36fab9c3db1a5e95775811-image-20261001155135126.png)



**Pass10**

fuzz x

手工测试 ， .php. . 成功。

![image-20261001160625170](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/01/03909c3dbe993c1087bc49286915f0ef-image-20261001160625170.png)

。。。。。。。。。。。。。。。。。。。。。。

![image-20261001160643778](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/01/27902fe4d25cb62edc2a472d22bdc1e4-image-20261001160643778.png)

。。。。。。。。。。。。。。。。。。。。。。。。

![image-20261001160730925](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/01/2b0c493e471b7c66ac825f86b1266d00-image-20261001160730925.png)



**Pass11**

fuzz一下，发现.php之类都能上传，有些奇怪。

看看上传目录，发现“.php”（之类）被过滤，只要有“.php”的话 .php就被删一次。

![屏幕截图 2026-10-02 141720](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/02/c1552647d8cdb7ff0b65bd057f6cf7b0-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-10-02%20141720.png)

想到双写.php  ->  .pphphp，成功。

![屏幕截图 2026-10-02 142043](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/02/c8534695abbd919b59e964da3528ba98-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-10-02%20142043.png)

。。。。。。。。。。。。。。。。。。。。。。。。。

![image-20261002142510817](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/02/92d41e14e117070c39f35777e219529f-image-20261002142510817.png)



**Pass12**

当path路径中出现ASCII为0(0x00)的空字符时，将截断其后面的字符不执行，该空字符进行url编码后是%00

前提条件：

    1.php 版本小于 5.3.29(最好用ts版的php)
    2.magic_quotes_gpc = Off # 这个在 php.ini 中
**-5.3.29做不出来，查资料发现5.3.29 虽然仍属于 5.3.x 分支，但它是 5.3.4 之后的补丁版本，核心函数已经对空字节做了处理。**

![image-20261002142838668](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/02/4b622d322c81af401da89c5d1084d4c7-image-20261002142838668.png)

fuzz一下，没发现有价值的东西。

试了很多方法，发现后缀都是.jpg

![image-20261002151813564](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/02/991f71482e17ff099d53ebe4657ccf96-image-20261002151813564.png)

白名单验证非常严格，没头绪，看看提示：

![image-20261002162140529](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/02/09590e9a2c301bab92182b5d18b8f654-image-20261002162140529.png)

从代码可以看到，`img_path`是通过GET请求传递的，因此是可控的，我们可以在`/upload/`后面加入`pass12.php%00`实现截断操作。对于url中的`%00`，服务器会把它当作十六进制处理，进行十六进制解码就变为了`0x00`。

![屏幕截图 2026-10-02 162159](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/02/f8371f17c028217e7146e6b2f3f7ddf2-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-10-02%20162159.png)

同时将文件名后缀改为.png

![image-20261002162412167](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/02/5c6b701db552241efa7706b84605b077-image-20261002162412167.png)

成功。

![image-20261002162459227](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/02/cd7af4e5ebffb7895ebaba3e400ca44d-image-20261002162459227.png)

。。。。。。。。。。。。。。。。。。。。。。。。

![image-20261002162531164](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/02/32e992748e8684c4b316e997588fec0f-image-20261002162531164.png)



--关于为什么要加%00截断：

```
核心原因：不加 %00，你控制不了最终生成的文件名，PHP 代码就没法执行。
先看源码的拼接逻辑

$img_path = $_GET['save_path']."/".rand(10, 99).date("YmdHis").".".$file_ext;

最终文件名是四部分拼起来的：

save_path  +  "/"  +  随机数+时间戳  +  "."  +  后缀

假设你传的 save_path = ../upload/，上传的文件是 shell.jpg，那最终路径是：

../upload/32 20261002153000 .jpg

也就是 ../upload/3220261002153000.jpg。

问题来了：文件名中间那段 rand(10,99).date("YmdHis") 是服务器随机生成的，你事先不知道，也控制不了。文件名后缀又是 .jpg。

那保存出来的就是 3220261002153000.jpg，一个图片文件。你直接访问它，PHP 代码不会被执行，因为服务器只对 .php 后缀的文件调用 PHP 解析器。

%00 的作用：把后面多余的部分"切掉"

空字节 \0（%00 解码后的字符）在 C 语言里是字符串结束符。PHP 底层处理路径时，遇到 \0 就认为字符串到此为止。

你传：

save_path = ../upload/pass12.php%00

拼接后，内存里的字符串是：

../upload/pass12.php\0/32 20261002153000 .jpg

move_uploaded_file 读到 \0 就停了，后面的 /32 2026...jpg 全部被丢弃。最终真正保存的路径变成：
text

../upload/pass12.php

文件名完全由你控制，后缀是 .php。 访问它，服务器就会当 PHP 代码执行。
```



**Pass13**

与**Pass12**类似，但 `save_path` 通过 POST 传参。

查资料发现**GET 的 %00 会被自动 URL 解码，而 POST 的 %00 是字符串字面量，不会自动解码。需要在 Burp 中手动解码。**

![image-20261004145242107](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/04/770dc5e73f6718329c92894f9836a6e2-image-20261004145242107.png)

。。。。。。。。。。。。。。。。。。。。。。。。。。。

![image-20261004145318145](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/04/274dc926e23dddfc57179f03bc805f9d-image-20261004145318145.png)

。。。。。。。。。。。。。。。。。。。。。。。。。。

![image-20261004145341092](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/04/b1383984ab5df45de2e381c62946c2dd-image-20261004145341092.png)

成功。

![image-20261004145431020](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/04/e1d96efe0e0bc47c3f1493708ee134c1-image-20261004145431020.png)



**Pass14（重点关注）**

新题型：图片马的上传与解析。

![image-20261008135625445](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/08/79766cc7f64ebc9080115a2d6af06a9b-image-20261008135625445.png)

一开始连一张正常的.jpg图片都上传不了了?????

查资料发现：upload-labs 的官方 release 说明中明确记录了一条：“解决 Pass-14 无法上传 jpg 图片问题”。

说明目前这个靶场是旧的，有问题的。

卸载旧的，下载新的，重新配置环境。

```
https://github.com/c0ny1/upload-labs/releases
```

上传完图片马后，点击黄色字“文件包含漏洞”进入新界面。

![image-20261008135738122](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/08/3c95266c77a38dc0ef181e54645ffbb0-image-20261008135738122.png)

url输入内容进行测试：

![image-20261008135839122](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/08/3d870b63ed5edbe85d5db41f38aa920c-image-20261008135839122.png)

测试时发现网页一直报错（如下之类）。

```
Warning: Unexpected character in input: '' (ASCII=18) state=1 in D:\xxxxxx\WWW\upload\4020261008110428.png on line 3304

Parse error: syntax error, unexpected T_STRING in D:\xxxxxx\WWW\upload\4020261008110428.png on line 3304
```

看别人做题过程写的“换一张图片试试就成功了”，尝试发现还是不行（换了7张图片，生成7个图片马全部报错）!

**报错的核心原因**：图片马在 `<?php` 代码之前，混入了会被 PHP 解析器误读的字节。

查资料发现得把`short_open_tag`设置成 Off 可以降低报错概率。

```
short_open_tag 控制的是短标签 <? 是否被当作 PHP 代码开头。它有两个取值：
取值	<?php 是否解析	<?（短标签）是否解析
On	 解析	           解析（这就是你报错的根源）
Off	 仍然解析	     不解析，当普通文本输出

你写的代码用的是完整标签 <?php，不是短标签 <?。完整标签 <?php 在任何情况下都会被 PHP 解析，和 short_open_tag 无关。
```

用notepad查看图片文件的时候发现 < 转变成 ? 了，不过不影响连接，不知道什么原因。

![image-20261008140958494](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/08/50149c212cf365fb7e33b19822560b85-image-20261008140958494.png)

想解决的话：在 `<?php` 前留一个换行。

蚁剑测试连接的时候url要写文件包含漏洞页面的url，不然连不到。

（127.0.0.1/upload/.....是错误的！！！）

![image-20261008141326713](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/08/17e4c6440a8aea0c6c7e095e872b8994-image-20261008141326713.png)

.jpg（.png）测试成功。

![屏幕截图 2026-10-08 135315](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/08/abc40c62a65460f2ee7ac86cf371067b-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-10-08%20135315.png)



至于.gif，在.php文件头加上GIF89a，上传即可被解析保存为.gif文件，同样测试成功。



-**网页测试的时候可以用phpinfo效率比较高，**

 **测试成功之后再改为cmd来连接。**

```
<? php phpinfo(); ?>
```

```
<?php @eval($_POST['cmd']); ?>
```



**Pass15**

同**Pass14**。

尝试用010Editor做一遍：

复制cmd木马代码，010打开后插入文本末尾，保存。

![image-20261008143854804](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/10/08/ab61b6b87eacce64829c5540728ccf78-image-20261008143854804.png)

然后测试成功，不多写了。
