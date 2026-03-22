"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outletService = void 0;
const outlet_repository_1 = require("./outlet.repository");
const AppError_1 = require("../../common/errors/AppError");
exports.outletService = {
    async createOutlet(brandId, input) {
        const existing = await outlet_repository_1.outletRepository.findByNameAndBrand(input.name, brandId);
        if (existing) {
            throw new AppError_1.AppError("An outlet with this name already exists for your brand", 409);
        }
        return outlet_repository_1.outletRepository.createOutlet({
            brandId,
            name: input.name,
            address: input.address,
            phoneNumber: input.phoneNumber,
        });
    },
    async getOutlets(brandId) {
        return outlet_repository_1.outletRepository.findByBrandId(brandId);
    },
};
