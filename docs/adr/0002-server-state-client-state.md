# 0002 - 状态管理拆分：TanStack Query（服务端）+ Zustand（客户端）

## Status

Accepted

## Context

演示项目需要同时处理：异步远程数据（todos）与纯客户端 UI 状态（计数器）。

常见误区是把两类状态混在一个方案里。

## Decision

双层状态模型：

- 服务端状态（Server State）：TanStack Query。
  - `src/hooks/useTodos.ts` 封装 `useQuery`；
  - 缓存键 `['todos']`，staleTime 60s，retry 1；
  - 全局 QueryClient 在 `src/main.tsx` 创建。
- 客户端状态（Client State）：Zustand。
  - `src/store/useCounterStore.ts`。

## Alternatives

- 全部使用 Zustand：需要手工管理缓存、去重、失效，重复实现 Query 能力。
- 全部使用 Redux / Context：样板代码多，无服务端缓存能力。

## Consequences

- 远程数据与本地状态的边界清晰；
- 新增全局状态时，若来自服务端应走 Query，否则走 Zustand；
- `src/store/` 与 `src/lib/api.ts` 属于共享模块（L2 风险）。
