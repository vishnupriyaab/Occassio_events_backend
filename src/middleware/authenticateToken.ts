import { NextFunction, Request, Response } from "express";
import { IJWTService } from "../interfaces/integration/IJwt";
import { HttpStatusCode } from "../constant/httpStatusCodes";

export interface AuthenticatedRequest extends Request {
  id?: string;
}

export default class AuthMiddleware {
  constructor(role: string, private _jwtService: IJWTService) {
    this.role = role;
  }
  role: string;

  //role-based Authentication
  async authenticateToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.cookies.access_token;
      console.log(token,"qwertyuiodfghjk");
      if (!token) {
        res.status(HttpStatusCode.UNAUTHORIZED).json({ message: "Unauthorized: No token provided" });
        return;
      }
      const decode = this._jwtService.verifyAccessToken(token);
      console.log(decode,"decode");
      if(decode.role !== this.role){
        res.status( HttpStatusCode.UNAUTHORIZED ).json({ message: "Unauthorized: You do not have permission to access this resource" });
        return;
      }
      req.id = decode.id
      next()
    } catch (error) {
        console.log(error,"error");
        res.status(HttpStatusCode.FORBIDDEN).json({ message: "Forbidden: Invalid token" });
        return;
    }
  }
}
