import { Request, Response } from "express";

export default interface IEmployeeController{
    addEmployee(req: Request, res: Response): Promise<void>
    getEmployee(req:Request,res:Response):Promise<void>
    blockEmployee(req: Request, res: Response): Promise<void>
    deleteEmployee(req: Request, res: Response): Promise<void>
}