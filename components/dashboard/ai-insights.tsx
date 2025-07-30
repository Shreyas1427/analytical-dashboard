'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Bot, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AIInsightsProps {
  revenueChange: number;
  usersChange: number;
  conversionsChange: number;
}

export function AIInsights({ revenueChange, usersChange, conversionsChange }: AIInsightsProps) {
  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getChangeText = (change: number) => {
    if (change > 0) return `↑${change.toFixed(1)}%`;
    if (change < 0) return `↓${Math.abs(change).toFixed(1)}%`;
    return 'steady';
  };

  const getInsightColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-800/30 border-2 border-blue-200/50 dark:border-blue-800/50 shadow-sm ring-1 ring-blue-200/20 dark:ring-blue-800/20 h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5" />
      
      <CardContent className="relative p-4 sm:p-6 h-full flex flex-col">
        <div className="flex items-start gap-3 sm:gap-4 flex-1">
          <div className="p-1.5 sm:p-3 lg:p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg flex-shrink-0">
            <Bot className="h-4 w-4 sm:h-6 sm:w-6 lg:h-6 lg:w-6 text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-foreground mb-1 sm:mb-2 lg:mb-3">
              AI Insights
            </h3>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
              Real-time performance analysis
            </p>
            
            <div className="mt-2 sm:mt-4 lg:mt-6 space-y-1 sm:space-y-2 lg:space-y-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {getChangeIcon(revenueChange)}
                <span className={cn("text-xs sm:text-sm lg:text-base font-medium", getInsightColor(revenueChange))}>
                  Revenue {getChangeText(revenueChange)}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2">
                {getChangeIcon(usersChange)}
                <span className={cn("text-xs sm:text-sm lg:text-base font-medium", getInsightColor(usersChange))}>
                  Users {getChangeText(usersChange)}
                </span>
              </div>
              
              <div className="flex items-center gap-1.5 sm:gap-2">
                {getChangeIcon(conversionsChange)}
                <span className={cn("text-xs sm:text-sm lg:text-base font-medium", getInsightColor(conversionsChange))}>
                  <span className="sm:hidden">Conv.</span>
                  <span className="hidden sm:inline lg:inline">Conversions</span>
                  {' '}{getChangeText(conversionsChange)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 