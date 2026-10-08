---
title: upload-labs源码分析
description: 查看并理解题目源码
published: 2026-10-02
tags:
- Web
  - 文件上传漏洞
    - 靶场实战
      -源码分析
---

01

```
$file_name = trim($_FILES['upload_file']['name']);
```

**作用：**获取用户上传文件的原始文件名，并去除首尾的空白字符。



02

```
$file_ext = strrchr($file_name, '.');
```

**作用：**从文件名中截取最后一个 . 及其后面的内容，也就是"扩展名（带点）"



03

```
$temp_file = $_FILES['upload_file']['tmp_name'];
```

**作用**：获取上传文件在服务器上的临时存储路径。



--假设用户上传了 `photo.jpg`，PHP 可能返回：

```
/tmp/php2fG8a1        （Linux）
C:\Windows\Temp\phpA3F2.tmp   （Windows）
```

这个路径是系统自动生成的，跟用户原始文件名无关。

上传成功后，临时文件会在脚本执行结束时自动删除，所以必须在这之前把它移动到目标位置。



04

```
$file_ext = substr($_FILES['upload_file']['name'],strrpos($_FILES['upload_file']['name'],".")+1);
```

**作用：**取上传文件名的最后一个 `.` 之后的部分，作为扩展名（不带点）。

## <font size='5'>拆解说明</font>

从内往外看：

**1. `strrpos($_FILES['upload_file']['name'], ".")`**

- `strrpos()`：查找 `.` 在文件名中**最后一次出现的位置**（返回下标，从 0 开始）。
- 比如 `photo.jpg`，最后一个 `.` 在索引 **5**。

**2. `+ 1`**

- 因为要找的是 `.` **之后**的内容，所以位置 +1，跳过那个点。

**3. `substr(文件名, 位置)`**

- `substr()`：从指定位置开始截取到字符串末尾。
- 所以 `substr("photo.jpg", 6)` = `"jpg"`。



05

```
file_exists(UPLOAD_PATH)
```

-`file_exists()`：PHP 内置函数，**检查指定路径的文件或目录是否存在**，返回 `true`/`false`。

-`UPLOAD_PATH`：**通常是代码里定义的一个常量**（比如 `define('UPLOAD_PATH', '/var/www/uploads/')`），值是**开发者写死的固定路径**。

-所以 `file_exists(UPLOAD_PATH)` 的意思是：**"检查上传目录是否存在"**，常用于写入前判断目录在不在。
