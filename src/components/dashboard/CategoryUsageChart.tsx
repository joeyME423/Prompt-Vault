'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface CategoryUsageChartProps {
  data: { category: string; totalUses: number; promptCount: number }[]
}

export function CategoryUsageChart({ data }: CategoryUsageChartProps) {
  if (data.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Usage by Category</h3>
        <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
          No usage data yet
        </div>
      </div>
    )
  }

  return (
    <div className="card p-6">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Usage by Category</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={{ stroke: '#334155', opacity: 0.3 }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={{ stroke: '#334155', opacity: 0.3 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f1f5f9',
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${value} uses`, 'Total Uses']}
            />
            <Bar dataKey="totalUses" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
