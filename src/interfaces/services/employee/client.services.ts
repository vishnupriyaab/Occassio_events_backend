export default interface IClientService{
    fetchClients(employeeId: string): Promise<any[]>
}