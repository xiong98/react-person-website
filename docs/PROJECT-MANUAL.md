# Project Manual

面向第一次进入项目的人类开发者。

回答："我要维护这个项目，需要知道什么？"

---

# 1. 项目是什么

`verify-module`：基于 React 19 的前端应用壳（SPA）。

当前应用包含：

- 默认布局（header + main，`DefaultLayout`）；
- **H5 / PC 模式切换**（`html[data-pch5]` 驱动 rem 缩放与布局宽度）；
- **深色 / 浅色主题切换**（`html[data-theme="dark"]` 覆盖设计令牌）；
- 一套 `@theme` 设计令牌（app / surface / primary-text / primary 等）。

构建 / 测试 / 文档工具链：Vite 8、Vitest、Storybook、ESLint、Prettier、Husky / commitlint / lint-staged。

遗留的演示模块（DataTable、DemoChart、DemoForm、DemoMotion、useTodos、useCounterStore）目前未被应用引用，仅由测试 / Storybook 引用。

---

# 2. 环境要求

- Node.js ≥ 20.11（`import.meta.dirname` 需要；推荐 22 LTS 或更高）
- npm

---

# 3. 安装

```bash
npm install --legacy-peer-deps
```

注意：必须携带 `--legacy-peer-deps`。原因见 docs/ARCHITECTURE.md 已知工程约束。

---

# 4. 运行

```bash
npm run dev          # 开发服务器（Vite）
npm run build        # 生产构建（tsc -b && vite build）
npm run preview      # 预览生产构建
npm run storybook    # Storybook 开发服务器（端口 6006）
```

---

# 5. 常用命令

| 命令                    | 说明                                                |
| ----------------------- | --------------------------------------------------- |
| npm run lint            | ESLint 检查                                         |
| npm run format          | Prettier 格式化                                     |
| npm run format:check    | Prettier 检查                                       |
| npm run typecheck       | TypeScript 类型检查（tsc -b）                       |
| npm run test / test:run | Vitest（监听 / 单次）                               |
| npm run docs:generate   | 重新生成 docs/generated/                            |
| npm run verify          | 统一验证入口（format + lint + test + build + docs） |
| npm run build-storybook | 构建 Storybook 静态站点                             |

---

# 6. 核心模块

| 模块       | 位置                                    | 说明                                    |
| ---------- | --------------------------------------- | --------------------------------------- |
| 应用入口   | src/main.tsx                            | React Query + Router 装配               |
| 路由声明   | src/router.tsx                          | 唯一路由 `/`                            |
| 唯一页面   | src/App.tsx                             | 渲染 DefaultLayout                      |
| 应用外壳   | src/components/DefaultLayout.tsx        | H5 模式 + 主题切换 + header/main        |
| 布局样式   | src/components/DefaultLayout.module.css | 布局样式，`@variant pch5` 引用全局变体  |
| 全局样式   | src/index.css                           | 设计令牌、深色主题、pch5 变体、rem 缩放 |
| 静态资源   | src/assets/circuit-board.svg            | 页面背景图案                            |
| API 客户端 | src/lib/api.ts                          | axios 实例 + fetchTodos（当前未引用）   |
| 数据 Hook  | src/hooks/useTodos.ts                   | useQuery 封装（当前未引用）             |
| 全局状态   | src/store/useCounterStore.ts            | Zustand 计数器（当前未引用）            |
| 遗留演示   | src/components/ 下 Demo*/DataTable      | 未被应用引用，仅测试/Storybook 使用     |

---

# 7. 核心业务规则

- **H5 模式**：点击 header 的"h5模式"按钮切换 `html[data-pch5]` 属性；`pch5` 变体下 `html` 字号 ×0.8（1024px 以下还原）、`#root` 宽度 40vw（上限 1024px）。
- **深色主题**：点击主题按钮切换 `html[data-theme="dark"]`；深色令牌在 `[data-theme="dark"]` 内覆盖 `@theme` 默认值。
- **屏幕适配**：`html` 字号 = `calc(100px * sqrt(100vw / 750px))`（750px 设计稿基准，rem 随视口缩放）。
- **表单校验（遗留演示）**：`name` 至少 2 个字符；`email` 合法邮箱（DemoForm，未接入应用）。
- **数据获取（遗留演示）**：`['todos']` 查询键，staleTime 60s、retry 1 次（useTodos，未接入应用）。

---

# 8. 环境变量

| 变量              | 说明          | 默认值                               |
| ----------------- | ------------- | ------------------------------------ |
| VITE_API_BASE_URL | axios baseURL | https://jsonplaceholder.typicode.com |

在项目根目录创建 `.env` 或 `.env.local` 后配置。

---

# 9. 常见开发路径

- 新增页面：在 `src/router.tsx` 注册路由（createRoute），页面内容经 `<Outlet />` 渲染进 DefaultLayout；随后运行 `npm run docs:generate`。
- 新增组件：放入 `src/components/`，遵循现有命名（PascalCase、导出具名函数）。
- 新增"模式状态"（如新的显示模式）：挂在 `<html>` 上时**使用 data-\* 属性**（如 `data-pch5`），并配套 `@custom-variant`，避免 CSS Modules 哈希类名导致失配。
- 新增主题令牌：在 `src/index.css` 的 `@theme` 增加 `--color-*`，深色值在 `[data-theme="dark"]` 中覆盖。
- 新增 API：在 `src/lib/api.ts` 中基于 `api` 实例添加函数，并通过 Hook 消费。
- 新增全局状态：在 `src/store/` 中新建 Zustand store。
- 新增测试：与组件同目录的 `*.test.tsx`，使用 Vitest + Testing Library。

---

# 10. 文档入口

- 治理入口：AGENTS.md
- 长期原则：docs/CONSTITUTION.md
- 验证门禁：docs/QUALITY-GATES.md
- 架构：docs/ARCHITECTURE.md
- 术语：docs/DOMAIN-GLOSSARY.md
- 设计决策：docs/adr/
- 自动生成索引：docs/generated/（禁止手工编辑）
