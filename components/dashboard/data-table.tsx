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
            <CardTitle className="text-lg font-semibold text-foreground">
              Campaign Performance
            </CardTitle>
            <p className="text-sm text-muted-foreground">
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
                    {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd, yyyy')}
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
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-32">
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200/50 dark:border-gray-700/50">
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    onClick={() => handleSort('campaign')}
                  >
                    <div className="flex items-center gap-2">
                      Campaign
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-right"
                    onClick={() => handleSort('impressions')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Impressions
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-right"
                    onClick={() => handleSort('clicks')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Clicks
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-right"
                    onClick={() => handleSort('ctr')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      CTR
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-right"
                    onClick={() => handleSort('conversions')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Conversions
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-right"
                    onClick={() => handleSort('cost')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Cost
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-right"
                    onClick={() => handleSort('revenue')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      Revenue
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-right"
                    onClick={() => handleSort('roas')}
                  >
                    <div className="flex items-center justify-end gap-2">
                      ROAS
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Week</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((row) => (
                  <TableRow 
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors border-b border-gray-200/30 dark:border-gray-700/30"
                  >
                    <TableCell className="font-medium">{row.campaign}</TableCell>
                    <TableCell className="text-right">{row.impressions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{row.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{row.ctr}%</TableCell>
                    <TableCell className="text-right">{row.conversions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">${row.cost.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      ${row.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {row.roas}x
                    </TableCell>
                    <TableCell>{getStatusBadge(row.status)}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{row.week}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-8">
            <EmptyState 
              title="No campaign data"
              message="No campaign data available for the selected date range or filters."
              icon="search"
            />
          </div>
        )}
        
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredAndSortedData.length)} to{' '}
            {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of{' '}
            {filteredAndSortedData.length} results
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
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
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}