import IDashboardRepository from "../../../interfaces/repository/admin/dashboard.repository";
import IDashboardServices, {
  DashboardStats,
  MonthlyRevenue,
} from "../../../interfaces/services/admin/dashboard.services";
import { DashboardRepository } from "../../../repositories/entities/adminRepositories.ts/dashboardRepository";

export class DashboardService implements IDashboardServices {
  private _dashboardRepository: IDashboardRepository;
  constructor(dashboardRepo: IDashboardRepository) {
    this._dashboardRepository = dashboardRepo;
  }
  async getDashboardStatistics(): Promise<DashboardStats> {
    try {
      const [totalUsers, totalBookings, totalRevenue, totalEvents] =
        await Promise.all([
          this._dashboardRepository.getTotalUsers(),
          this._dashboardRepository.getTotalBookings(),
          this._dashboardRepository.getTotalRevenue(),
          this._dashboardRepository.getTotalEvents(),
        ]);

      return {
        totalUsers,
        totalBookings,
        totalRevenue,
        totalEvents,
      };
    } catch (error) {
      console.error("Error fetching dashboard statistics:", error);
      throw new Error("Failed to fetch dashboard statistics");
    }
  }

  async getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
    try {
      return await this._dashboardRepository.getMonthlyRevenue();
    } catch (error: unknown) {
      console.error("Error in dashboard service - getMonthlyRevenue:", error);
      throw new Error("Failed to retrieve monthly revenue data");
    }
  }
}

const dashboardRepository = new DashboardRepository();
export const dashboardService = new DashboardService(dashboardRepository);
