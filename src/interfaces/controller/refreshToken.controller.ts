import { Request, Response } from "express";

export default interface IRefreshTokenController {
  getNewAccessTokenWithRefreshToken(req: Request, res: Response): Promise<void>;
}
