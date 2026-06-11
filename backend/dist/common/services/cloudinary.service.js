"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.v2,
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
exports.uploadToCloudinary = (0, multer_1.default)({ storage: storage });
