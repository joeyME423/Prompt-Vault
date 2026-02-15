'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface CategoryUsageChartProps {
  data: { category: string; totalUses: number; promptCount: number }[]
}

export function CategoryUsageChart({ data }: CategoryUsageChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
        <h3 className="text-sm font-semibold text-apple-black dark:text-white mb-4">Usage by Category</h3>
        <div className="h-64 flex items-center justify-center text-apple-gray-400 text-sm">
          No usage data yet
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
      <h3 className="text-sm font-semibold text-apple-black dark:text-white mb-4">Usage by Category</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#424245" opacity={0.2} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: '#86868b' }}
              axisLine={{ stroke: '#424245', opacity: 0.3 }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#86868b' }}
              axisLine={{ stroke: '#424245', opacity: 0.3 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1d1d1f',
                border: '1px solid #424245',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f1f5f9',
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any) => [`${value} uses`, 'Total Uses']}
            />
            <Bar dataKey="totalUses" fill="#0071e3" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
