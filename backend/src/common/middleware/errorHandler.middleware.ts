import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      message: err.message,
      status: "error",
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    message: "Internal server error",
    status: "error",
  });
}
