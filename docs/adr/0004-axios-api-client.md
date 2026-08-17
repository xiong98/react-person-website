# 0004 - Axios 统一实例封装数据请求

## Status

Accepted

## Context

项目需要发起 HTTP 请求，未来可能接入真实后端。

## Decision

在 `src/lib/api.ts` 中创建统一 axios 实例 `api`：

- baseURL 支持 `VITE_API_BASE_URL` 环境变量覆盖，默认指向 JSONPlaceholder 公开 Mock API；
- timeout 10s；
- 所有接口以类型安全的函数导出（如 `fetchTodos(): Promise<Todo[]>`），业务层不直接拼 URL。

## Alternatives

- fetch 原生封装：缺少拦截器、超时等开箱能力。
- 在每个组件内直接请求：无法统一错误处理与配置。

## Consequences

- `src/lib/api.ts` 是未来接入真实后端的唯一边界（L2 风险）；
- 新增接口时在 api.ts 中追加类型安全函数。
