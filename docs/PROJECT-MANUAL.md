# Project Manual

面向第一次进入项目的人类开发者。

回答："我要维护这个项目，需要知道什么？"

---

# 1. 项目是什么

`verify-module`：基于 React 19 的前端技术栈验证与演示项目（SPA）。

用于验证以下技术栈在同一项目中的集成：TanStack Router / Query / Table v9 / Virtual、Zustand、Axios、Zod、react-hook-form、Recharts、motion、Tailwind CSS v4，以及构建 / 测试 / 文档工具链。

当前无业务后端，数据来自 JSONPlaceholder 公开 Mock API。

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

| 模块       | 位置                         | 说明                                       |
| ---------- | ---------------------------- | ------------------------------------------ |
| 应用入口   | src/main.tsx                 | React Query + Router 装配                  |
| 路由声明   | src/router.tsx               | 唯一路由 `/`                               |
| 唯一页面   | src/App.tsx                  | 组合各演示区块                             |
| API 客户端 | src/lib/api.ts               | axios 实例 + fetchTodos + Todo 类型        |
| 数据 Hook  | src/hooks/useTodos.ts        | useQuery 封装                              |
| 全局状态   | src/store/useCounterStore.ts | Zustand 计数器                             |
| 演示组件   | src/components/              | DataTable、DemoChart、DemoForm、DemoMotion |

---

# 7. 核心业务规则

当前无真实业务规则，仅有演示语义：

- 表单校验：`name` 至少 2 个字符；`email` 必须为合法邮箱（Zod 校验，错误信息分别显示在对应字段下方）。
- 表格：todos 以虚拟列表渲染（固定 3 列：ID / 标题 / 状态）。
- 数据获取：`['todos']` 查询键，staleTime 60s、retry 1 次。

---

# 8. 环境变量

| 变量              | 说明          | 默认值                               |
| ----------------- | ------------- | ------------------------------------ |
| VITE_API_BASE_URL | axios baseURL | https://jsonplaceholder.typicode.com |

在项目根目录创建 `.env` 或 `.env.local` 后配置。

---

# 9. 常见开发路径

- 新增页面：在 `src/router.tsx` 注册路由（createRoute），必要时在 `src/App.tsx` 导航；随后运行 `npm run docs:generate`。
- 新增组件：放入 `src/components/`，遵循现有命名（PascalCase、导出具名函数）。
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
