import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { AppError } from "../../common/errors/AppError";
import { env } from "../../config/env";
import { authRepository } from "./auth.repository";
import { RegisterOwnerInput } from "./auth.type";

const SALT_ROUNDS = 10;

export const authService = {
  async registerOwner(input: RegisterOwnerInput) {
    const existingUser = await authRepository.findByEmail(input.email);

    if (existingUser) {
      throw new AppError("Email already in use", 409);
    }

    const existingBrand = await authRepository.findBrandBySlug(input.slug);

    if (existingBrand) {
      throw new AppError("Brand slug already in use", 409);
    }

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
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }
    const token = authService.createJwt({
      sub: user.id,
      email: user.email,
      role: user.role,
      brandId: user.brandId,
      phoneNumber: user.phoneNumber,
      name: user.name,
      slug: user.brand?.slug,
    });

    return {
      token,
      user,
    };
  },

  createJwt(payload: {
    sub: string;
    email: string;
    role: Role;
    brandId?: string | null;
    phoneNumber?: string;
    name?: string;
    slug?: string;
  }) {
    return jwt.sign(payload, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn,
    } as jwt.SignOptions);
  },
};