import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../../common/errors/AppError";
import { authRepository } from "./auth.repository";
import { Role } from "@prisma/client";

const SALT_ROUNDS = 10;

export const authService = {
  async registerOwner(input: {
    brandName: string;
    slug: string;
    name: string;
    email: string;
    password: string;
    phone: string;
  }) {
    const existingUser = await authRepository.findByEmail(input.email);
    if (existingUser) throw new AppError("Email already in use", 409);

    const existingBrand = await authRepository.findBrandBySlug(input.slug);
    if (existingBrand) throw new AppError("Brand slug already in use", 409);

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    return authRepository.createBrandAndOwner({
      brandName: input.brandName,
      slug: input.slug,
      ownerName: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash,
    });
  },

  async login(phone: string, password: string) {
    const user = await authRepository.findByPhoneNumber(phone);
    if (!user) throw new AppError("Invalid credentials", 401);

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new AppError("Invalid credentials", 401);

    const token = this.createJwt({
      sub: user.id,
      email: user.email,
      role: user.role,
      brandId: user.brandId,
      phoneNumber: user.phoneNumber,
      name: user.name,
      slug: user.brand?.slug
    });

    return { token, user };
  },

  createJwt(payload: {
    sub: string;
    email: string;
    role: Role;
    brandId?: string | null;
    phoneNumber?: string;
    name?: string;
    slug?: string
  }) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError("JWT_SECRET is not set", 500);

    return jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
    } as jwt.SignOptions);
  },
};