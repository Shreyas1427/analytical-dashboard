'use client';

import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { MetricCard } from '@/components/dashboard/metric-card';
import { RevenueChart } from '@/components/dashboard/charts/revenue-chart';
import { TrafficChart } from '@/components/dashboard/charts/traffic-chart';
import { UserChart } from '@/components/dashboard/charts/user-chart';
import { DataTable } from '@/components/dashboard/data-table';
import { ThemeToggle } from '@/components/dashboard/theme-toggle';
import { DateRangePicker } from '@/components/dashboard/date-range-picker';
import { AIInsights } from '@/components/dashboard/ai-insights';
import { Button } from '@/components/ui/button';
import { MetricCardSkeleton, ChartSkeleton, TableSkeleton } from '@/components/dashboard/loading-skeleton';
import {
  generateMetrics,
  generateRevenueData,
  generateUserData,
  generateTrafficData,
  generateTableData,
  filterDataByDateRange,
  MetricData,
  ChartDataPoint,
  TableRow,
} from '@/lib/data';
import { BarChart3, RefreshCw, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [metrics, setMetrics] = useState<MetricData | null>(null);
  const [revenueData, setRevenueData] = useState<ChartDataPoint[] | null>(null);
  const [userData, setUserData] = useState<ChartDataPoint[] | null>(null);
  const [trafficData, setTrafficData] = useState<ChartDataPoint[] | null>(null);
  const [tableData, setTableData] = useState<TableRow[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [selectedWeek, setSelectedWeek] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [allRevenueData, setAllRevenueData] = useState<ChartDataPoint[] | null>(null);
  const [allUserData, setAllUserData] = useState<ChartDataPoint[] | null>(null);
  const [allTrafficData, setAllTrafficData] = useState<ChartDataPoint[] | null>(null);
  const [allTableData, setAllTableData] = useState<TableRow[] | null>(null);
  const [aiInsights, setAiInsights] = useState({
    revenueChange: 12.5,
    usersChange: 8.2,
    conversionsChange: 15.3,
  });

  const loadData = async (showLoader = true) => {
    if (showLoader) {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    // Simulate API loading time
    await new Promise(resolve => setTimeout(resolve, showLoader ? 1500 : 800));

    const newRevenueData = generateRevenueData();
    const newUserData = generateUserData();
    const newTrafficData = generateTrafficData();
    const newTableData = generateTableData();

    setMetrics(generateMetrics());
    setAllRevenueData(newRevenueData);
    setAllUserData(newUserData);
    setAllTrafficData(newTrafficData);
    setAllTableData(newTableData);
    setLastUpdated(new Date());
    
    // Generate new AI insights
    setAiInsights({
      revenueChange: parseFloat((Math.random() * 20 - 5).toFixed(1)), // -5 to +15
      usersChange: parseFloat((Math.random() * 15 - 3).toFixed(1)), // -3 to +12
      conversionsChange: parseFloat((Math.random() * 25 - 5).toFixed(1)), // -5 to +20
    });
    
    setIsLoading(false);
    setIsRefreshing(false);

    // Toast notification removed - no longer showing success message on refresh
  };

  // Filter data based on date range
  useEffect(() => {
    if (allRevenueData) {
      setRevenueData(
        filterDataByDateRange(
          allRevenueData,
          dateRange && dateRange.from && dateRange.to
            ? { from: dateRange.from, to: dateRange.to }
            : undefined
        )
      );
    }
    if (allUserData) {
      setUserData(
        filterDataByDateRange(
          allUserData,
          dateRange && dateRange.from && dateRange.to
            ? { from: dateRange.from, to: dateRange.to }
            : undefined
        )
      );
    }
    if (allTrafficData) {
      setTrafficData(
        filterDataByDateRange(
          allTrafficData,
          dateRange && dateRange.from && dateRange.to
            ? { from: dateRange.from, to: dateRange.to }
            : undefined
        )
      );
    }
    if (allTableData) {
      setTableData(
        filterDataByDateRange(
          allTableData,
          dateRange && dateRange.from && dateRange.to
            ? { from: dateRange.from, to: dateRange.to }
            : undefined
        )
      );
    }
  }, [allRevenueData, allUserData, allTrafficData, allTableData, dateRange]);

  useEffect(() => {
    loadData();

    // Simulate real-time updates every 30 seconds
    const interval = setInterval(() => {
      loadData(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []); // Re-run when date range changes

  const refreshData = () => {
    loadData(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto p-6 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
              <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
          
          <ChartSkeleton />
          <TableSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <div className="border-b border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 lg:p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  ADmyBRAND Insights
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
                  Advanced Analytics Platform
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2">
                <Calendar className="h-3 w-3" />
                <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              </div>
              
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
              
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={isRefreshing}
                className={cn(
                  "gap-1 sm:gap-2 lg:gap-2 transition-all duration-300 px-2 sm:px-3 lg:px-4",
                  isRefreshing && "animate-pulse"
                )}
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                <span className="hidden sm:inline lg:inline">Refresh</span>
              </Button>
              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <MetricCard
            title="Total Revenue"
            value={metrics?.revenue || 0}
            change={12.5}
            icon="revenue"
          />
          <MetricCard
            title="Active Users"
            value={metrics?.users || 0}
            change={8.2}
            icon="users"
          />
          <MetricCard
            title="Conversions"
            value={metrics?.conversions || 0}
            change={15.3}
            icon="conversions"
          />
          <MetricCard
            title="Growth Rate"
            value={metrics?.growthRate || 0}
            change={4.1}
            icon="growth"
          />
        </div>

        {/* Charts Section */}
        <div className="space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Charts Row 1 - Revenue and Traffic */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-4 lg:gap-6">
            {revenueData && <RevenueChart data={revenueData} />}
            {trafficData && <TrafficChart data={trafficData} />}
          </div>

          {/* Charts Row 2 - User Chart and Summary Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-4 lg:gap-6">
            {/* User Chart - Full height on mobile, 1/3 width on desktop */}
            <div className="lg:col-span-1">
              {userData && (
                <UserChart 
                  data={userData} 
                  selectedWeek={selectedWeek}
                  onWeekSelect={setSelectedWeek}
                />
              )}
            </div>
            
            {/* Summary Cards - Stacked on mobile, 2/3 width on desktop */}
            <div className="lg:col-span-2 grid grid-cols-1 gap-4 sm:gap-4 lg:gap-6 lg:grid-cols-2">
              {/* Performance Summary */}
              <div className="flex items-center justify-center">
                <div className="text-center space-y-2 sm:space-y-4 lg:space-y-6 p-3 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 w-full h-full">
                  <div className="p-2 sm:p-4 lg:p-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full w-10 h-10 sm:w-16 sm:h-16 lg:w-16 lg:h-16 mx-auto flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 sm:h-8 sm:w-8 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-foreground">
                      Performance Summary
                    </h3>
                    <p className="text-xs sm:text-sm lg:text-base text-muted-foreground max-w-md mt-1">
                      Your campaigns are performing exceptionally well this month with significant growth across all key metrics. Revenue is up 12.5% and conversions increased by 15.3%.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* AI Insights */}
              <div className="flex items-center justify-center">
                <AIInsights 
                  revenueChange={aiInsights.revenueChange}
                  usersChange={aiInsights.usersChange}
                  conversionsChange={aiInsights.conversionsChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {tableData && (
          <DataTable 
            data={tableData} 
            selectedWeek={selectedWeek}
            onClearWeekFilter={() => setSelectedWeek(null)}
            dateRange={dateRange}
          />
        )}
      </div>
    </div>
  );
}