---
title: Kali Linux：中文输入法安装配置指南
category: 系统配置
description: 介绍在 Kali Linux 环境下安装与配置中文输入法的完整流程，涵盖输入法框架选择、安装步骤及常见问题处理。
published: 2026-10-22
tags: [Kali, Linux, 中文输入法, 系统配置]
---

**Kali Linux 中文输入法 | Fcitx5 一键配置教程（2026最新）**

参考文章：https://github.com/techjiang/Gmeek-HelloBlog/issues/5

**框架：Fcitx5**

#### **1. 更新软件源并安装核心组件**

打开终端，执行以下命令：

- `sudo apt update`
- `sudo apt install fcitx5 fcitx5-chinese-addons fcitx5-pinyin fcitx5-rime fcitx5-frontend-gtk3 fcitx5-frontend-gtk4 fcitx5-frontend-qt5 fcitx5-configtool`

注：`fcitx5-rime` 提供了强大的“中州韵”引擎（支持多种输入方案），`fcitx5-pinyin` 是基础拼音引擎。建议都装上。

#### **2. 设置默认输入法框架**

安装完成后，需要告诉系统使用 Fcitx5：

- `im-config -n fcitx5`

如果提示需要重启或注销，请先记住，稍后操作。

#### **3. 配置自动启动 (针对桌面环境)**

Kali 默认通常使用 XFCE 桌面。

- **自动启动设置**：打开菜单(左上角的kali龙标志) -> 设置 (Settings) -> 会话和启动 (Session and Startup) -> 应用程序自动启动 (Application Autostart)。点击“添加”，名称填 `Fcitx5`，命令填 `fcitx5 -d` (或者在列表中找是否有 Fcitx5 相关选项并勾选)。

  或者直接在终端运行以下命令将其加入自启（适用于大多数情况）：

  - `echo "fcitx5 -d" >> ~/.xprofile`

  如果是 Wayland 会话，可能需要检查 `/etc/environment` 或特定的环境变量设置，但在 Kali 默认的 X11 环境下上述方法通常有效。

#### **4. 添加中文输入法**

1. 重启电脑或注销重新登录（**必须步骤**，否则输入法可能无法加载）。
2. 登录后，在应用菜单中找到 **Fcitx5 Configuration** (Fcitx5 配置)。
3. 在右侧的 "Available Input Method" (可用输入法) 列表中，取消勾选 "Only Show Current Language" (仅显示当前语言)。
4. 搜索 `Pinyin` 或 `Rime`。
5. 选中它们，双击箭头按钮添加到左侧的 "Input Method" (已选输入法) 列表中。
   - 建议顺序：Keyboard - English, Pinyin, Rime。
6. 点击 "Apply" 或 "OK"。

#### **5. 使用与切换**

- **切换输入法**： `Ctrl + Space` 
- 如果快捷键不生效，可以在 Fcitx5 配置工具的 "Extra" 或 "Global Config" 中查看快捷键设置。
