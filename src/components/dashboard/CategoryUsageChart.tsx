'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { CategoryStat } from '@/hooks/useDashboardData'

interface CategoryUsageChartProps {
  data: CategoryStat[]
}

export function CategoryUsageChart({ data }: CategoryUsageChartProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
        <h3 className="text-sm font-semibold text-apple-black dark:text-white mb-4">Usage by Category</h3>
        <div className="h-64 flex items-center justify-center text-apple-gray-400 text-sm">
          No usage data yet. Create and use prompts to see category breakdown.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
      <h3 className="text-sm font-semibold text-apple-black dark:text-white mb-4">Usage by Category</h3>
      <div className="h-72">
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
            />
            <Legend
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value: string) => (
                <span style={{ color: '#86868b' }}>{value}</span>
              )}
            />
            <Bar dataKey="standardUses" name="Standard prompts" fill="#0071e3" radius={[4, 4, 0, 0]} stackId="usage" />
            <Bar dataKey="nonStandardUses" name="Non-standard prompts" fill="#86868b" radius={[4, 4, 0, 0]} stackId="usage" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
