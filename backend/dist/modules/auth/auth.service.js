"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../../common/errors/AppError");
const env_1 = require("../../config/env");
const auth_repository_1 = require("./auth.repository");
const SALT_ROUNDS = 10;
exports.authService = {
    async registerOwner(input) {
        const existingUser = await auth_repository_1.authRepository.findByEmail(input.email);
        if (existingUser) {
            throw new AppError_1.AppError("Email already in use", 409);
        }
        const existingBrand = await auth_repository_1.authRepository.findBrandBySlug(input.slug);
        if (existingBrand) {
            throw new AppError_1.AppError("Brand slug already in use", 409);
        }
        const passwordHash = await bcrypt_1.default.hash(input.password, SALT_ROUNDS);
        return auth_repository_1.authRepository.createBrandAndOwner({
            brandName: input.brandName,
            slug: input.slug,
            ownerName: input.name,
            email: input.email,
            phone: input.phone,
            passwordHash,
        });
    },
    async login(phone, password) {
        const user = await auth_repository_1.authRepository.findByPhoneNumber(phone);
        if (!user) {
            throw new AppError_1.AppError("Invalid credentials", 401);
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new AppError_1.AppError("Invalid credentials", 401);
        }
        const token = exports.authService.createJwt({
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
    createJwt(payload) {
        return jsonwebtoken_1.default.sign(payload, env_1.env.jwtSecret, {
            expiresIn: env_1.env.jwtExpiresIn,
        });
    },
};
