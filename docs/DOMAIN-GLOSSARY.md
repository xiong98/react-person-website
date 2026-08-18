# Domain Glossary

本项目的业务领域词汇表。

当前项目是应用壳 + 技术栈演示项目，业务领域极简；随真实业务引入后持续补充。

---

| 术语            | 英文               | 含义                                                                                                       | 出处                                            |
| --------------- | ------------------ | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| H5 模式         | H5 Mode            | 移动端适配显示模式；以 `<html>` 上的 `data-pch5` 属性驱动 rem 缩放与 `#root` 宽度切换                      | src/components/DefaultLayout.tsx、src/index.css |
| 深色 / 浅色主题 | Dark / Light Theme | 通过 `<html>` 的 `data-theme="dark"` 属性覆盖 `@theme` 设计令牌的颜色体系                                  | src/index.css                                   |
| 设计令牌        | Design Tokens      | `@theme` 中定义的 `--color-*` 语义色变量（app / surface / primary-text 等），生成 `bg-*` / `text-*` 工具类 | src/index.css                                   |
| rem 缩放        | Rem Scaling        | `html { font-size: calc(100px * sqrt(100vw / 750px)) }`，以 750px 设计稿为基准实现随视口的字号缩放         | src/index.css                                   |
| Todo            | Todo               | 待办事项；遗留演示数据源，来自 JSONPlaceholder 公开 Mock API，当前未被应用引用                             | src/lib/api.ts                                  |
| 虚拟列表        | Virtual List       | 只渲染可视区域行的长列表渲染技术（遗留演示）                                                               | src/components/DataTable.tsx                    |
| 全局客户端状态  | Client State       | 不需要服务端同步的 UI 状态（遗留演示计数器）                                                               | src/store/useCounterStore.ts                    |
| 服务端状态      | Server State       | 需要异步获取并缓存的远程数据（遗留演示）                                                                   | src/hooks/useTodos.ts                           |
| Query Key       | Query Key          | TanStack Query 缓存标识；遗留演示为 `['todos']`                                                            | src/hooks/useTodos.ts                           |
