import { Request, Response } from "express";

export default interface INoteController{
    saveNote(req: Request, res: Response): Promise<void | undefined>
}