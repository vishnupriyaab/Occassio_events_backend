import { MonthlyRevenue } from "../../services/admin/dashboard.services";

export default interface IDashboardRepository{
    getTotalUsers(): Promise<number>
    getTotalBookings(): Promise<number>
    getTotalRevenue(): Promise<number>
    getTotalEvents(): Promise<number>
    getMonthlyRevenue(): Promise<MonthlyRevenue[]>;
}