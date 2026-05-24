import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private isConfigured = false;

  constructor() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });
      this.isConfigured = true;
      this.logger.log('Cloudinary service initialized successfully.');
    } else {
      this.logger.warn(
        'Cloudinary is not configured. Images will not be uploaded (env variables CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET are missing).'
      );
    }
  }

  async uploadImage(base64Image: string, folderName = 'style-ton-humeur'): Promise<string | null> {
    if (!this.isConfigured) {
      this.logger.warn('Cloudinary not configured. Skipping upload.');
      return null;
    }

    try {
      // Ensure it starts with correct prefix
      let uploadStr = base64Image;
      if (!base64Image.startsWith('data:image/')) {
        // Default to jpeg if mime prefix is missing
        uploadStr = `data:image/jpeg;base64,${base64Image}`;
      }

      const response = await cloudinary.uploader.upload(uploadStr, {
        folder: folderName,
        resource_type: 'image',
      });

      this.logger.log(`Successfully uploaded image to Cloudinary: ${response.secure_url}`);
      return response.secure_url;
    } catch (error) {
      this.logger.error('Failed to upload image to Cloudinary', error);
      return null;
    }
  }
}
