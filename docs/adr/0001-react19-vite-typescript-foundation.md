# 0001 - React 19 + Vite + TypeScript 单页应用基础

## Status

Accepted

## Context

项目作为 React 19 技术栈验证与演示项目，需要选择基础构建工具链。

约束：

- 使用 React 19（用户指定）；
- 需要类型安全（TypeScript）；
- 需要快速的开发体验与生态兼容性。

## Decision

使用 Vite 8 + TypeScript 5.9 + React 19，构建纯前端 SPA。

- 入口：`index.html` + `src/main.tsx`；
- 构建：`tsc -b && vite build`；
- 类型检查、Lint、测试、文档生成均围绕该工具链建立（见 docs/QUALITY-GATES.md）。

## Alternatives

- Next.js / Remix：面向 SSR / 路由框架，超出当前纯前端演示需求。
- CRA：已停止维护。

## Consequences

- 无 SSR，无服务端运行环境；
- 依赖安装必须使用 `--legacy-peer-deps`（见 docs/ARCHITECTURE.md 已知工程约束）；
- `@vitejs/plugin-react@4.x` 在 Vite 8 下存在上游弃用警告，不影响构建与运行。
