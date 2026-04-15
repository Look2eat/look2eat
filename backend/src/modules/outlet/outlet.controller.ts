import { Request, Response } from "express";
import { outletService } from "./outlet.service";
import { AuthRequest } from "../../common/middleware/auth.middleware";

export const outletController = {
  async createOutlet(req: Request, res: Response) {
    const { name, address, phoneNumber } = req.body;
    const authReq = req as AuthRequest;

    const brandId = authReq.auth.brandId; 

    const outlet = await outletService.createOutlet(brandId, {
      name,
      address,
      phoneNumber,
    });

    res.status(201).json({ data: outlet });
  },

  async getOutlets(req: Request, res: Response) {
    const authReq = req as AuthRequest;
    const brandId = authReq.auth.brandId;

    const outlets = await outletService.getOutlets(brandId);

    res.json({ data: outlets });
  },
};
