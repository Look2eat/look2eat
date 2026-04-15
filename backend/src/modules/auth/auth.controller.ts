import { Request, Response } from "express";
import { authService } from "./auth.service";

export const authController = {
  async registerOwner(req: Request, res: Response) {
    try {
      console.log('Register owner request:', req.body);
      const { brandName, slug, name, email, password, phone } = req.body;
      console.log('Calling authService.registerOwner with:', { brandName, slug, name, email, password: '[HIDDEN]', phone });

      const { brand, owner } = await authService.registerOwner({
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
    } catch (error) {
      console.error('Error in registerOwner:', error);
      throw error;
    }
  },

  async login(req: Request, res: Response) {
    const { phone, password } = req.body;
    const { token, user } = await authService.login(phone, password);

    const { passwordHash, ...userWithoutPassword } = user;

    res.json({ token, user: userWithoutPassword });
  },
};
