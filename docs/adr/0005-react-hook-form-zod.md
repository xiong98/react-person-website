# 0005 - react-hook-form + zod 表单方案

## Status

Accepted

## Context

演示项目需要表单输入与校验能力。

## Decision

使用 react-hook-form 管理表单状态，zod 定义校验规则：

- `src/components/DemoForm.tsx`：`useForm` + 自定义 `zodResolver`（zod `safeParse` 将校验结果映射为字段错误）；
- 校验规则：`name` 至少 2 个字符，`email` 必须为合法邮箱；
- 错误信息按字段显示。

## Alternatives

- 引入 `@hookform/resolvers`：是常用做法，但不在用户指定的依赖清单内，故以自定义 resolver 替代。
- 原生受控表单：代码量随字段增加明显膨胀。

## Consequences

- 表单校验规则与业务字段定义在 zod schema 中；
- 字段级错误 UI 位于组件内，新增字段时同步扩展 schema 与 JSX。
