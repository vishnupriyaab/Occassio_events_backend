import { Request, Response } from "express";

export default interface IEmployeeController{
    addEmployee(req: Request, res: Response): Promise<void>
}