# Changelog

只记录用户可感知的重要变化（Features、Important Bug Fixes、Breaking Changes、API Behavior Changes、Security Fixes）。

代码历史由 Git + Pull Request 保存。

---

## [Unreleased]

### Added

- 应用外壳 DefaultLayout（header + main），替换原演示首页。
- H5 / PC 模式切换：`html[data-pch5]` 驱动 rem 缩放（×0.8）与 `#root` 宽度切换（40vw / 100vw）。
- 深色 / 浅色主题切换：`html[data-theme="dark"]` 覆盖设计令牌。
- `@theme` 设计令牌体系（app / sidebar / surface / muted / hover / primary-text / secondary-text / tertiary-text / success / warning / danger / primary / primarytext / border）。
- 页面背景图案资源（circuit-board.svg）。

## [0.1.0] - 2026-08-17

### Added

- 基于 React 19 + Vite 8 + TypeScript 5.9 的前端脚手架。
- 技术栈演示页面（TanStack Router / Query / Table v9 / Virtual、Zustand、Axios、Zod、react-hook-form、Recharts、motion、Tailwind CSS v4）。
- 测试（Vitest + Testing Library）、Storybook、ESLint、Prettier、Husky / commitlint / lint-staged 工具链。
- AI 治理体系：AGENTS.md、docs/（CONSTITUTION / QUALITY-GATES / ARCHITECTURE / PROJECT-MANUAL / ADR）、自动生成技术索引（docs:generate）。
