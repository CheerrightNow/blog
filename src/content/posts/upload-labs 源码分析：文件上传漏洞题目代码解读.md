---
title: upload-labs 源码分析：文件上传漏洞题目代码解读
category: Web-靶场实战
description: 通过查看并理解 upload-labs 各题目的源码，分析文件上传漏洞的成因与绕过思路，加深对漏洞原理的理解。
published: 2026-10-02
tags: [Web, 文件上传漏洞, 靶场实战, 源码分析]
---

**一、部分代码理解**

**01(详见10-3)** 

```
$file_name = trim($_FILES['upload_file']['name']);
```

**作用：**获取用户上传文件的原始文件名，并去除首尾的空白字符。



**02**

```
$file_ext = strrchr($file_name, '.');
```

**作用：**从文件名中截取最后一个 . 及其后面的内容，也就是"扩展名（带点）"



**03**

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



**04**

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



**05**

```
file_exists(UPLOAD_PATH)
```

-`file_exists()`：PHP 内置函数，**检查指定路径的文件或目录是否存在**，返回 `true`/`false`。

-`UPLOAD_PATH`：**通常是代码里定义的一个常量**（比如 `define('UPLOAD_PATH', '/var/www/uploads/')`），值是**开发者写死的固定路径**。

-所以 `file_exists(UPLOAD_PATH)` 的意思是：**"检查上传目录是否存在"**，常用于写入前判断目录在不在。



**06 新版pass13：检查图标内容开头2个字节**

```
$strInfo = @unpack("C2chars", $bin);    
$typeCode = intval($strInfo['chars1'].$strInfo['chars2']);
```

```
$strInfo = @unpack("C2chars", $bin); 
```

| 部分        | 含义                                                         |
| ----------- | ------------------------------------------------------------ |
| `unpack()`  | PHP 函数，把**二进制字符串**按指定格式**解包**成数组         |
| `@`         | 错误抑制符，屏蔽 unpack 失败时的警告                         |
| `"C2chars"` | 格式字符串：**C** = 无符号字符（unsigned char，1字节），**2** = 读取 2 个，**chars** = 结果数组的键名前缀 |
| `$bin`      | 要解包的二进制数据（通常是文件开头的几个字节）               |
| `$strInfo`  | 返回的关联数组                                               |

```
$typeCode = intval($strInfo['chars1'].$strInfo['chars2']);
```



1. **`.` 是字符串连接符**，先把两个数字**拼接成字符串**：
   - `71` 和 `73` → `"7173"`
2. **`intval()`** 把字符串转成整数：
   - `"7173"` → `7173`



**07 新版pass14：getimagesize()检查是否为图片文件**

**07-1**

```
$info = getimagesize($filename);
```

`getimagesize()` 是 PHP 内置函数，用于**获取图像文件的尺寸和类型信息**。它会读取文件头来判断这是不是一张合法的图片。

**成功时返回一个数组，**如果不是合法图片，返回 `false`。

| 索引   | 含义             | 示例                                                        |
| ------ | ---------------- | ----------------------------------------------------------- |
| `[0]`  | 宽度（像素）     | 100                                                         |
| `[1]`  | 高度（像素）     | 200                                                         |
| `[2]`  | **图像类型常量** | `IMAGETYPE_GIF`(1)、`IMAGETYPE_JPEG`(2)、`IMAGETYPE_PNG`(3) |
| `[3]`  | 宽高字符串       | `"width=\"100\" height=\"200\""`                            |
| `mime` | MIME 类型        | `"image/jpeg"`                                              |

**07-2**

```
$ext = image_type_to_extension($info[2]);
```

`image_type_to_extension()` 把**图像类型常量**（`$info[2]`）转换成对应的**文件扩展名**。

| `$info[2]` 常量  | 值   | 转换后的 `$ext` |
| ---------------- | ---- | --------------- |
| `IMAGETYPE_GIF`  | 1    | `.gif`          |
| `IMAGETYPE_JPEG` | 2    | `.jpeg`         |
| `IMAGETYPE_PNG`  | 3    | `.png`          |
| `IMAGETYPE_BMP`  | 6    | `.bmp`          |

>  **注意**：默认返回的扩展名**带点**，比如 `.gif`、`.jpeg`。
> 如果想不带点，需要传第二个参数 `false`：
>
> php
>
> ```
> $ext = image_type_to_extension($info[2], false); // "jpeg"
> ```

**07-3**

```
if (stripos($types, $ext) >= 0) {
```

| `stripos()` | 查找字符串首次出现的位置，不区分大小写 |
| ----------- | -------------------------------------- |

判断 `$ext` 是否出现在允许的类型字符串 `$types` 中。

`stripos()` 的返回值：

- **找到**：返回位置索引（`0`、`1`、`2`…）
- **没找到**：返回 `false`



**08 新版pass15：exif_imagetype()检查是否为图片文件**

**08-1**

```
$image_type = exif_imagetype($filename);
```

| `exif_imagetype()` | PHP 内置函数，读取文件**开头的几个字节（魔数）**，判断图片类型 |
| ------------------ | ------------------------------------------------------------ |

成功时返回类型常量（整数）：

| 常量             | 值   | 图片类型 |
| ---------------- | ---- | -------- |
| `IMAGETYPE_GIF`  | 1    | GIF      |
| `IMAGETYPE_JPEG` | 2    | JPEG     |
| `IMAGETYPE_PNG`  | 3    | PNG      |
| `IMAGETYPE_SWF`  | 4    | SWF      |
| `IMAGETYPE_PSD`  | 5    | PSD      |
| `IMAGETYPE_BMP`  | 6    | BMP      |
| `IMAGETYPE_WEBP` | 18   | WebP     |
| `IMAGETYPE_ICO`  | 17   | ICO      |

**失败**（不是图片 / 文件不存在）返回 **`false`**。

**和 `getimagesize()` 的区别**

| 对比项   | `exif_imagetype()`   | `getimagesize()`          |
| -------- | -------------------- | ------------------------- |
| 读取量   | **只读开头几个字节** | 需读取更多数据            |
| 速度     | **更快、更省内存**   | 较慢                      |
| 返回内容 | 只返回类型常量       | 返回宽、高、类型、MIME 等 |
| 适用场景 | **只判断类型**       | 需要尺寸信息时            |
| 依赖扩展 | 需要 **exif 扩展**   | 需要 GD 扩展              |



**09 新版pass16：二次渲染**

**09-1**

```
$filetype = $_FILES['upload_file']['type'];
```

取出浏览器声明的 **MIME 类型**，例如 `image/jpeg`。

**09-2**

```
$target_path=UPLOAD_PATH.'/'.basename($filename);
```

`basename()` 是 PHP 函数，**返回路径中的文件名部分**，去掉目录部分。

```
basename('/etc/passwd');           // "passwd"
basename('/home/user/a.jpg');      // "a.jpg"
basename('../../etc/passwd');      // "passwd"  ← 去掉了 ../
basename('C:\\Windows\\file.txt'); // "file.txt"
```

好处：`basename()` **去掉路径**，防止用户传 `../../etc/passwd` 这种路径穿越攻击。

**09-3**

```
$fileext = substr(strrchr($filename, "."), 1);
```

`strrchr($filename, "."):`

`strrchr()` 查找**指定字符最后一次出现的位置**，并返回**从该位置到字符串结尾**的部分。

```
strrchr("photo.jpg", ".");   // ".jpg"
strrchr("a.b.c.png", ".");   // ".png"（最后一个点）
strrchr("photo", ".");       // false（没有点）
```

- **r** 表示 **right**（从右边找，即最后一个）。
- 对应还有 `strchr()`（别名 `strstr`），是从左边找第一个。



`substr(..., 1):`

`substr(字符串, 1)` 表示**从索引 1 开始截取到最后**，也就是**去掉第一个字符（那个点）**。

```
substr(".jpg", 1);   // "jpg"
```



**结果**

```
$fileext = "jpg";   // 小写无点，如 "jpg"、"png"
```



**09-4**

```
$im = imagecreatefromjpeg($target_path);
```

| `imagecreatefromjpeg()` | GD 库函数，**读取 JPEG 文件并返回一个图像资源（resource / GdImage 对象）** |
| ----------------------- | ------------------------------------------------------------ |

GD 库为每种图片格式提供了对应函数：

| 函数                      | 处理格式                     |
| ------------------------- | ---------------------------- |
| `imagecreatefromjpeg()`   | JPEG                         |
| `imagecreatefrompng()`    | PNG                          |
| `imagecreatefromgif()`    | GIF                          |
| `imagecreatefrombmp()`    | BMP                          |
| `imagecreatefromwebp()`   | WebP                         |
| `imagecreatefromstring()` | **自动识别**任意格式（推荐） |

成功后 `$im` 是一个图像资源；**失败返回 `false`**。



**09-5**

```
@unlink($target_path);
```

| `unlink()` | PHP 内置函数，**删除一个文件**（相当于 shell 里的 `rm`） |
| ---------- | -------------------------------------------------------- |
| `@`        | 错误抑制符，屏蔽删除失败时的警告/错误信息                |



**09-6**

```
imagejpeg($im,$img_path);
```

| `imagejpeg()` | GD 库函数，把图像资源**输出为 JPEG**              |
| ------------- | ------------------------------------------------- |
| `$im`         | 图像资源（前面由 `imagecreatefromjpeg()` 等创建） |
| `$img_path`   | 输出目标路径                                      |

 PHP 用 GD 库把图像资源保存/输出为 JPEG 文件，通常是"图片二次渲染"的最后一步——把处理后的图像写出到磁盘。



**10 新版Pass18--Apache解析漏洞+条件竞争**

**10-1**

```
require_once("./myupload.php");
```

| 部分               | 含义                                                         |
| ------------------ | ------------------------------------------------------------ |
| `require`          | 引入/包含一个文件。如果**文件不存在或引入失败,会报致命错误(Fatal Error)并终止脚本** |
| `_once`            | 后缀,表示"**只引入一次**"。如果该文件之前已经被引入过,就**跳过不再重复引入** |
| `"./myupload.php"` | 要引入的文件路径                                             |
| `;`                | 语句结束符                                                   |

**10-2**

```
$imgFileName =time();
```

`time()` 返回当前的 Unix 时间戳,即从 1970 年 1 月 1 日 00:00:00(UTC)到现在的秒数,是一个整数。

**10-3**

```
$u = new MyUpload($_FILES['upload_file']['name'], $_FILES['upload_file']['tmp_name'], $_FILES['upload_file']['size'],$imgFileName);
```

`new MyUpload(...)` = 实例化类,创建一个对象 `$u`,括号里的 4 个参数传给类的构造函数。

`$_FILES` 是 PHP 的**超级全局变量**,专门接收通过 **`<form>` 表单以 `multipart/form-data` 方式上传的文件**。提交后,PHP 自动把文件信息放进 `$_FILES['upload_file']` 数组,包含:

| 键         | 含义                               | 例子             |
| ---------- | ---------------------------------- | ---------------- |
| `name`     | 用户电脑上的**原始文件名**         | `photo.jpg`      |
| `tmp_name` | 文件上传后存在**服务器的临时路径** | `/tmp/phpAbC123` |
| `size`     | 文件大小(**字节**)                 | `204800`(200KB)  |
| `type`     | MIME 类型(如 `image/jpeg`)         | —                |
| `error`    | 错误码(0=成功)                     | `0`              |

**10-4**

```
$img_path = $u->cls_upload_dir . $u->cls_file_rename_to;
```

`cls` 是 **class(类)** 的缩写。这是作者的一种**命名习惯**,用来标明"这是属于类的成员变量"。

所以在 `MyUpload` 类内部,你大概能找到这样的定义:

```
class MyUpload {
    
    var $cls_upload_dir;      // ← 就是它,上传目录
    var $cls_file_rename_to;  // 重命名后的文件名
    var $cls_file_exists;     // 是否检查重名
    var $cls_rename_file;     // 是否重命名
    // ... 其他属性
    
    function upload($dir) { ... }
    function setDir($dir) { ... }
}
```



**二、漏洞成因代码分析与防护建议（源码请自行到靶场查看）**

**Pass18---Apache解析漏洞+条件竞争**

```
$ret = $this->checkExtension();   // ① 先校验扩展名(白名单)
...
$ret = $this->move();             // ② 把文件移动到目标目录(此时文件已落地)
...
if( $this->cls_rename_file == 1 ){
    $ret = $this->renameFile();   // ③ 之后才重命名(可能改成无扩展名/时间戳名)
}
```

------

**条件竞争漏洞的成因：**"文件先写入 Web 目录(可被访问)" 与 "校验/改名/删除" 之间存在时间差；攻击者利用高并发在时间窗口内抢先访问,从而绕过扩展名白名单,执行本不该被允许的脚本。

**防护建议：**

1. **先校验、后落地**:所有校验(扩展名、MIME、大小)在 `move()` **之前**完成,不合法直接拒绝,绝不落地。
2. **落地即安全命名**:`move()` 时就用**不可预测的随机名 + 强制安全扩展名**保存,不依赖"事后重命名"。
3. **上传目录禁止执行**:配置 Web 服务器,上传目录**禁用 PHP 解析**(如 Nginx `location ~ \.php$ { deny all; }`)。
4. **不在 Web 目录做临时存储**:临时文件放 Web 根之外。
5. **用随机名替代 `time()`**:`bin2hex(random_bytes(16))` 等,杜绝可预测。
