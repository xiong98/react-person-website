# Architecture

本文档回答："这个系统是如何组织起来的？"

以当前真实代码为准。若与代码冲突，以代码为准。

---

# 1. 系统组成

纯前端单页应用（SPA），无后端服务、无数据库、无部署配置。

用途：React 19 技术栈验证与演示脚手架（"verify-module"），用于验证以下技术栈的组合使用：

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
              ├── rootRoute（全局布局：深色背景 + Outlet）
              └── indexRoute（path: '/'）→ src/App.tsx
```

## 页面

`src/App.tsx` 是当前唯一页面，以多个 `<section>` 集成演示区块：

- Zustand 计数器 + @uidotdev/usehooks localStorage
- TanStack Query + Axios 拉取 todos → 虚拟化表格
- Recharts 柱状图
- react-hook-form + zod 表单
- motion 动画按钮

## 目录边界

| 目录            | 职责             | 示例                                       |
| --------------- | ---------------- | ------------------------------------------ |
| src/components/ | 展示型组件       | DataTable、DemoChart、DemoForm、DemoMotion |
| src/hooks/      | 数据 / 状态 Hook | useTodos（封装 useQuery）                  |
| src/store/      | 全局客户端状态   | useCounterStore（Zustand）                 |
| src/lib/        | 基础设施         | api.ts（axios 实例 + API 函数）            |
| src/test/       | 测试环境设置     | setup.ts（jest-dom）                       |
| src/router.tsx  | 路由树声明       | createRootRoute / createRoute              |
| src/main.tsx    | 应用入口         | React Query + Router 装配                  |
| src/App.tsx     | 唯一页面         | 组合各演示组件                             |

---

# 3. 状态管理

双层状态模型：

- **Server State（服务端数据）**：TanStack Query。`src/hooks/useTodos.ts` 封装 `useQuery`，缓存键 `['todos']`，staleTime 60s，retry 1。
- **Client State（客户端状态）**：Zustand。`src/store/useCounterStore.ts`。

---

# 4. 数据层

`src/lib/api.ts`：

- 统一的 axios 实例 `api`；
- baseURL 来自 `import.meta.env.VITE_API_BASE_URL`，默认 `https://jsonplaceholder.typicode.com`（第三方公开 Mock API）；
- timeout 10s；
- `fetchTodos()` 获取 todos，返回 `Todo[]`。

无本地数据库、无后端、无 ORM / Migration。

---

# 5. 路由

TanStack Router 代码式路由，见 docs/generated/ROUTES.md。

当前仅一个路由：`/` → App。

---

# 6. 外部服务

仅依赖 JSONPlaceholder（公开 Mock API）。

真实后端接入计划：当前无，`src/lib/api.ts` 是未来接入的边界。

---

# 7. 模块边界与数据流

核心数据流：

```
App.tsx
  └── useTodos()                      // TanStack Query
        └── fetchTodos()              // src/lib/api.ts（axios）
              └── GET https://jsonplaceholder.typicode.com/todos
  └── DataTable                       // TanStack Table v9 + Virtual
  └── DemoForm                        // react-hook-form + zod（本地状态）
  └── useCounterStore                 // Zustand（全局客户端状态）
```

---

# 8. 构建与工具链

- Vite 8：`vite.config.ts`（react、tailwindcss、auto-import、checker[typescript]）。
- TypeScript：三段式 tsconfig（root / app / node）。
- 路径别名：`@/` → `src/`。
- ESLint 9 flat config + typescript-eslint + react plugins。
- Prettier。
- Vitest + Testing Library + jsdom。
- Storybook 10 + @storybook/react-vite。
- Husky + lint-staged + commitlint（提交前门禁）。

---

# 9. 已知工程约束

- 依赖安装必须使用 `npm install --legacy-peer-deps`：`@vitejs/plugin-react@4.x` 的 peer 范围最高支持 Vite 7，与锁定版本 `vite@8` 冲突（构建与运行正常，存在上游弃用警告）。
- `vite-plugin-checker` 的 ESLint 检查器与 ESLint 9 flat config 不兼容，当前仅启用 typescript 检查；ESLint 通过 `npm run lint` 单独运行。
