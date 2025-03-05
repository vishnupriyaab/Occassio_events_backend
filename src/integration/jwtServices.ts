import jwt from "jsonwebtoken";
import { IJWTService, JWTPayload } from "../interfaces/integration/IJwt";

export class JWTService implements IJWTService {
  private readonly _accessTokenSecret: string;
  private readonly _refreshTokenSecret: string;

  constructor() {
    this._accessTokenSecret = process.env.JWT_SECRET || "accessSecretKey";
    this._refreshTokenSecret = process.env.JWT_REFRESH_SECRET || "refreshSecretKey";
  }

  generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, this._accessTokenSecret, {
      expiresIn: "1d"
    });
  }

  generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, this._refreshTokenSecret, {
      expiresIn: "30d"
    });
  }

  verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this._accessTokenSecret) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid or expired access token");
      }
      throw error;
    }
  }

  verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this._refreshTokenSecret) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid or expired refresh token");
      }
      throw error;
    }
  }

  decodeToken(token: string): JWTPayload | null {
    return jwt.decode(token) as JWTPayload | null;
  }
}
