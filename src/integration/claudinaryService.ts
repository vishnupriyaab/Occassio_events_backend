import axios from "axios";
import { ICloudinaryService } from "../interfaces/integration/IClaudinary";
import { configureCloudinary } from "../config/claudinary";

export class CloudinaryService implements ICloudinaryService {
  private _cloudinary = configureCloudinary();

  async uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(file => this._cloudinary.uploader.upload(file.path));
      const results = await Promise.all(uploadPromises);
      return results.map(result => result.secure_url);
    } catch (error) {
      throw new Error("Failed to upload images to Cloudinary");
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await this._cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new Error("Failed to delete image from Cloudinary");
    }
  }

  async uploadGoogleProfileImage(googleImageUrl: string): Promise<string> {
    try {
      const response = await axios.get(googleImageUrl, {
        responseType: "arraybuffer",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      });

      const base64Image = Buffer.from(response.data, "binary").toString(
        "base64"
      );
      const dataUri = `data:${response.headers["content-type"]};base64,${base64Image}`;

      const result = await this._cloudinary.uploader.upload(dataUri, {
        folder: "google_profile_pictures",
        transformation: [
          { width: 400, height: 400, crop: "fill" },
          { quality: "auto" },
        ],
      });

      return result.secure_url;
    } catch (error) {
      console.error("Error uploading Google profile image:", error);
      throw new Error("Failed to upload Google profile image to Cloudinary");
    }
  }
}
