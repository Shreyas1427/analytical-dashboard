'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartDataPoint, COLORS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/dashboard/empty-state';

interface UserChartProps {
  data: ChartDataPoint[];
  selectedWeek: string | null;
  onWeekSelect: (week: string | null) => void;
}

export function UserChart({ data, selectedWeek, onWeekSelect }: UserChartProps) {
  const hasData = data && data.length > 0;

  const handleBarClick = (data: any) => {
    const clickedWeek = data.name;
    // Toggle selection - if same week clicked, deselect
    if (selectedWeek === clickedWeek) {
      onWeekSelect(null);
    } else {
      onWeekSelect(clickedWeek);
    }
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-800/30 border-0 shadow-sm ring-1 ring-gray-200/50 dark:ring-gray-700/50">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/3 to-pink-600/3" />
      
      <CardHeader className="relative">
        <CardTitle className="text-lg font-semibold text-foreground">
          Weekly User Activity
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Click on a bar to filter campaigns by week
        </p>
      </CardHeader>
      
      <CardContent className="relative">
        {hasData ? (
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
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                  }}
                  formatter={(value: number) => [value.toLocaleString(), 'Users']}
                />
                <Bar 
                  dataKey="users" 
                  radius={[4, 4, 4, 4]}
                  strokeWidth={0}
                  onClick={handleBarClick}
                  style={{ cursor: 'pointer' }}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={selectedWeek === entry.name ? COLORS.primary : COLORS.secondary}
                      className={cn(
                        "transition-all duration-200",
                        selectedWeek === entry.name ? "opacity-100" : "opacity-80 hover:opacity-100"
                      )}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <EmptyState 
            title="No user data"
            message="No user activity data available for the selected date range."
            icon="chart"
            className="h-80"
          />
        )}
        
        {selectedWeek && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Filtering by: {selectedWeek}
                </span>
              </div>
              <button
                onClick={() => onWeekSelect(null)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 font-medium"
              >
                Clear filter
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}