import { IPhoto, IPhotoCreate } from "../../../interfaces/entities/photo.entity";
import IPhotoRepository from "../../../interfaces/repository/admin/photo.repository";
import IPhotoServices from "../../../interfaces/services/admin/photo.services";
import { PhotoRepository } from "../../../repositories/entities/adminRepositories.ts/photoRepository";

export class PhotoServices implements IPhotoServices {
  private _photoRepo: IPhotoRepository;
  constructor( photoRepo: IPhotoRepository ) {
    this._photoRepo = photoRepo;
  }

  async getPhotos(): Promise<IPhoto[]> {
    try {
      return await this._photoRepo.getPhoto();
    } catch (error) {
      throw error;
    }
  }

  async addPhoto(photoData: IPhotoCreate): Promise<IPhoto> {
    try {
      console.log(photoData, "photoData");
      const existingPhoto = await this._photoRepo.findPhotoByName(
        photoData.name
      );
      if (existingPhoto) {
        const error = new Error("already existing photo");
        error.name = "AlreadyExists";
        throw error;
      }
      const photo = {
        name: photoData.name,
        description: photoData.description,
        estimatedCost: {
          max: photoData.endingPrice,
          min: photoData.startingPrice,
        },
        list: photoData.blocked,
      };
      console.log(photo, "photo");
      const newPhoto = await this._photoRepo.addPhoto(photo);
      return newPhoto;
    } catch (error) {
      throw error;
    }
  }
  async updatePhoto(photoId: string, updatedData: any): Promise<IPhoto | null> {
    try {
      const updatedPhoto = await this._photoRepo.updatePhoto(
        photoId,
        updatedData
      );
      return updatedPhoto;
    } catch (error) {
      throw error;
    }
  }
  async deletePhoto(photoId: string): Promise<void> {
    try {
      const Photo = await this._photoRepo.findPhotoById(photoId);
      if (!Photo) {
        const error = new Error("Photo not found");
        error.name = "PhotoNotFound";
        throw error;
      }

      await this._photoRepo.deletePhoto(photoId);
      return;
    } catch (error) {
      throw error;
    }
  }

  async isList( photoId: string, updatedData: Partial<IPhoto> ): Promise<IPhoto | null> {
    try {
      const photo = await this._photoRepo.findPhotoById(photoId);
      if (!photo) {
        const error = new Error("Photo not found");
        error.name = "PhotoNotFound";
        throw error;
      }

      return await this._photoRepo.isList(photoId, updatedData);
    } catch (error) {
      throw error;
    }
  }
}

const adminPhotoRepository = new PhotoRepository();
export const adminPhotoServices = new PhotoServices(adminPhotoRepository);
