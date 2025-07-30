'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ChartDataPoint, COLORS } from '@/lib/data';
import { EmptyState } from '@/components/dashboard/empty-state';

interface RevenueChartProps {
  data: ChartDataPoint[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const hasData = data && data.length > 0;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-800/30 border-0 shadow-sm ring-1 ring-gray-200/50 dark:ring-gray-700/50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/3 to-purple-600/3" />
      
      <CardHeader className="relative">
        <CardTitle className="text-lg font-semibold text-foreground">
          Revenue Trends
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Monthly revenue performance over the year
        </p>
      </CardHeader>
      
      <CardContent className="relative">
        {hasData ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  strokeLinecap="round"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState 
            title="No revenue data"
            message="No revenue data available for the selected date range."
            icon="trend"
            className="h-80"
          />
        )}
      </CardContent>
    </Card>
  );
}