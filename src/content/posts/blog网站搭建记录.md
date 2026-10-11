---
title: blog网站搭建记录
description: 个人blog网站迁移过程（hexo -> Astro+Fuwari）
published: 2026-10-10
tags:
- blog网站搭建
---

**github + Astro + Fuwari**



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

