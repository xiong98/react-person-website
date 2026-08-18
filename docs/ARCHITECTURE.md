# Architecture

本文档回答："这个系统是如何组织起来的？"

以当前真实代码为准。若与代码冲突，以代码为准。

---

# 1. 系统组成

纯前端单页应用（SPA），无后端服务、无数据库、无部署配置。

当前应用壳（"verify-module"）基于 React 19，验证以下技术栈的组合使用：

- React 19 + TypeScript 5.9
- Vite 8 构建（含 Tailwind CSS v4、vite-plugin-checker、unplugin-auto-import）
- TanStack Router、TanStack Query、TanStack Table v9、TanStack Virtual
- Zustand、Axios、Zod、react-hook-form、Recharts、motion、@uidotdev/usehooks

---

# 2. 前端架构

## 入口

`index.html` → `src/main.tsx`

## 启动链

```
src/main.tsx
  ├── QueryClientProvider（TanStack Query 全局实例）
  └── RouterProvider（TanStack Router）
        └── src/router.tsx
              ├── rootRoute（仅 <Outlet />，无包裹层，全局外观由 index.css 提供）
              └── indexRoute（path: '/'）→ src/App.tsx → DefaultLayout
```

## 页面 / 布局

- `src/App.tsx`：唯一页面，渲染 `DefaultLayout`。
- `src/components/DefaultLayout.tsx`：应用外壳（header + main），提供：
  - **H5 模式切换**：切换 `<html>` 的 `data-pch5` 属性，驱动 Tailwind 自定义变体 `pch5`（rem 缩放 ×0.8、`#root` 收窄至 40vw）。
  - **深色 / 浅色主题切换**：切换 `<html>` 的 `data-theme="dark"` 属性，覆盖 `@theme` 设计令牌。

## 目录边界

| 目录            | 职责             | 示例                                   |
| --------------- | ---------------- | -------------------------------------- |
| src/components/ | 组件             | DefaultLayout（应用外壳）              |
| src/hooks/      | 数据 / 状态 Hook | useTodos（封装 useQuery，当前未引用）  |
| src/store/      | 全局客户端状态   | useCounterStore（Zustand，当前未引用） |
| src/lib/        | 基础设施         | api.ts（axios 实例 + API 函数）        |
| src/assets/     | 静态资源         | circuit-board.svg（页面背景图案）      |
| src/test/       | 测试环境设置     | setup.ts（jest-dom）                   |
| src/router.tsx  | 路由树声明       | createRootRoute / createRoute          |
| src/main.tsx    | 应用入口         | React Query + Router 装配              |
| src/App.tsx     | 唯一页面         | 渲染 DefaultLayout                     |

遗留演示组件（DataTable、DemoChart、DemoForm、DemoMotion）与演示状态（useTodos、useCounterStore）目前未被应用引用，仅由测试 / Storybook 引用，属"死代码"待清理。

---

# 3. 样式与主题体系（index.css）

采用 Tailwind CSS v4 + CSS-first 配置：

- **设计令牌**：`@theme` 定义 `--color-app / sidebar / surface / muted / hover / primary-text / secondary-text / tertiary-text / success / warning / danger / primary / primarytext / border`，生成 `bg-*` / `text-*` / `border-*` 工具类。
- **深色主题**：`[data-theme="dark"] { --color-*: ... }` 覆盖同一组变量（无层级 CSS 优先于 `@layer theme` 内的 `:root`），由 `html[data-theme]` 属性驱动。
- **H5 模式**：`@custom-variant pch5 (&:where(html[data-pch5], html[data-pch5] *))`——属性选择器方案，CSS Modules 不哈希属性，module 与全局共用同一变体。
- **屏幕适配**：`html { font-size: calc(100px * sqrt(100vw / 750px)) }` 实现 750px 设计稿的 rem 缩放；`pch5` 状态下整体 ×0.8 且 1024px 以下还原；`#root` 宽度随模式在 40vw 与 100vw（1920px 上限）间切换。
- `--breakpoint-xs: 20rem` 注册额外断点（媒体查询中的 rem 使用浏览器初始字号，与 html 缩放隔离）。

---

# 4. 状态管理

双层状态模型（当前应用壳未实际使用，模块保留）：

- **Server State**：TanStack Query。`src/hooks/useTodos.ts`（`['todos']`，staleTime 60s，retry 1）。
- **Client State**：Zustand。`src/store/useCounterStore.ts`。
- **组件内状态**：DefaultLayout 用 `useState` + `useEffect` 管理 `isH5` / `isDark`，直接写 `<html>` 属性。

---

# 5. 数据层

`src/lib/api.ts`：

- 统一的 axios 实例 `api`（baseURL 来自 `VITE_API_BASE_URL`，默认 JSONPlaceholder，timeout 10s）；
- `fetchTodos()` 返回 `Todo[]`；当前未被应用引用。

无本地数据库、无后端、无 ORM / Migration。

---

# 6. 路由

TanStack Router 代码式路由，见 docs/generated/ROUTES.md。

当前仅一个路由：`/` → App。

---

# 7. 外部服务

仅依赖 JSONPlaceholder（公开 Mock API）。`src/lib/api.ts` 是未来真实后端接入的边界。

---

# 8. 模块边界与数据流

```
main.tsx → RouterProvider → router.tsx → App.tsx → DefaultLayout
                                                    ├── isH5  → html[data-pch5]  → 全局 pch5 变体
                                                    ├── isDark → html[data-theme] → 深色令牌覆盖
                                                    └── <Outlet />（子路由内容）
```

---

# 9. 构建与工具链

- Vite 8：`vite.config.ts`（react、tailwindcss、auto-import、checker[typescript]）。
- TypeScript：三段式 tsconfig（root / app / node）。
- 路径别名：`@/` → `src/`。
- ESLint 9 flat config + typescript-eslint + react plugins。
- Prettier。
- Vitest + Testing Library + jsdom。
- Storybook 10 + @storybook/react-vite。
- Husky + lint-staged + commitlint（提交前门禁）。

---

# 10. 已知工程约束

- 依赖安装必须使用 `npm install --legacy-peer-deps`：`@vitejs/plugin-react@4.x` 的 peer 范围最高支持 Vite 7，与锁定版本 `vite@8` 冲突（构建与运行正常，存在上游弃用警告）。
- `vite-plugin-checker` 的 ESLint 检查器与 ESLint 9 flat config 不兼容，当前仅启用 typescript 检查；ESLint 通过 `npm run lint` 单独运行。
- CSS Modules 会哈希类名：凡是挂在 `<html>` 上的"模式状态"（如 `pch5`）一律用**属性选择器**表达，避免哈希失配（已采用 `data-pch5` / `data-theme`）。
