---
name: edt-project-status
description: EDT (Enterprise Deployment Toolkit) Electron/React/TypeScript desktop app - project structure, modules, architecture, and current development status
metadata:
  type: project
---

# EDT (Enterprise Deployment Toolkit) — 项目状态记录

## 项目定位
面向企业软件实施工程师的 Windows 桌面工具箱，Electron + React + TypeScript + Vite + Ant Design + TailwindCSS + Monaco Editor。离线运行，单 EXE 部署。

## 技术栈
- Electron 42 + electron-vite 5 + Vite 6
- React 18 + React Router 6 + Zustand 5
- Ant Design 5 + TailwindCSS 3
- Monaco Editor (@monaco-editor/react)
- SQLite (sql.js, 纯 JS/WASM 无编译依赖)
- docx (OOXML 生成)
- crypto-js / uuid / nanoid / js-yaml / papaparse / xlsx / qrcode

## 目录结构
edt/
├── electron/          # 主进程 (main + preload + IPC + SQLite)
├── shared/types/      # IPC/脚本/Linux/设置类型
├── src/
│   ├── layouts/       # AppLayout (Sidebar 48↔200px + Toolbar + Content)
│   ├── router/        # HashRouter, 10 个模块路由
│   ├── stores/        # app.store (theme/sidebar), editor.store
│   ├── modules/       # 10 个模块，每个完全自治
│   ├── components/    # MonacoEditor / SplitPanel / ToolCard / PageHeader / 通用组件
│   ├── hooks/         # useTheme / useClipboard / useElectron
│   └── styles/        # globals.css (Tailwind + 滚动条 + Monaco + Tabs)
├── electron-builder.yml
└── vite.web.config.ts (独立 Web 调试配置)

## 10 个模块

### 1. text — 文本处理 ✅
子标签: JSON/XML/YAML/SQL/INI/Properties/Diff/互转
每个子页面使用 SplitPanel + MonacoEditor 布局
JSON 支持格式化/压缩/校验
XML 支持格式化/校验 (中英文双提示)
SQL 支持 11 种方言
格式互转: JSON↔YAML↔XML↔CSV

### 2. encode — 编码工具 ✅
10 个子标签: Base64/URL/Unicode/HTML/Hex/Hash/HMAC/UUID/NanoID/JWT
大部分使用 SplitPanel 左右布局

### 3. linux — Linux 辅助 ✅
11 个命令分类 (Systemctl/Journalctl/Nginx/Docker/K8S/Redis/MySQL/Oracle/PostgreSQL/Kafka/RabbitMQ)
80+ 条命令，支持搜索、一键复制

### 4. config — 配置文件 ✅
5 个标签: Nginx/YAML/Properties/XML/.env
Monaco 语法高亮 + 格式化 + 校验

### 5. docker — Docker/K8S ✅
3 个标签: Compose 校验/Dockerfile/YAML 校验

### 6. redis — Redis 工具 ✅
3 个标签: TTL 转换/常用命令/数据结构说明

### 7. image — 图片工具 ✅
5 个标签: 压缩/Base64 转换/SVG 查看/ICO 生成/二维码生成

### 8. excel — Excel 工具 ✅
6 个标签: CSV↔Excel/JSON/SQL/Markdown/HTML

### 9. word — Word 工具 ✅(MVP后期新增)
2 个标签: Word→PDF / PDF→Word
Word→PDF: 简单文件重命名下载
PDF→Word: 正则提取 PDF 文本 + docx 库生成标准 OOXML
**重要**: 之前尝试过 pdfjs-dist 但 worker CDN 离线失败，已移除
**注意**: PDF 文本提取质量取决于 PDF 编码方式，纯文本 PDF 效果好

### 10. scripts — 脚本中心 ✅
CRUD + SQLite 持久化 + 模板预设 + 导入导出 + 全文搜索 + 收藏

### 11. settings — 设置页面 ✅
主题/编辑器配置/关于

## 关键 Bug 修复历史

### 1. 侧栏折叠布局错位 (Fixed)
**问题**: Sidebar 展开到 200px 时内容区域 marginLeft 硬编码 48px
**修复**: AppLayout.tsx + Toolbar.tsx 中 marginLeft 改为动态绑定 sidebarCollapsed

### 2. Monaco 编辑器滚动条失效 (Fixed)
**问题**: SplitPanel 容器 overflow: auto + Monaco 内部滚动条, 双重滚动冲突
**修复过程**: overflow:hidden → overflow:auto → 最终在 globals.css 加 .monaco-scrollable-element { overflow: auto !important; }
**最终**: globals.css 中全局覆盖 + SplitPanel 容器无 overflow

### 3. DiffPage 差异对比框不显示 (Fixed)
**问题**: 使用 hasContent 条件渲染 display:none
**修复**: 始终渲染差异对比面板，输入框固定 flex: 0 0 40%

### 4. PDF→Word 生成文件损坏 (Fixed)
**问题 1**: 之前 JSZip 手动构建 ZIP 不符合 OOXML 规范
**尝试 1**: pdfjs-dist + docx — worker CDN 离线环境失败
**最终**: 移除 pdfjs-dist, 纯正则提取 PDF 文本 + docx 库 Packer.toBlob()
**关键**: 添加 XML 特殊字符转义 + 纯符号行过滤 + 空内容保护

## Dev Server 运行
```bash
cd edt && npm run dev          # Electron 模式
cd edt && npm run dev:web      # Web 调试模式 (端口 5173)
```

## launch.json (内部预览器)
```json
{
  "name": "Web Dev Server",
  "runtimeExecutable": "npm",
  "runtimeArgs": ["run", "dev:web"],
  "port": 5173
}
```
注意: launch.json 必须放在 edt/.claude/ 或 Workbench/.claude/ 下，preview_start 从 Workbench/ 根目录运行

## 待办/已知问题
- PDF→Word 文本提取对于复杂排版 PDF 效果有限
- 部分页面右侧面板布局可能异常 (需统一 SplitPanel 用法)
- antd InputNumber addonAfter 弃用警告 (需改用 Space.Compact)
- 暂无单元测试覆盖
- 暂无 Electron 打包测试
