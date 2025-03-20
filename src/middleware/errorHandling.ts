import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../integration/responseHandler";
import { HttpStatusCode } from "../constant/httpStatusCodes";

export class AppError extends Error {
  status: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number, name?: string) {
    super(message);
    this.name = name || this.constructor.name;
    this.status = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
type ErrorWithStatus = Error & {
  name: string;
  status?: number;
  isOperational?: boolean;
};

export function errorMiddleware(
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode =
    err.status && Number.isInteger(err.status)
      ? err.status
      : HttpStatusCode.INTERNAL_SERVER_ERROR;

  console.error(`${err.message}`,"wertyuio");

  if (err instanceof SyntaxError && "body" in err) {
    return ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "Invalid JSON format");
  }

  switch (err.name) {
    case "AdminNotFound":
      return ErrorResponse(res, HttpStatusCode.NOT_FOUND, "Admin not found");
    case "PasswordIsIncorrect":
      return ErrorResponse(res, HttpStatusCode.UNAUTHORIZED, "Password is Incorrect");
    case "FieldsAreRequired":
      return ErrorResponse(res, HttpStatusCode.BAD_REQUEST, err.message || "Required fields are missing");
    case "ValidationError":
      return ErrorResponse(res, HttpStatusCode.BAD_REQUEST, err.message || "Validation failed");
    case "FailedToCreatePayment":
      return ErrorResponse(res, HttpStatusCode.BAD_REQUEST, "Failed to create Stripe payment link");
    case "UnauthorizedError":
    case "TokenExpiredError":
    case "JsonWebTokenError":
      return ErrorResponse(res, HttpStatusCode.UNAUTHORIZED, "Authentication failed");
    case "ForbiddenError":
      return ErrorResponse(res, HttpStatusCode.FORBIDDEN, "Access denied");
    default:
      const message =
        process.env.NODE_ENV === "production"
          ? "Something went wrong"
          : err.message || "An unexpected error occurred";

      ErrorResponse(res, statusCode, message);
  }

  next(err); 
}
