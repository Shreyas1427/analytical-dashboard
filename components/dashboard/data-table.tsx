'use client';

import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Download, Filter } from 'lucide-react';
import { TableRow as TableRowType } from '@/lib/data';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { EmptyState } from '@/components/dashboard/empty-state';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DataTableProps {
  data: TableRowType[];
  selectedWeek?: string | null;
  onClearWeekFilter?: () => void;
  dateRange?: DateRange | undefined;
}

type SortField = keyof TableRowType;
type SortDirection = 'asc' | 'desc';

export function DataTable({ data, selectedWeek, onClearWeekFilter, dateRange }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('revenue');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const itemsPerPage = 10;

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter(row =>
      row.campaign.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter === 'all' || row.status === statusFilter) &&
      (!selectedWeek || row.week === selectedWeek)
    );

    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [data, searchTerm, sortField, sortDirection, statusFilter, selectedWeek]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const currentData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
      paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      ended: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    };
    
    return (
      <Badge className={cn('capitalize', styles[status as keyof typeof styles])}>
        {status}
      </Badge>
    );
  };

  const exportData = () => {
    const csv = [
      Object.keys(data[0]).join(','),
      ...filteredAndSortedData.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaigns-export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    // Toast notification removed - no longer showing export success message
  };

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-800/30 border-0 shadow-sm ring-1 ring-gray-200/50 dark:ring-gray-700/50">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-600/2 to-gray-600/2" />
      
      <CardHeader className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg sm:text-xl lg:text-2xl font-semibold text-foreground">
              Campaign Performance
            </CardTitle>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
              Detailed performance metrics for all campaigns
              {selectedWeek && (
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                  <span>Filtered by {selectedWeek}</span>
                  <button
                    onClick={onClearWeekFilter}
                    className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800/30 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </span>
              )}
              {dateRange?.from && dateRange?.to && (
                <span className="ml-2 inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs rounded-full">
                  <span>
                    <span className="sm:hidden">
                      {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd')}
                    </span>
                    <span className="hidden sm:inline lg:inline">
                      {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd, yyyy')}
                    </span>
                  </span>
                </span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportData}
              className="gap-1 sm:gap-2 lg:gap-2 px-2 sm:px-3 lg:px-4"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline lg:inline">Export</span>
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4 lg:pt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-sm lg:text-base"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36 lg:w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="ended">Ended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="relative p-0">
        {filteredAndSortedData.length > 0 ? (
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200/50 dark:border-gray-700/50">
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6"
                    onClick={() => handleSort('campaign')}
                  >
                    <div className="flex items-center gap-2">
                      Campaign
                      <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-right text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6"
                    onClick={() => handleSort('impressions')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <span className="sm:hidden">Impr.</span>
                      <span className="hidden sm:inline lg:inline">Impressions</span>
                      <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-right text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6"
                    onClick={() => handleSort('clicks')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Clicks
                      <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-right text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6"
                    onClick={() => handleSort('ctr')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      CTR
                      <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-right text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6"
                    onClick={() => handleSort('conversions')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      <span className="sm:hidden">Conv.</span>
                      <span className="hidden sm:inline lg:inline">Conversions</span>
                      <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-right text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6"
                    onClick={() => handleSort('cost')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Cost
                      <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-right text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6"
                    onClick={() => handleSort('revenue')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Revenue
                      <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-right text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6"
                    onClick={() => handleSort('roas')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      ROAS
                      <ArrowUpDown className="h-3 w-3 sm:h-4 sm:w-4 lg:h-4 lg:w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6">Status</TableHead>
                  <TableHead className="text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6 hidden sm:table-cell lg:table-cell">Week</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((row) => (
                  <TableRow 
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors border-b border-gray-200/30 dark:border-gray-700/30"
                  >
                    <TableCell className="font-medium text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6 max-w-[120px] sm:max-w-none lg:max-w-none truncate">{row.campaign}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6">
                      <span className="sm:hidden">{(row.impressions / 1000).toFixed(0)}K</span>
                      <span className="hidden sm:inline lg:inline">{row.impressions.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6">
                      <span className="sm:hidden">{(row.clicks / 1000).toFixed(1)}K</span>
                      <span className="hidden sm:inline lg:inline">{row.clicks.toLocaleString()}</span>
                    </TableCell>
                    <TableCell className="text-right text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6">{row.ctr}%</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6">{row.conversions.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6">${(row.cost / 1000).toFixed(0)}K</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6">
                      ${row.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-xs sm:text-sm lg:text-base px-2 sm:px-4 lg:px-6">
                      {row.roas}x
                    </TableCell>
                    <TableCell className="px-2 sm:px-4 lg:px-6">{getStatusBadge(row.status)}</TableCell>
                    <TableCell className="hidden sm:table-cell lg:table-cell px-2 sm:px-4 lg:px-6">
                      <span className="text-sm lg:text-base text-muted-foreground">{row.week}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-4 sm:p-8">
            <EmptyState 
              title="No campaign data"
              message="No campaign data available for the selected date range or filters."
              icon="search"
            />
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200/50 dark:border-gray-700/50 gap-3 sm:gap-0">
          <div className="text-xs sm:text-sm lg:text-base text-muted-foreground text-center sm:text-left lg:text-left">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedData.length)} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of{' '}
            {filteredAndSortedData.length} results
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="gap-1 sm:gap-2 lg:gap-2 px-2 sm:px-3 lg:px-4"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline lg:inline">Previous</span>
              <span className="sm:hidden lg:hidden">Prev</span>
            </Button>
            
            <div className="flex items-center gap-0.5 sm:gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 p-0 text-xs sm:text-sm lg:text-base"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="gap-1 sm:gap-2 lg:gap-2 px-2 sm:px-3 lg:px-4"
            >
              <span className="hidden sm:inline lg:inline">Next</span>
              <span className="sm:hidden lg:hidden">Next</span>
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}