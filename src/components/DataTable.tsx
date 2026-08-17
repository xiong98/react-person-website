import { useRef } from 'react'
import {
  columnSizingFeature,
  createColumnHelper,
  tableFeatures,
  useTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Todo } from '@/lib/api'

const features = tableFeatures({ columnSizingFeature })
const helper = createColumnHelper<typeof features, Todo>()

const columns = helper.columns([
  helper.accessor('id', {
    header: 'ID',
    size: 70,
  }),
  helper.accessor('title', {
    header: '标题',
    size: 380,
  }),
  helper.accessor('completed', {
    header: '状态',
    size: 90,
    cell: (info) => (info.getValue() ? '✅ 完成' : '⬜ 待办'),
  }),
])

const gridTemplate = (sizes: number[]) => sizes.map((size) => `${size}px`).join(' ')

export function DataTable({ data }: { data: Todo[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const table = useTable({ features, columns, data })
  const rows = table.getRowModel().rows

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 36,
    getItemKey: (index) => rows[index].id,
    overscan: 8,
  })

  const template = gridTemplate(
    table
      .getHeaderGroups()[0]
      .headers.map((header) => header.getSize()),
  )

  return (
    <div>
      <h3 className="mb-2 font-semibold text-cyan-300">
        @tanstack/react-table + @tanstack/react-virtual（虚拟列表）
      </h3>
      <div ref={scrollRef} className="h-64 overflow-auto rounded border border-slate-700">
        <div
          className="grid border-b border-slate-700 bg-slate-900 text-sm text-slate-400"
          style={{ gridTemplateColumns: template, position: 'sticky', top: 0, zIndex: 1 }}
        >
          {table.getHeaderGroups()[0].headers.map((header) => (
            <div key={header.id} className="px-3 py-2">
              {header.isPlaceholder ? null : <table.FlexRender header={header} />}
            </div>
          ))}
        </div>
        <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
          {virtualizer.getVirtualItems().map((item) => {
            const row = rows[item.index]
            return (
              <div
                key={row.id}
                data-index={item.index}
                ref={virtualizer.measureElement}
                className="absolute left-0 top-0 grid w-full border-b border-slate-800 text-sm"
                style={{ gridTemplateColumns: template, transform: `translateY(${item.start}px)` }}
              >
                {row.getAllCells().map((cell) => (
                  <div key={cell.id} className="px-3 py-2" style={{ width: cell.column.getSize() }}>
                    <table.FlexRender cell={cell} />
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
