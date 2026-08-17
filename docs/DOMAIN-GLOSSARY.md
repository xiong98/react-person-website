# Domain Glossary

本项目的业务领域词汇表。

当前项目是技术栈演示项目，业务领域极简；随真实业务引入后持续补充。

---

| 术语           | 英文            | 含义                                                                       | 出处                         |
| -------------- | --------------- | -------------------------------------------------------------------------- | ---------------------------- |
| Todo           | Todo            | 待办事项；本项目作为演示数据源，来自 JSONPlaceholder 公开 Mock API         | src/lib/api.ts               |
| 表单校验       | Form Validation | 提交前对字段进行校验；本项目使用 react-hook-form + zod，错误信息按字段显示 | src/components/DemoForm.tsx  |
| 虚拟列表       | Virtual List    | 只渲染可视区域行的长列表渲染技术                                           | src/components/DataTable.tsx |
| 全局客户端状态 | Client State    | 不需要服务端同步的 UI 状态（本项目的计数器）                               | src/store/useCounterStore.ts |
| 服务端状态     | Server State    | 需要异步获取并缓存的远程数据                                               | src/hooks/useTodos.ts        |
| Query Key      | Query Key       | TanStack Query 缓存标识；本项目为 `['todos']`                              | src/hooks/useTodos.ts        |
