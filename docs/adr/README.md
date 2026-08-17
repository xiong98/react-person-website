# Architecture Decision Records

本目录记录本项目的 Architecture Decision Records（ADR）。

ADR 回答："为什么当时这么设计？"

## 阅读规则

- 修改架构前必须先阅读相关 ADR；
- 不要擅自改变已有 ADR 记录的决策；
- 如果决策需要改变：新增 ADR，或在新 ADR 中标记旧 ADR 为 Superseded。

## 索引

| ADR  | 标题                                                      | 状态     |
| ---- | --------------------------------------------------------- | -------- |
| 0001 | React 19 + Vite + TypeScript 单页应用基础                 | Accepted |
| 0002 | 状态管理拆分：TanStack Query（服务端）+ Zustand（客户端） | Accepted |
| 0003 | TanStack Router 代码式路由                                | Accepted |
| 0004 | Axios 统一实例封装数据请求                                | Accepted |
| 0005 | react-hook-form + zod 表单方案                            | Accepted |
| 0006 | TanStack Table v9 + TanStack Virtual 表格方案             | Accepted |
| 0007 | Tailwind CSS v4 样式方案                                  | Accepted |

## 格式

每份 ADR 遵循：

```text
# Decision

## Status

Accepted / Deprecated / Superseded

## Context

## Decision

## Alternatives

## Consequences
```
