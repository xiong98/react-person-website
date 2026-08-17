import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { month: '1月', 访问: 400, 转化: 120 },
  { month: '2月', 访问: 550, 转化: 180 },
  { month: '3月', 访问: 320, 转化: 90 },
  { month: '4月', 访问: 620, 转化: 210 },
  { month: '5月', 访问: 780, 转化: 260 },
  { month: '6月', 访问: 900, 转化: 310 },
]

export function DemoChart() {
  return (
    <div>
      <h3 className="mb-2 font-semibold text-cyan-300">recharts</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155' }} />
          <Legend />
          <Bar dataKey="访问" fill="#22d3ee" />
          <Bar dataKey="转化" fill="#a78bfa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
