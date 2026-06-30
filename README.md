--

## 📋 简介

EDT (Enterprise Deployment Toolkit) 是一个面向企业软件实施工程师的 Windows 桌面工具箱，聚焦**离线运行**、**单 EXE 部署**、**专业统一体验**。涵盖文本处理、编码转换、Linux 命令速查、配置文件编辑、Docker/K8S 辅助、图片处理、Excel 转换、Word 处理、脚本中心等十余个功能模块。

> **无需安装** — 下载便携版 EXE，双击即用。

---

## 🚀 快速开始

### 下载即用

1. 前往 [Releases](https://github.com/DeadlockGen/EDT_Workbench/releases) 下载 `EDT-0.1.0-portable.exe`
2. 双击运行，无需安装

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/DeadlockGen/EDT_Workbench.git
cd EDT_Workbench/edt

# 安装依赖
npm install

# 启动 Web 开发模式（浏览器预览）
npm run dev:web

# 启动 Electron 桌面模式
npm run dev

# 打包为便携版 EXE
npm run package:portable
```

---

## 🧩 功能模块

| 模块 | 功能 | 复杂度 |
|------|------|--------|
| **文本处理** | JSON/XML/YAML/SQL/INI/Properties 格式化与校验、文本 Diff、格式互转 | ★★★★ |
| **编码工具** | Base64/URL/Unicode/HTML/Hex 编解码、MD5/SHA/SHA256/SHA512 哈希、HMAC、UUID/NanoID 生成、JWT 解析 | ★★★ |
| **Linux 辅助** | systemctl/Docker/K8S/Nginx/MySQL/Oracle/PostgreSQL/Kafka/RabbitMQ 命令速查、分类搜索与收藏 | ★★ |
| **配置文件工具** | YAML/XML/Nginx/Properties/Env 多格式语法高亮、格式化、校验、Diff | ★★★ |
| **Docker / K8S** | Docker Compose 校验与格式化、YAML 校验 | ★★ |
| **Redis 工具** | TTL 转换、命令速查、数据结构说明 | ★ |
| **图片工具** | 图片压缩、Base64 互转、SVG 预览、ICO 生成、二维码生成 | ★★★★ |
| **Excel 工具** | CSV↔Excel/JSON/SQL/Markdown/HTML 互转、Sheet 对比、列对比 | ★★★★ |
| **Word 工具** | PDF↔Word 互转 | ★★★ |
| **脚本中心** | Shell/PowerShell/CMD/SQL/Python 脚本管理、CRUD、分类/标签/搜索/收藏、模板创建、JSON 导入/导出 | ★★★★★ |

---

## 🏗️ 技术栈

| 层 | 技术 | 用途 |
|----|------|------|
| 桌面容器 | **Electron** | 跨平台桌面应用 |
| UI 框架 | **React 18** | 组件化 UI |
| UI 组件库 | **Ant Design 5** | 企业级组件 |
| 样式方案 | **TailwindCSS 3** | 实用工具类 |
| 状态管理 | **Zustand** | 轻量状态管理 |
| 路由 | **React Router 6** | SPA 路由 |
| 代码编辑器 | **Monaco Editor** | 代码高亮与编辑 |
| 数据库 | **sql.js** (Web) / **better-sqlite3** (Electron) | 本地持久化 |
| 构建工具 | **electron-vite** | 三进程构建 |
| 打包 | **electron-builder** | 安装包构建 |

---

## 📁 项目结构

```
EDT_Workbench/
├── edt/
│   ├── electron/              # 主进程代码
│   │   ├── main.ts            # 应用入口
│   │   ├── preload.ts         # 预加载脚本 (contextBridge)
│   │   ├── ipc/               # IPC 处理器
│   │   └── services/          # 主进程服务 (SQLite)
│   ├── src/                   # 渲染进程代码
│   │   ├── modules/           # 业务模块 (按功能拆分)
│   │   ├── components/        # 共享组件
│   │   ├── layouts/           # 布局组件
│   │   ├── router/            # 路由配置
│   │   ├── stores/            # Zustand 状态管理
│   │   ├── hooks/             # 共享 Hooks
│   │   ├── services/          # 渲染进程服务
│   │   └── styles/            # 全局样式
│   ├── shared/                # 主/渲染进程共享代码
│   └── package.json
├── ARCHITECTURE.md            # 架构设计文档
└── README.md
```

---

## ⚙️ 开发命令

```bash
npm run dev              # 启动 Electron 开发模式
npm run dev:web          # 启动 Web 开发模式 (http://localhost:5173)
npm run build            # 构建项目
npm run package          # 打包为 NSIS 安装包
npm run package:portable # 打包为便携版 EXE
npm run lint             # 代码检查
npm run format           # 代码格式化
```

---

## 📜 开源协议

本项目基于 [MIT License](LICENSE) 开源。
