import { useTodos } from '@/hooks/useTodos'
import { useCounterStore } from '@/store/useCounterStore'
import { useLocalStorage } from '@uidotdev/usehooks'
import { DataTable } from '@/components/DataTable'
import { DemoChart } from '@/components/DemoChart'
import { DemoForm } from '@/components/DemoForm'
import { DemoMotion } from '@/components/DemoMotion'

export default function App() {
  const { data, isLoading, isError, error } = useTodos()
  const { count, increment, decrement, reset } = useCounterStore()
  const [savedName, setName] = useLocalStorage<string>('demo-name', '')

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-10">
      <header>
        <h1 className="text-2xl font-bold">React 19 项目脚手架</h1>
        <p className="text-sm text-slate-400">
          TanStack Router + React Query + Zustand + Axios + Zod + react-hook-form + TanStack
          Table/Virtual + Recharts + Motion + Tailwind
        </p>
      </header>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="mb-2 font-semibold text-cyan-300">zustand + @uidotdev/usehooks</h3>
        <div className="flex items-center gap-3">
          <button className="rounded bg-slate-700 px-3 py-1" onClick={decrement}>
            -
          </button>
          <span className="text-xl tabular-nums">{count}</span>
          <button className="rounded bg-slate-700 px-3 py-1" onClick={increment}>
            +
          </button>
          <button className="rounded bg-slate-700 px-3 py-1" onClick={reset}>
            重置
          </button>
          <input
            className="ml-4 rounded border border-slate-600 bg-slate-800 px-2 py-1 text-sm"
            placeholder="localStorage 测试"
            value={savedName}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="mb-2 font-semibold text-cyan-300">axios + @tanstack/react-query</h3>
        {isLoading && <p className="text-sm text-slate-400">加载中…</p>}
        {isError && <p className="text-sm text-rose-400">加载失败：{String(error)}</p>}
        {data && <DataTable data={data} />}
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <DemoChart />
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <DemoForm />
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <DemoMotion />
      </section>
    </main>
  )
}
