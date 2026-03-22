import { outletRepository } from "./outlet.repository";
import { AppError } from "../../common/errors/AppError";

export const outletService = {
  async createOutlet(
    brandId: string,
    input: { name: string; address?: string; phoneNumber?: string }
  ) {
    const existing = await outletRepository.findByNameAndBrand(
      input.name,
      brandId
    );

    if (existing) {
      throw new AppError("An outlet with this name already exists for your brand", 409);
    }

    return outletRepository.createOutlet({
      brandId,
      name: input.name,
      address: input.address,
      phoneNumber: input.phoneNumber,
    });
  },

  async getOutlets(brandId: string) {
    return outletRepository.findByBrandId(brandId);
  },
};
