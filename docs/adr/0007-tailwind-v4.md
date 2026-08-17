# 0007 - Tailwind CSS v4 样式方案

## Status

Accepted

## Context

项目需要样式方案，页面包含多个演示区块，要求快速、低样板。

## Decision

使用 Tailwind CSS v4：

- 通过 `@tailwindcss/vite` 集成（`vite.config.ts`）；
- `src/index.css` 以 `@import 'tailwindcss'` 引入；
- 组件内使用 utility class（深色主题演示样式）。

## Alternatives

- CSS Modules：需要维护大量独立样式文件。
- 组件库（shadcn/ui 初始化）：依赖 UI 体系，当前演示阶段非必需；`shadcn` CLI 已安装，可后续初始化。

## Consequences

- 样式以 Tailwind utility 为主；
- 主题色集中在各组件类名中，暂无全局 theme 变量；
- Tailwind 配置通过 CSS-first 方式（v4）管理。
