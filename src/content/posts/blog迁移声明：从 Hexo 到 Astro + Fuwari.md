---
title: "blog迁移声明：从 Hexo 到 Astro + Fuwari"
category: 公告
description: "个人blog网站迁移过程（hexo -> Astro+Fuwari）"
published: 2026-10-10
tags: [公告, 博客, Astro, Fuwari]
---

**Blog站点迁移说明**

本站已完成底层框架迁移，由原来的 **Hexo** 切换为 **Astro + Fuwari 主题**。迁移的目的是获得更现代的页面视觉、更流畅的交互体验，以及更轻量的前端性能。



**对读者的影响**

- 原有文章已尽量完整迁移，正文内容保持不变。
- 文章 frontmatter 字段做了适配调整，部分文章的发布日期、标签或分类可能有细微变化。
- 图片仍使用原有图床外链，显示不受影响。
- 站点视觉、导航和搜索交互已更新，阅读体验以新版为准。



**后续计划**

- 继续补充和整理历史文章
- 优化移动端阅读体验



**以下为blog迁移过程简述**

**01 安装pnpm**

Fuwari 默认使用 pnpm，所以得安装。Windows 上npm 安装：

```
npm install -g pnpm
```

**02 生成 Fuwari 项目**

找一个存放新博客的目录，运行：

```
npm create fuwari@latest
```

**03 安装依赖**

```
pnpm install
pnpm add sharp
```

其中`sharp` 是Fuwari的图片处理依赖。

**04 搬运文章**（网站迁移时使用）

把原项目 里的 `.md` 文件，复制到新 Fuwari 项目的 `src/content/posts/` 目录下。

**05 调整 frontmatter 字段**

可用AI生成相关脚本或手动修改。

**06 本地测试**

```
pnpm dev
```

打开 `http://localhost:4321`，看看文章能不能正常显示，图片能不能加载出来。

**07 部署到 GitHub Pages**

新建一个仓库；

在 Fuwari 项目里配置 `astro.config.mjs`；

创建 `.github/workflows/deploy.yml`

(`build.yml` 和 `biome.yml` 是 Fuwari 作者为他自己的仓库写的 CI workflow，建议删除)；

把新 Fuwari 项目推到 GitHub 新仓库；

去仓库 **Settings → Pages**，Source 选 **GitHub Actions**；

等 Actions 跑完，访问网站。

**08 关于文章的撰写与发布**

**撰写：**手动复制现有文章来写新文章。

（破解版Typora新建文章选项好像有点问题）

**发布：**

```
cd (blog目录)
git add .
git commit -m "(新文章)"
git push
```

