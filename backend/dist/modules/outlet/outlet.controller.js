"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.outletController = void 0;
const outlet_service_1 = require("./outlet.service");
exports.outletController = {
    async createOutlet(req, res) {
        const { name, address, phoneNumber } = req.body;
        const authReq = req;
        const brandId = authReq.auth.brandId;
        const outlet = await outlet_service_1.outletService.createOutlet(brandId, {
            name,
            address,
            phoneNumber,
        });
        res.status(201).json({ data: outlet });
    },
    async getOutlets(req, res) {
        const authReq = req;
        const brandId = authReq.auth.brandId;
        const outlets = await outlet_service_1.outletService.getOutlets(brandId);
        res.json({ data: outlets });
    },
};
