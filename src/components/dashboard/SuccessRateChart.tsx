'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SuccessRateChartProps {
  data: { category: string; successRate: number; feedbackCount: number }[]
}

export function SuccessRateChart({ data }: SuccessRateChartProps) {
  const hasData = data.some(d => d.feedbackCount > 0)

  if (!hasData) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
        <h3 className="text-sm font-semibold text-apple-black dark:text-white mb-4">Success Rate by Category</h3>
        <div className="h-64 flex items-center justify-center text-apple-gray-400 text-sm">
          No feedback data yet. Copy prompts and rate them to see success rates.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl border border-apple-gray-200 dark:border-dark-border p-6">
      <h3 className="text-sm font-semibold text-apple-black dark:text-white mb-4">Success Rate by Category</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.filter(d => d.feedbackCount > 0)} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#424245" opacity={0.2} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: '#86868b' }}
              axisLine={{ stroke: '#424245', opacity: 0.3 }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#86868b' }}
              axisLine={{ stroke: '#424245', opacity: 0.3 }}
              tickFormatter={(v) => `${v}%`}
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
              formatter={(value: any, _name: any, props: any) => [
                `${value}% (${props?.payload?.feedbackCount ?? 0} votes)`,
                'Success Rate',
              ]}
            />
            <Bar dataKey="successRate" fill="#34c759" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
