export interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  totalEvents: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
}
export default interface IDashboardServices {
  getDashboardStatistics(): Promise<DashboardStats>;
  getMonthlyRevenue(): Promise<MonthlyRevenue[]>;
}
