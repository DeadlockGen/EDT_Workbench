# Enterprise Deployment Toolkit (EDT) — 架构设计文档

> 版本: v0.1 (MVP)
> 最后更新: 2026-06-29

---

## 一、产品架构

### 1.1 产品定位

EDT 是一个面向企业软件实施工程师的 Windows 桌面工具箱，强调**离线运行**、**单 EXE 部署**、**专业统一体验**。

### 1.2 MVP 模块矩阵

| 模块 | 子功能数 | 复杂度 | 核心依赖 |
|------|---------|--------|---------|
| 文本处理 | 14 | ★★★★ | Monaco Editor, js-yaml, sql-formatter, diff |
| 编码工具 | 16 | ★★★ | crypto-js, uuid, nanoid |
| Linux辅助 | 5+ | ★★ | 本地数据(JSON) |
| 配置文件 | 7+ | ★★★ | Monaco Editor |
| Docker/K8S | 6 | ★★ | js-yaml |
| Redis工具 | 6 | ★ | 本地数据(JSON) |
| 图片工具 | 8 | ★★★★ | sharp, qrcode, svg |
| Excel工具 | 8 | ★★★★ | xlsx, papaparse |
| 脚本中心 | 8 | ★★★★★ | SQLite, Monaco Editor |

### 1.3 架构分层

```
┌─────────────────────────────────────────────────┐
│                   UI Layer                       │
│  Ant Design  +  TailwindCSS  +  Monaco Editor    │
├─────────────────────────────────────────────────┤
│               Module Layer                       │
│  Text  │  Encode  │  Linux  │  Config  │  ...    │
├─────────────────────────────────────────────────┤
│               Service Layer                      │
│  SQLite  │  IPC  │  FileSystem  │  Clipboard     │
├─────────────────────────────────────────────────┤
│               Electron Layer                     │
│  Main Process  │  Preload  │  Native Dialogs     │
└─────────────────────────────────────────────────┘
```

---

## 二、系统架构

### 2.1 进程架构

```
┌──────────────────────────────────────────────────┐
│                   Main Process                    │
│  ┌─────────────┐  ┌──────────────┐               │
│  │  Window Mgr  │  │  SQLite Mgr  │               │
│  ├─────────────┤  ├──────────────┤               │
│  │  FileSystem  │  │  NativeDialog│               │
│  ├─────────────┤  ├──────────────┤               │
│  │  AutoUpdater │  │  Tray        │               │
│  └─────────────┘  └──────────────┘               │
│                         │ IPC                     │
├─────────────────────────┼────────────────────────┤
│              Preload (contextBridge)              │
├─────────────────────────┼────────────────────────┤
│                  Renderer Process                 │
│  ┌─────────┐ ┌───────┐ ┌──────┐ ┌──────────────┐│
│  │  React   │ │ Router│ │Store │ │  Monaco Editor││
│  │  App     │ │       │ │Zustnd│ │  Workers     ││
│  └─────────┘ └───────┘ └──────┘ └──────────────┘│
└──────────────────────────────────────────────────┘
```

### 2.2 技术栈明细

| 层 | 技术 | 版本 | 用途 |
|----|------|------|------|
| 框架 | Electron | latest | 桌面容器 |
| UI | React 18 | latest | 组件化 UI |
| 构建 | Vite | latest | 极速 HMR |
| UI库 | Ant Design 5 | latest | 企业级组件 |
| 样式 | TailwindCSS 3 | latest | 实用工具类 |
| 状态 | Zustand | latest | 轻量状态管理 |
| 路由 | React Router 6 | latest | SPA 路由 |
| 编辑器 | Monaco Editor | latest | 代码编辑 |
| 数据库 | better-sqlite3 | latest | 本地持久化 |
| 图标 | @ant-design/icons | latest | 统一图标 |
| 打包 | electron-builder | latest | 安装包构建 |

### 2.3 关键架构决策

1. **electron-vite** 作为构建工具 — 原生支持 Main/Renderer/Preload 三进程构建
2. **Zustand** 而非 Redux — 模块化 store，避免样板代码
3. **better-sqlite3** 同步 API — 简单可靠，无需复杂异步管理
4. **contextBridge** 严格隔离 — 不暴露 node 权限到渲染进程
5. **Monaco Editor 按需加载** — 只在需要编辑器的页面加载，减少内存占用

---

## 三、目录结构

```
edt/
├── electron/                        # 主进程代码
│   ├── main.ts                      # 应用入口
│   ├── preload.ts                   # 预加载脚本
│   ├── ipc/                         # IPC 处理器
│   │   ├── index.ts                 # 注册所有 IPC
│   │   ├── file.ipc.ts              # 文件操作 IPC
│   │   ├── db.ipc.ts                # 数据库 IPC
│   │   ├── dialog.ipc.ts            # 原生对话框 IPC
│   │   └── clipboard.ipc.ts         # 剪贴板 IPC
│   ├── services/                    # 主进程服务
│   │   ├── database.ts              # SQLite 初始化与操作
│   │   └── updater.ts               # 自动更新
│   └── util.ts                      # 主进程工具函数
│
├── src/                             # 渲染进程代码
│   ├── main.tsx                     # React 入口
│   ├── App.tsx                      # App 根组件
│   │
│   ├── layouts/                     # 布局组件
│   │   ├── AppLayout.tsx            # 主布局 (侧栏+顶栏+内容)
│   │   ├── Sidebar.tsx              # 左侧导航
│   │   ├── Toolbar.tsx              # 顶部工具栏
│   │   └── StatusBar.tsx            # 底部状态栏
│   │
│   ├── router/                      # 路由配置
│   │   ├── index.tsx                # 路由聚合
│   │   └── routes.ts                # 路由定义
│   │
│   ├── stores/                      # Zustand 状态管理
│   │   ├── app.store.ts             # 全局状态 (主题, 布局)
│   │   ├── sidebar.store.ts         # 侧栏状态
│   │   └── editor.store.ts          # 编辑器状态
│   │
│   ├── modules/                     # 业务模块 ★ 核心
│   │   ├── text/                    # 模块1: 文本处理
│   │   │   ├── pages/
│   │   │   │   ├── TextPage.tsx         # 模块首页 (功能选择)
│   │   │   │   ├── JsonPage.tsx         # JSON 格式化
│   │   │   │   ├── XmlPage.tsx
│   │   │   │   ├── YamlPage.tsx
│   │   │   │   ├── SqlPage.tsx
│   │   │   │   ├── IniPage.tsx
│   │   │   │   ├── PropertiesPage.tsx
│   │   │   │   ├── DiffPage.tsx         # 文本 Diff
│   │   │   │   └── ConvertPage.tsx      # 格式互转
│   │   │   ├── components/
│   │   │   │   ├── FormatEditor.tsx     # 格式化编辑器
│   │   │   │   └── ConvertPanel.tsx     # 互转面板
│   │   │   ├── utils/
│   │   │   │   ├── formatters.ts        # 格式化逻辑
│   │   │   │   ├── validators.ts        # 校验逻辑
│   │   │   │   └── converters.ts        # 互转逻辑
│   │   │   └── index.ts
│   │   │
│   │   ├── encode/                  # 模块2: 编码工具
│   │   │   ├── pages/
│   │   │   │   ├── EncodePage.tsx       # 编码首页
│   │   │   │   ├── Base64Page.tsx
│   │   │   │   ├── UrlPage.tsx
│   │   │   │   ├── UnicodePage.tsx
│   │   │   │   ├── HtmlPage.tsx
│   │   │   │   ├── HexPage.tsx
│   │   │   │   ├── HashPage.tsx         # MD5/SHA1/SHA256/...
│   │   │   │   ├── HmacPage.tsx
│   │   │   │   ├── UuidPage.tsx
│   │   │   │   ├── JwtPage.tsx
│   │   │   │   └── NanoIdPage.tsx
│   │   │   ├── utils/
│   │   │   │   ├── base64.ts
│   │   │   │   ├── url.ts
│   │   │   │   ├── unicode.ts
│   │   │   │   ├── html.ts
│   │   │   │   ├── hex.ts
│   │   │   │   ├── hash.ts
│   │   │   │   ├── hmac.ts
│   │   │   │   ├── uuid.ts
│   │   │   │   ├── nanoid.ts
│   │   │   │   └── jwt.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── linux/                   # 模块3: Linux辅助
│   │   │   ├── pages/
│   │   │   │   └── LinuxCheatPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── CommandCard.tsx
│   │   │   │   ├── CommandSearch.tsx
│   │   │   │   └── CategoryFilter.tsx
│   │   │   ├── data/
│   │   │   │   ├── systemctl.json
│   │   │   │   ├── docker.json
│   │   │   │   ├── kubernetes.json
│   │   │   │   ├── nginx.json
│   │   │   │   ├── redis.json
│   │   │   │   ├── mysql.json
│   │   │   │   ├── oracle.json
│   │   │   │   ├── postgresql.json
│   │   │   │   ├── kafka.json
│   │   │   │   └── rabbitmq.json
│   │   │   ├── stores/
│   │   │   │   └── linux.store.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── config/                  # 模块4: 配置文件工具
│   │   │   ├── pages/
│   │   │   │   └── ConfigFilePage.tsx
│   │   │   ├── components/
│   │   │   │   ├── ConfigEditor.tsx
│   │   │   │   └── ConfigDiff.tsx
│   │   │   ├── utils/
│   │   │   │   └── configParsers.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── docker/                  # 模块5: Docker/K8S
│   │   │   ├── pages/
│   │   │   │   └── DockerPage.tsx
│   │   │   ├── utils/
│   │   │   │   └── composeValidator.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── redis/                   # 模块6: Redis工具
│   │   │   ├── pages/
│   │   │   │   └── RedisToolsPage.tsx
│   │   │   ├── utils/
│   │   │   │   └── ttlConverter.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── image/                   # 模块7: 图片工具
│   │   │   ├── pages/
│   │   │   │   └── ImageToolsPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── ImageCompress.tsx
│   │   │   │   ├── ImageToBase64.tsx
│   │   │   │   ├── SvgViewer.tsx
│   │   │   │   ├── IcoGenerator.tsx
│   │   │   │   ├── QrCodeGen.tsx
│   │   │   │   ├── QrCodeDecode.tsx
│   │   │   │   └── Screenshot.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── excel/                   # 模块8: Excel工具
│   │   │   ├── pages/
│   │   │   │   └── ExcelToolsPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── CsvExcelConvert.tsx
│   │   │   │   ├── ExcelToJson.tsx
│   │   │   │   ├── ExcelToSql.tsx
│   │   │   │   ├── ExcelToMarkdown.tsx
│   │   │   │   ├── ExcelToHtml.tsx
│   │   │   │   ├── SheetCompare.tsx
│   │   │   │   └── ColumnCompare.tsx
│   │   │   ├── utils/
│   │   │   │   ├── excelConvert.ts
│   │   │   │   └── fieldValidator.ts
│   │   │   └── index.ts
│   │   │
│   │   └── scripts/                 # 模块9: 脚本中心 ★
│   │       ├── pages/
│   │       │   ├── ScriptsPage.tsx       # 脚本列表
│   │       │   └── ScriptEditorPage.tsx  # 脚本编辑器
│   │       ├── components/
│   │       │   ├── ScriptList.tsx
│   │       │   ├── ScriptCard.tsx
│   │       │   ├── ScriptEditor.tsx
│   │       │   ├── ScriptSearch.tsx
│   │       │   ├── CategoryTree.tsx
│   │       │   ├── TagSelector.tsx
│   │       │   └── ImportExport.tsx
│   │       ├── stores/
│   │       │   └── script.store.ts
│   │       └── index.ts
│   │
│   ├── components/                  # 共享组件
│   │   ├── editor/                  # Monaco Editor 封装
│   │   │   ├── MonacoEditor.tsx
│   │   │   ├── DiffEditor.tsx
│   │   │   └── editor.config.ts
│   │   ├── common/                  # 通用组件
│   │   │   ├── PageHeader.tsx       # 页面标题
│   │   │   ├── ToolCard.tsx         # 功能入口卡片
│   │   │   ├── ResultPanel.tsx      # 结果面板
│   │   │   ├── EmptyState.tsx       # 空状态
│   │   │   ├── LoadingState.tsx     # 加载中
│   │   │   ├── ErrorBoundary.tsx    # 错误边界
│   │   │   └── CopyButton.tsx       # 一键复制
│   │   ├── layout/
│   │   │   ├── SplitPanel.tsx       # 分割面板
│   │   │   └── Resizable.tsx        # 可拖拽分割
│   │   └── config/
│   │       └── theme.ts             # 主题配置
│   │
│   ├── hooks/                       # 共享 Hooks
│   │   ├── useTheme.ts
│   │   ├── useClipboard.ts
│   │   ├── useElectron.ts
│   │   ├── useMonaco.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── services/                    # 渲染进程服务
│   │   ├── ipc.ts                   # IPC 调用封装
│   │   └── db.ts                    # 数据库操作封装
│   │
│   ├── utils/                       # 通用工具
│   │   ├── cn.ts                    # Tailwind 合并
│   │   ├── format.ts                # 格式化
│   │   └── file.ts                  # 文件处理
│   │
│   ├── styles/                      # 样式
│   │   ├── globals.css              # 全局样式
│   │   └── editor.css               # 编辑器样式
│   │
│   └── assets/                      # 静态资源
│       └── logo.svg
│
├── shared/                          # 主进程/渲染进程共享
│   ├── types/                       # 类型定义
│   │   ├── ipc.ts                   # IPC 通道类型
│   │   ├── script.ts                # 脚本类型
│   │   ├── linux.ts                 # Linux 命令类型
│   │   └── settings.ts              # 设置类型
│   └── constants.ts                 # 共享常量
│
├── resources/                       # 打包资源
│   ├── icon.ico
│   └── icon.png
│
├── electron-builder.yml             # 打包配置
├── vite.config.ts                   # Vite配置
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── README.md
```

---

## 四、模块划分与依赖关系

### 4.1 模块依赖图

```
App Layout (Sidebar + Toolbar + Content)
    │
    ├── Text Processing ─── Monaco Editor
    │
    ├── Encode Tools ──── crypto-js / uuid / nanoid / jwt
    │
    ├── Linux Cheat ──── 本地 JSON 数据 (无外部依赖)
    │
    ├── Config Files ─── Monaco Editor + parser
    │
    ├── Docker/K8S ───── js-yaml
    │
    ├── Redis Tools ──── 本地 JSON 数据
    │
    ├── Image Tools ──── sharp / qrcode / dom-to-image
    │
    ├── Excel Tools ──── xlsx / papaparse
    │
    └── Script Center ── SQLite + Monaco Editor
```

### 4.2 模块独立性原则

1. 每个模块在 `src/modules/<name>/` 下完全自治
2. 模块之间**不允许直接引用**，只能通过共享组件层交互
3. 共享组件放在 `src/components/`，所有模块可用
4. 模块可自行定义子路由（挂载到模块路由下）
5. 模块可自行管理状态（Zustand store 在模块内）

---

## 五、数据库设计 (SQLite)

### 5.1 ER 图

```
┌─────────────────┐       ┌───────────────────┐
│    scripts       │       │  script_tags      │
├─────────────────┤       ├───────────────────┤
│ id (PK)         │       │ id (PK)           │
│ name            │       │ script_id (FK)    │
│ content         │       │ tag               │
│ language        │ 1──N  │ created_at        │
│ category        │──────>│                   │
│ is_favorite     │       └───────────────────┘
│ description     │
│ created_at      │       ┌───────────────────┐
│ updated_at      │       │  script_categories │
└─────────────────┘       ├───────────────────┤
                          │ id (PK)           │
┌─────────────────┐       │ name              │
│ command_favs    │       │ parent_id (FK)    │
├─────────────────┤       │ sort_order        │
│ id (PK)         │       │ created_at        │
│ command_key     │       └───────────────────┘
│ category        │
│ created_at      │       ┌───────────────────┐
└─────────────────┘       │  app_settings     │
                          ├───────────────────┤
┌─────────────────┐       │ key (PK)          │
│   favorites     │       │ value             │
├─────────────────┤       │ updated_at        │
│ id (PK)         │       └───────────────────┘
│ type            │
│ ref_id          │
│ created_at      │
└─────────────────┘
```

### 5.2 建表语句

```sql
-- 脚本表
CREATE TABLE IF NOT EXISTS scripts (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL,
    content     TEXT NOT NULL DEFAULT '',
    language    TEXT NOT NULL DEFAULT 'shell',
    category_id INTEGER,
    is_favorite INTEGER NOT NULL DEFAULT 0,
    description TEXT DEFAULT '',
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (category_id) REFERENCES script_categories(id) ON DELETE SET NULL
);

-- 脚本分类
CREATE TABLE IF NOT EXISTS script_categories (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT NOT NULL UNIQUE,
    parent_id   INTEGER DEFAULT NULL,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (parent_id) REFERENCES script_categories(id) ON DELETE CASCADE
);

-- 脚本标签
CREATE TABLE IF NOT EXISTS script_tags (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    script_id   INTEGER NOT NULL,
    tag         TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (script_id) REFERENCES scripts(id) ON DELETE CASCADE,
    UNIQUE(script_id, tag)
);

-- 命令收藏
CREATE TABLE IF NOT EXISTS command_favorites (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    command_key TEXT NOT NULL,
    category    TEXT NOT NULL,
    label       TEXT NOT NULL DEFAULT '',
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    UNIQUE(command_key)
);

-- 通用收藏
CREATE TABLE IF NOT EXISTS favorites (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    type        TEXT NOT NULL,
    ref_id      TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now','localtime')),
    UNIQUE(type, ref_id)
);

-- 应用设置
CREATE TABLE IF NOT EXISTS app_settings (
    key         TEXT PRIMARY KEY,
    value       TEXT NOT NULL,
    updated_at  TEXT NOT NULL DEFAULT (datetime('now','localtime'))
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_scripts_category ON scripts(category_id);
CREATE INDEX IF NOT EXISTS idx_scripts_favorite ON scripts(is_favorite);
CREATE INDEX IF NOT EXISTS idx_script_tags_tag ON script_tags(tag);
CREATE INDEX IF NOT EXISTS idx_script_tags_script ON script_tags(script_id);
CREATE INDEX IF NOT EXISTS idx_command_favs_cat ON command_favorites(category);
CREATE INDEX IF NOT EXISTS idx_favorites_type ON favorites(type);
```

---

## 六、路由设计

### 6.1 路由层级

```
/                               → 重定向到 /text
│
├── /text                       → 文本处理首页
│   ├── /text/json              → JSON 格式化/校验
│   ├── /text/xml               → XML 格式化/校验
│   ├── /text/yaml              → YAML 格式化/校验
│   ├── /text/sql               → SQL 格式化
│   ├── /text/ini               → INI 格式化
│   ├── /text/properties        → Properties 格式化
│   ├── /text/diff              → 文本 Diff
│   └── /text/convert           → 格式互转
│
├── /encode                     → 编码工具首页
│   ├── /encode/base64          → Base64
│   ├── /encode/url             → URL
│   ├── /encode/unicode         → Unicode
│   ├── /encode/html            → HTML
│   ├── /encode/hex             → Hex
│   ├── /encode/hash            → 哈希
│   ├── /encode/hmac            → HMAC
│   ├── /encode/uuid            → UUID
│   ├── /encode/nanoid          → NanoID
│   └── /encode/jwt             → JWT
│
├── /linux                      → Linux 命令速查
│
├── /config-files               → 配置文件工具
│
├── /docker                     → Docker/K8S 工具
│
├── /redis                      → Redis 工具
│
├── /image                      → 图片工具
│   ├── /image/compress         → 图片压缩
│   ├── /image/base64           → Base64 转换
│   ├── /image/svg              → SVG 查看
│   ├── /image/ico              → ICO 生成
│   ├── /image/qrgen            → 二维码生成
│   └── /image/qrdecode         → 二维码解析
│
├── /excel                      → Excel 工具
│
├── /scripts                    → 脚本中心
│   ├── /scripts                → 脚本列表
│   └── /scripts/:id            → 脚本编辑器
│
└── /settings                   → 应用设置
```

### 6.2 路由配置结构

```typescript
// 路由元数据
interface RouteConfig {
  path: string;
  title: string;
  icon: ReactNode;
  module: string;       // 模块标识
  component: ReactNode;
  children?: RouteConfig[];
  showInSidebar: boolean;
}
```

---

## 七、组件设计

### 7.1 组件层级

```
App
 └── AppLayout
      ├── Sidebar
      │    ├── Logo
      │    ├── NavItem (循环)
      │    ├── NavCollapse
      │    └── SettingsLink
      ├── Toolbar
      │    ├── Breadcrumb
      │    ├── SearchBar
      │    ├── ThemeToggle
      │    └── WindowControls
      ├── Content
      │    └── <Outlet /> (React Router)
      └── StatusBar
           ├── ItemCount
           └── AppVersion
```

### 7.2 共享组件清单

| 组件 | 用途 | 状态 |
|------|------|------|
| `MonacoEditor` | 代码编辑器封装 | 受控/非受控 |
| `DiffEditor` | 差异对比编辑器 | 受控 |
| `PageHeader` | 页面标题区 | 纯展示 |
| `ToolCard` | 功能入口卡片 | 可点击 |
| `ResultPanel` | 输出结果展示 | 可折叠/复制 |
| `SplitPanel` | 左右分割面板 | 可拖拽 |
| `CopyButton` | 一键复制按钮 | 可反馈 |
| `EmptyState` | 空状态占位 | 可配置 |
| `LoadingState` | 加载过渡 | 可配置 |
| `ErrorBoundary` | 错误捕获 | 自动 |

### 7.3 Sidebar 导航结构

```
📄 文本处理         → /text/*
🔐 编码工具         → /encode/*
🐧 Linux 辅助       → /linux
⚙️ 配置文件工具     → /config-files
🐳 Docker / K8S    → /docker
📡 Redis 工具       → /redis
🖼️ 图片工具        → /image/*
📊 Excel 工具       → /excel/*
📜 脚本中心         → /scripts/*
```

---

## 八、主题设计

### 8.1 Design Token

```typescript
const themeTokens = {
  // 颜色系统
  color: {
    primary: '#1677ff',       // Ant Design 主色
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1677ff',
  },
  // 间距系统 (4px 基数)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  // 圆角
  radius: {
    sm: 4,
    md: 6,
    lg: 8,
  },
  // 字体
  font: {
    family: "'Segoe UI', -apple-system, sans-serif",
    mono: "'Cascadia Code', 'Fira Code', 'Consolas', monospace",
    size: {
      xs: 12,
      sm: 13,
      md: 14,
      lg: 16,
      xl: 20,
    },
  },
};
```

### 8.2 深色/浅色模式

通过 Ant Design 5 的 `ConfigProvider` 的 `theme` 属性 + TailwindCSS 的 `dark:` class 共同实现，统一由 Zustand `app.store` 中的 `theme` 状态控制。

---

## 九、状态管理

### 9.1 Zustand Store 设计

```typescript
// app.store.ts — 全局状态
interface AppStore {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
}

// editor.store.ts — 编辑器状态
interface EditorStore {
  content: string;
  language: string;
  setContent: (content: string) => void;
  setLanguage: (lang: string) => void;
}

// linux.store.ts — Linux 命令状态
interface LinuxStore {
  favorites: string[];
  searchQuery: string;
  activeCategory: string;
  toggleFavorite: (key: string) => void;
  setSearch: (query: string) => void;
  setCategory: (cat: string) => void;
}

// script.store.ts — 脚本中心状态
interface ScriptStore {
  scripts: Script[];
  categories: Category[];
  activeCategoryId: number | null;
  searchQuery: string;
  loadScripts: () => Promise<void>;
  loadCategories: () => Promise<void>;
  createScript: (data: Partial<Script>) => Promise<void>;
  deleteScript: (id: number) => Promise<void>;
  toggleFavorite: (id: number) => Promise<void>;
}
```

---

## 十、IPC 通信设计

### 10.1 IPC 通道定义

```typescript
// shared/types/ipc.ts
export const IPC_CHANNELS = {
  // 文件操作
  FILE_OPEN: 'file:open',
  FILE_SAVE: 'file:save',
  FILE_READ: 'file:read',
  FILE_WRITE: 'file:write',
  FILE_SELECT: 'file:select',

  // 剪贴板
  CLIPBOARD_READ: 'clipboard:read',
  CLIPBOARD_WRITE: 'clipboard:write',

  // 对话框
  DIALOG_OPEN_FILE: 'dialog:openFile',
  DIALOG_SAVE_FILE: 'dialog:saveFile',
  DIALOG_SELECT_DIR: 'dialog:selectDir',

  // 数据库操作
  DB_EXEC: 'db:exec',
  DB_SELECT: 'db:select',
  DB_INSERT: 'db:insert',
  DB_UPDATE: 'db:update',
  DB_DELETE: 'db:delete',

  // 应用信息
  APP_GET_VERSION: 'app:getVersion',
  APP_GET_PLATFORM: 'app:getPlatform',
} as const;
```

### 10.2 安全隔离

```
Renderer Process
      │
      │  window.electronAPI.fileOpen()
      │  window.electronAPI.dbSelect()
      │
      ▼
  contextBridge (Preload)
      │
      │  ipcRenderer.invoke('file:open')
      │
      ▼
  Main Process Handler
      │
      ├── dialog.showOpenDialog()
      ├── fs.readFile()
      ├── db.prepare().all()
      └── ...
```

---

## 十一、插件机制设计

### 11.1 设计原则

脚本中心实际上承担了"插件系统"的角色。对于 MVP 阶段，采用以下轻量机制：

```
用户脚本 (Shell/Python/SQL/CMD/PowerShell)
        │
        ├── 保存在 SQLite 中
        ├── 通过 Monaco Editor 编辑
        ├── 支持分类/标签/搜索
        ├── 支持导入/导出 (JSON 格式)
        └── 一键复制到剪贴板
```

### 11.2 未来扩展接口设计

```typescript
// Plugin API 定义 (预留，MVP 后实现)
interface EDTPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  icon?: string;

  // 生命周期
  onActivate?: () => void;
  onDeactivate?: () => void;

  // 路由
  routes?: PluginRoute[];

  // 菜单
  menuItems?: PluginMenuItem[];
}
```

---

## 十二、Monaco Editor 集成方案

### 12.1 按需加载策略

```typescript
import Editor, { DiffEditor } from '@monaco-editor/react';
import type { OnMount } from '@monaco-editor/react';
```

- 使用 `@monaco-editor/react` 封装，利用其 loader 自动加载 worker
- 仅在需要编辑器的页面（Text, Config, Scripts）才加载
- 通过 React.lazy + Suspense 实现代码分割

### 12.2 支持的语言

```
json, xml, yaml, sql, ini, properties, 
nginx, dockerfile, shell, powershell, python,
javascript, typescript, markdown, csv
```

---

## 十三、项目配置文件

### 13.1 关键依赖清单

```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x",
    "antd": "^5.x",
    "@ant-design/icons": "^5.x",
    "@monaco-editor/react": "^4.x",
    "zustand": "^4.x",
    "better-sqlite3": "^9.x",
    "js-yaml": "^4.x",
    "sql-formatter": "^15.x",
    "diff": "^5.x",
    "papaparse": "^5.x",
    "xlsx": "^0.18.x",
    "crypto-js": "^4.x",
    "uuid": "^9.x",
    "nanoid": "^5.x",
    "jwt-decode": "^4.x",
    "qrcode": "^1.x",
    "sharp": "^0.33.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  },
  "devDependencies": {
    "electron": "^28.x",
    "electron-vite": "^2.x",
    "electron-builder": "^24.x",
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x",
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x",
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "eslint": "^8.x",
    "prettier": "^3.x"
  }
}
```

### 13.2 electron-vite 配置结构

```typescript
// vite.config.ts (electron-vite)
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src',
        '@shared': '/shared',
      },
    },
  },
});
```

---

## 十四、开发路线图 (Roadmap)

### Phase 0: 项目初始化 (Day 1)
- [ ] 初始化 electron-vite 项目
- [ ] 配置 TypeScript
- [ ] 配置 TailwindCSS + PostCSS
- [ ] 集成 Ant Design 5
- [ ] 配置 ESLint + Prettier
- [ ] 配置 electron-builder
- [ ] 建立目录结构
- [ ] 实现基础 AppLayout (Sidebar + Toolbar + Content)
- [ ] 实现路由框架
- [ ] 实现主题切换 (Light/Dark)
- [ ] 验证 Electron 启动成功

### Phase 1: 共享基础设施 (Day 2-3)
- [ ] 实现 Preload + IPC bridge
- [ ] 实现 SQLite 数据库初始化
- [ ] 实现 Monaco Editor 封装
- [ ] 实现共享组件库 (ToolCard, ResultPanel, SplitPanel, etc.)
- [ ] 实现 Clipboard 工具
- [ ] 实现 Zustand stores (app, editor)
- [ ] 实现 ErrorBoundary

### Phase 2: 模块开发 (Day 4-12)

**模块1: 文本处理** (Day 4-5)
- JSON/XML/YAML/SQL/INI/Properties 格式化与校验
- 文本 Diff
- 格式互转

**模块2: 编码工具** (Day 5-6)
- Base64/URL/Unicode/HTML/Hex 编解码
- MD5/SHA1/SHA256/SHA512/HMAC
- UUID/NanoID 生成
- JWT 解析

**模块3: Linux辅助** (Day 6-7)
- 命令数据整理
- 分类/搜索/收藏/复制

**模块4: 配置文件工具** (Day 7-8)
- 多格式语法高亮
- 格式化/校验/Diff

**模块5: Docker/K8S** (Day 8)
- Compose 校验/格式化
- YAML 校验/格式化

**模块6: Redis工具** (Day 8-9)
- TTL 转换/命令速查/数据结构说明

**模块7: 图片工具** (Day 9-10)
- 压缩/Base64/SVG/ICO/二维码

**模块8: Excel工具** (Day 10-11)
- CSV↔Excel/JSON/SQL/Markdown/HTML
- Sheet/列对比

**模块9: 脚本中心** (Day 11-12)
- 完整 CRUD
- 分类/标签/搜索/收藏
- 导入导出

### Phase 3: 集成与测试 (Day 13-14)
- [ ] 模块间集成测试
- [ ] 主题一致性审查
- [ ] 错误处理审查
- [ ] 性能优化
- [ ] 打包测试 (electron-builder)

### Phase 4: 后续迭代 (MVP 之后)
- [ ] 自动更新
- [ ] OCR 功能集成
- [ ] 插件系统 (v2)
- [ ] 多语言支持 (i18n)
- [ ] 更多模块
- [ ] 单元测试覆盖 > 80%

---

## 十五、质量保障

### 15.1 编码规范

- TypeScript strict mode
- ESLint + Prettier 自动格式化
- 组件文件使用 PascalCase
- 工具文件使用 camelCase
- 样式使用 TailwindCSS + CSS Modules (特殊情况)

### 15.2 组件规范

- 每个组件一个文件
- 复杂组件附带 `index.ts` 导出
- 必须有 ErrorBoundary 包裹
- 异步操作必须有 Loading 状态
- 空数据必须有 EmptyState

### 15.3 代码审查清单

- [ ] 是否有错误处理?
- [ ] 是否有 Loading/Empty/Error 状态?
- [ ] 是否遵循模块独立原则?
- [ ] IPC 是否经过类型校验?
- [ ] 样式是否深浅色模式兼容?
- [ ] 大型列表是否有虚拟化?
- [ ] Monaco Editor 是否按需加载?

---

## 十六、构建与部署

### 16.1 构建脚本

```json
{
  "scripts": {
    "dev": "electron-vite dev",
    "build": "electron-vite build",
    "preview": "electron-vite preview",
    "package": "electron-vite build && electron-builder --win",
    "package:portable": "electron-vite build && electron-builder --win portable",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write ."
  }
}
```

### 16.2 electron-builder 配置

```yaml
appId: com.edt.desktop
productName: Enterprise Deployment Toolkit
directories:
  output: dist
win:
  target:
    - target: nsis
      arch: [x64]
    - target: portable
      arch: [x64]
  icon: resources/icon.ico
nsis:
  oneClick: false
  allowToChangeInstallationDirectory: true
  createDesktopShortcut: true
portable:
  artifactName: EDT-${version}-portable.${ext}
extraResources:
  - from: resources/
    to: resources/
```

---

*本文档为 EDT 项目的完整架构设计方案，若需调整或确认，请提出修改意见。确认后进入 Phase 0 开发阶段。*
