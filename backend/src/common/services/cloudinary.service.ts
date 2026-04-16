import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isLogo = file.fieldname === 'logo';
    const transformation = isLogo 
      ? [{ width: 200, height: 200, crop: 'fit' }]
      : [{ width: 800, height: 400, crop: 'fill' }];

    return {
      folder: 'look2eat-brands',
      allowed_formats: ['jpeg', 'png', 'jpg', 'webp'],
      transformation
    };
  },
});

export const uploadToCloudinary = multer({ storage: storage });
