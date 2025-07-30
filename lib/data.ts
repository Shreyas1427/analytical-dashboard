// Mock data for the analytics dashboard
import { isWithinInterval, parseISO } from 'date-fns';

export interface MetricData {
  revenue: number;
  users: number;
  conversions: number;
  growthRate: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  date?: string;
  revenue?: number;
  users?: number;
  conversions?: number;
}

export interface TableRow {
  id: string;
  campaign: string;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cost: number;
  revenue: number;
  roas: number;
  status: 'active' | 'paused' | 'ended';
  date: string;
  week: string;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

// Helper function to filter data by date range
export const filterDataByDateRange = <T extends { date?: string }>(
  data: T[],
  dateRange: DateRange | undefined
): T[] => {
  if (!dateRange?.from || !dateRange?.to) {
    return data;
  }

  return data.filter(item => {
    if (!item.date) return false;
    const itemDate = parseISO(item.date);
    const isInRange = isWithinInterval(itemDate, {
      start: dateRange.from!,
      end: dateRange.to!,
    });
    return isInRange;
  });
};

// Generate realistic mock data
export const generateMetrics = (): MetricData => ({
  revenue: Math.floor(Math.random() * 50000) + 150000,
  users: Math.floor(Math.random() * 5000) + 25000,
  conversions: Math.floor(Math.random() * 500) + 2500,
  growthRate: (Math.random() * 20) + 5,
});

export const generateRevenueData = (): ChartDataPoint[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), 0, 1); // Start of current year
  
  return months.map((month, index) => {
    const date = new Date(startDate);
    date.setMonth(index);
    return {
      name: month,
      revenue: Math.floor(Math.random() * 50000) + 100000,
      users: Math.floor(Math.random() * 3000) + 15000,
      conversions: Math.floor(Math.random() * 300) + 1200,
      value: Math.floor(Math.random() * 50000) + 100000,
      date: date.toISOString().split('T')[0],
    };
  });
};

export const generateUserData = (): ChartDataPoint[] => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Start of current month
  
  return weeks.map((week, index) => {
    const date = new Date(startDate);
    date.setDate(1 + (index * 7));
    return {
      name: week,
      users: Math.floor(Math.random() * 5000) + 15000,
      value: Math.floor(Math.random() * 5000) + 15000,
      date: date.toISOString().split('T')[0],
    };
  });
};

export const generateTrafficData = (): ChartDataPoint[] => {
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  return [
    { name: 'Organic Search', value: 45.2, date: new Date(startDate.getTime() + 0 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { name: 'Direct', value: 22.8, date: new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { name: 'Social Media', value: 15.6, date: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { name: 'Email', value: 8.9, date: new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { name: 'Paid Ads', value: 5.2, date: new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
    { name: 'Referral', value: 2.3, date: new Date(startDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] },
  ];
};

export const generateConversionData = (): ChartDataPoint[] => {
  const devices = ['Desktop', 'Mobile', 'Tablet'];
  const currentDate = new Date();
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  return devices.map((device, index) => ({
    name: device,
    value: Math.floor(Math.random() * 1000) + 500,
    date: new Date(startDate.getTime() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  }));
};

export const generateTableData = (): TableRow[] => {
  const campaigns = [
    'Black Friday Sale',
    'Spring Collection',
    'Brand Awareness Q4',
    'Retargeting Campaign',
    'Product Launch',
    'Holiday Special',
    'Newsletter Signup',
    'Video Ad Campaign',
    'Search Campaign',
    'Display Network',
  ];

  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
  const statuses: Array<'active' | 'paused' | 'ended'> = ['active', 'paused', 'ended'];

  return campaigns.map((campaign, index) => {
    const impressions = Math.floor(Math.random() * 100000) + 50000;
    const clicks = Math.floor(impressions * (Math.random() * 0.05 + 0.01));
    const conversions = Math.floor(clicks * (Math.random() * 0.1 + 0.02));
    const cost = Math.floor(Math.random() * 5000) + 1000;
    const revenue = Math.floor(conversions * (Math.random() * 100 + 50));
    
    return {
      id: `campaign-${index + 1}`,
      campaign,
      impressions,
      clicks,
      conversions,
      ctr: parseFloat(((clicks / impressions) * 100).toFixed(2)),
      cost,
      revenue,
      roas: parseFloat((revenue / cost).toFixed(2)),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      date: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      week: weeks[Math.floor(Math.random() * weeks.length)],
    };
  });
};

export const COLORS = {
  primary: '#1e40af',
  secondary: '#0891b2',
  accent: '#ea580c',
  success: '#059669',
  warning: '#d97706',
  error: '#dc2626',
  chart: ['#1e40af', '#0891b2', '#ea580c', '#059669', '#d97706', '#dc2626'],
};