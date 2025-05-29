
export interface DashboardStats {
  totalUsers: number;
  totalBookings: number;
  totalRevenue: number;
  totalEvents: number;
}
export default interface IDashboardServices {
  getDashboardStatistics(): Promise<DashboardStats>;
}
