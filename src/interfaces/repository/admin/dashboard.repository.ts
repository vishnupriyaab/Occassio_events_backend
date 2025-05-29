export default interface IDashboardRepository{
    getTotalUsers(): Promise<number>
    getTotalBookings(): Promise<number>
    getTotalRevenue(): Promise<number>
    getTotalEvents(): Promise<number>
}