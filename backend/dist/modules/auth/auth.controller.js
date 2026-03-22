"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("./auth.service");
exports.authController = {
    async registerOwner(req, res) {
        try {
            console.log('Register owner request:', req.body);
            const { brandName, slug, name, email, password, phone } = req.body;
            console.log('Calling authService.registerOwner with:', { brandName, slug, name, email, password: '[HIDDEN]', phone });
            const { brand, owner } = await auth_service_1.authService.registerOwner({
                brandName,
                slug,
                name,
                email,
                password,
                phone,
            });
            console.log('Brand and Owner created successfully:', { brandId: brand.id, ownerId: owner.id });
            const { passwordHash, ...ownerWithoutPassword } = owner;
            res.status(201).json({
                data: {
                    brand,
                    owner: ownerWithoutPassword
                }
            });
        }
        catch (error) {
            console.error('Error in registerOwner:', error);
            throw error;
        }
    },
    async login(req, res) {
        const { email, password } = req.body;
        const { token, user } = await auth_service_1.authService.login(email, password);
        const { passwordHash, ...userWithoutPassword } = user;
        res.json({ token, user: userWithoutPassword });
    },
};
