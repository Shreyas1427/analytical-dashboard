'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: 'revenue' | 'users' | 'conversions' | 'growth';
  className?: string;
}

const icons = {
  revenue: DollarSign,
  users: Users,
  conversions: Target,
  growth: BarChart3,
};

const formatValue = (value: string | number, type: string) => {
  if (typeof value === 'number') {
    switch (type) {
      case 'revenue':
        return `$${(value / 1000).toFixed(0)}K`;
      case 'users':
        return `${(value / 1000).toFixed(1)}K`;
      case 'conversions':
        return value.toLocaleString();
      case 'growth':
        return `${value.toFixed(1)}%`;
      default:
        return value.toString();
    }
  }
  return value;
};

export function MetricCard({ title, value, change, icon, className }: MetricCardProps) {
  const Icon = icons[icon];
  const isPositive = change >= 0;
  const formattedValue = formatValue(value, icon);

  return (
    <Card className={cn(
      'relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group',
      'bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50',
      'border-0 shadow-sm ring-1 ring-gray-200/50 dark:ring-gray-700/50',
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 sm:pb-3">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm lg:text-sm font-medium text-muted-foreground tracking-wide">
            {title}
          </p>
          <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground">
            {formattedValue}
          </p>
        </div>
        <div className={cn(
          'p-1.5 sm:p-3 lg:p-3 rounded-xl transition-colors duration-300',
          'bg-gradient-to-br from-blue-500/10 to-purple-500/10',
          'group-hover:from-blue-500/20 group-hover:to-purple-500/20'
        )}>
          <Icon className="h-3 w-3 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-blue-600 dark:text-blue-400" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center space-x-1">
          <div className={cn(
            'flex items-center space-x-1 text-xs sm:text-sm lg:text-sm font-medium',
            isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          )}>
            {isPositive ? (
              <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-4 lg:w-4" />
            ) : (
              <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 lg:h-4 lg:w-4" />
            )}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
          <span className="text-xs sm:text-sm lg:text-sm text-muted-foreground hidden sm:inline lg:inline">vs last month</span>
          <span className="text-xs text-muted-foreground sm:hidden lg:hidden">vs last</span>
        </div>
      </CardContent>
    </Card>
  );
}