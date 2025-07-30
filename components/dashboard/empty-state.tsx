'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Search, BarChart3, TrendingUp } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: 'search' | 'chart' | 'trend';
  className?: string;
}

export function EmptyState({ 
  title = "No data available", 
  message = "No data matches the selected date range. Try adjusting your filters or selecting a different time period.",
  icon = 'search',
  className = ""
}: EmptyStateProps) {
  const getIcon = () => {
    switch (icon) {
      case 'chart':
        return <BarChart3 className="h-12 w-12 text-gray-400" />;
      case 'trend':
        return <TrendingUp className="h-12 w-12 text-gray-400" />;
      default:
        return <Search className="h-12 w-12 text-gray-400" />;
    }
  };

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-800/30 border-0 shadow-sm ring-1 ring-gray-200/50 dark:ring-gray-700/50 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-600/2 to-gray-600/2" />
      
      <CardContent className="relative p-8">
        <div className="flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
          {/* SVG Illustration */}
          <div className="relative">
            {getIcon()}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full w-20 h-20 -z-10 opacity-50"></div>
          </div>
          
          {/* Text Content */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {message}
            </p>
          </div>
          
          {/* Decorative Elements */}
          <div className="flex space-x-1 mt-4">
            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 