import { Injectable, Logger } from '@nestjs/common';
import { client, handle_file } from '@gradio/client';

@Injectable()
export class TryOnService {
  private readonly logger = new Logger(TryOnService.name);

  /**
   * Generates a virtual try-on image using Hugging Face's free IDM-VTON API space.
   * @param humanImageUrl The URL of the person's photo.
   * @param garmentImageUrl The URL of the clothing item.
   * @returns The generated image URL.
   */
  async generateTryOn(humanImageUrl: string, garmentImageUrl: string): Promise<string | null> {
    try {
      this.logger.log('Starting Virtual Try-On via Hugging Face (yisol/IDM-VTON)...');
      
      const app = await client("yisol/IDM-VTON");
      
      const humanDict = {
        background: handle_file(humanImageUrl),
        layers: [],
        composite: null
      };

      const result = await app.predict("/tryon", [
        humanDict,
        handle_file(garmentImageUrl),
        "clothing item", // description
        true,  // is_checked (auto-mask)
        true,  // is_checked_crop (auto-crop)
        30,    // steps
        42     // seed
      ]);

      this.logger.log('Hugging Face VTON generation successful!');
      
      // Output is an array of FileData objects. Index 0 is the final composite image.
      if (result.data && Array.isArray(result.data) && result.data.length > 0) {
        return result.data[0].url;
      }

      this.logger.warn('Unexpected output format from Hugging Face API.', result);
      return null;
    } catch (error) {
      this.logger.error('Error during Hugging Face Virtual Try-On generation', error);
      return null;
    }
  }
}
