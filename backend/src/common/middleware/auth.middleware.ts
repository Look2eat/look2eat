import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError";
import { Role } from "../../generated/prisma/enums";

export interface AuthPayload {
  sub: string;
  email: string;
  role: Role;
  brandId: string;
  outletId?: string;
}

export interface AuthRequest extends Request {
  auth: AuthPayload;
}

export function authenticateJwt(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Missing authorization token", 401);
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new AppError("JWT_SECRET is not set", 500);

  try {
    const payload = jwt.verify(token, secret) as AuthPayload;
    (req as AuthRequest).auth = payload;
    next();
  } catch (err) {
    throw new AppError("Invalid or expired token", 401);
  }
}

export function authorizeRoles(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = (req as AuthRequest).auth;
    if (!auth) throw new AppError("Unauthorized", 401);
    if (!allowedRoles.includes(auth.role)) {
      throw new AppError("Forbidden", 403);
    }
    next();
  };
}

export function requireOutletScope(req: Request, res: Response, next: NextFunction) {
  const auth = (req as AuthRequest).auth;
  if (!auth?.outletId) {
    throw new AppError("Outlet scope is required", 403);
  }
  next();
}
