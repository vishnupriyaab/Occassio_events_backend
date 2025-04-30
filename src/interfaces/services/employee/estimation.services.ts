import IEstimation from "../../entities/estimation.entity";

export default interface IEmplEstimationServices {
  saveEstimation(
    estimationData: IEstimation,
    grandTotal: number,
    userId: string,
    employeeId: string
  ): Promise<IEstimation>;
  fetchEstimation(userId:string):Promise<IEstimation | null>
}
