# 0003 - TanStack Router 代码式路由

## Status

Accepted

## Context

项目需要路由能力，且已选定 TanStack 生态。

## Decision

使用 TanStack Router，以代码方式声明路由树：

- `src/router.tsx`：`createRootRoute`（全局布局）+ `createRoute`（`/` → App）+ `createRouter`；
- `src/main.tsx` 通过 `RouterProvider` 挂载；
- 路由注册信息由 docs:generate 自动扫描生成 docs/generated/ROUTES.md。

## Alternatives

- React Router：功能等价，但与 TanStack 生态重复。
- Next.js 文件式路由：需要框架级改造。

## Consequences

- 路由集中在 `src/router.tsx` 维护；
- 新增路由后需运行 `npm run docs:generate` 刷新 ROUTES.md。
