'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartDataPoint, COLORS } from '@/lib/data';
import { EmptyState } from '@/components/dashboard/empty-state';

interface TrafficChartProps {
  data: ChartDataPoint[];
}

export function TrafficChart({ data }: TrafficChartProps) {
  const hasData = data && data.length > 0;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-800/30 border-0 shadow-sm ring-1 ring-gray-200/50 dark:ring-gray-700/50">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-600/3 to-cyan-600/3" />
      
      <CardHeader className="relative">
        <CardTitle className="text-lg font-semibold text-foreground">
          Traffic Sources
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Breakdown of website traffic by source
        </p>
      </CardHeader>
      
      <CardContent className="relative">
        {hasData ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS.chart[index % COLORS.chart.length]}
                      stroke="none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Share']}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{
                    fontSize: '12px',
                    color: '#64748b',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState 
            title="No traffic data"
            message="No traffic source data available for the selected date range."
            icon="chart"
            className="h-80"
          />
        )}
      </CardContent>
    </Card>
  );
}