'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({ dateRange, onDateRangeChange, className }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDateRangeChange(undefined);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn(
              'justify-start text-left font-normal gap-1 sm:gap-2 min-w-[120px] sm:min-w-[240px] px-2 sm:px-3',
              !dateRange && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm truncate">
                    <span className="sm:hidden">
                      {format(dateRange.from, 'MMM dd')} - {format(dateRange.to, 'MMM dd')}
                    </span>
                    <span className="hidden sm:inline">
                      {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                    </span>
                  </span>
                  {dateRange && (
                    <button
                      onClick={handleClear}
                      className="ml-auto hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-0.5 sm:p-1 transition-colors flex-shrink-0"
                    >
                      <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    </button>
                  )}
                </div>
              ) : (
                <span className="text-xs sm:text-sm">
                  <span className="sm:hidden">{format(dateRange.from, 'MMM dd')}</span>
                  <span className="hidden sm:inline">{format(dateRange.from, 'LLL dd, y')}</span>
                </span>
              )
            ) : (
              <span className="text-xs sm:text-sm">
                <span className="sm:hidden">Date range</span>
                <span className="hidden sm:inline">Pick a date range</span>
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={isMobile ? 1 : 2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}