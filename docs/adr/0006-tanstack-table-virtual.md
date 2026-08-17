# 0006 - TanStack Table v9 + TanStack Virtual 表格方案

## Status

Accepted

## Context

演示项目需要渲染大量行数据（todos，最多 200 行）并要求性能演示。

## Decision

使用 TanStack Table v9 + TanStack Virtual：

- `src/components/DataTable.tsx`；
- 使用 v9 新 API：`useTable` + `tableFeatures` + `createColumnHelper` + `table.FlexRender`；
- 注册 `columnSizingFeature` 以支持列宽；
- 通过 `useVirtualizer` 只渲染可视区域行（固定 3 列：ID / 标题 / 状态）。

## Alternatives

- v8 `useReactTable` API：与锁定版本 `@tanstack/react-table@^9` 不兼容（v9 移除）。
- 第三方组件库表格（如 antd Table）：破坏"无 UI"的 headless 设计。

## Consequences

- 表格渲染完全自定义（Grid 布局 + 虚拟行）；
- 列宽以列定义 `size` 为准，栅格模板由表头计算；
- 涉及虚拟化与表格组合逻辑，改动需完整验证（L1/L2）。
