import { Request, Response } from "express";
import IDashboardController from "../../../interfaces/controller/admin/dashboard.controller";
import IDashboardServices from "../../../interfaces/services/admin/dashboard.services";
import {
  dashboardService,
} from "../../../services/business/adminServices/dashboardServices";

export class DashboardController implements IDashboardController {
  private _dashboardService: IDashboardServices;
  constructor(dashboardService: IDashboardServices) {
    this._dashboardService = dashboardService;
  }
  async getDashboardStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this._dashboardService.getDashboardStatistics();
      
      res.status(200).json({
        success: true,
        message: "Dashboard statistics retrieved successfully",
        data: stats
      });
    } catch (error:unknown) {
      console.error("Dashboard Controller Error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve dashboard statistics",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  }

  async getMonthlyRevenue(req: Request, res: Response): Promise<void> {
  try {
    const monthlyRevenue = await this._dashboardService.getMonthlyRevenue();
    
    console.log(monthlyRevenue,"12345678904567890-")
    res.status(200).json({
      success: true,
      message: "Monthly revenue data retrieved successfully",
      data: monthlyRevenue
    });
  } catch (error) {
    console.error("Monthly revenue controller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve monthly revenue data",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

}
export const adminDashboardController = new DashboardController(dashboardService);
