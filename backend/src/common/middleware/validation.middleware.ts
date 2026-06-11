import { NextFunction, Request, Response } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "../errors/AppError";

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      console.log("VALIDATION ERROR:", error);

      if (error instanceof ZodError) {
        throw new AppError(
          error.issues[0]?.message ?? "Validation failed",
          400
        );
      }

      throw error;
    }
  };
}