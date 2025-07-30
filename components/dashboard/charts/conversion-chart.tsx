'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint, COLORS } from '@/lib/data';

interface ConversionChartProps {
  data: ChartDataPoint[];
}

export function ConversionChart({ data }: ConversionChartProps) {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-800/30 border-0 shadow-sm ring-1 ring-gray-200/50 dark:ring-gray-700/50">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/3 to-amber-600/3" />
      
      <CardHeader className="relative">
        <CardTitle className="text-lg font-semibold text-foreground">
          Conversions by Device
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Device-based conversion performance
        </p>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                }}
                formatter={(value: number) => [value.toLocaleString(), 'Conversions']}
              />
              <Bar 
                dataKey="value" 
                fill={COLORS.accent}
                radius={[4, 4, 4, 4]}
                strokeWidth={0}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}