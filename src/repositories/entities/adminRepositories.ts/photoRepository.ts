import { IPhoto } from "../../../interfaces/entities/photo.entity";
import IPhotoRepository from "../../../interfaces/repository/admin/photo.repository";
import Photo from "../../../models/photoModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class PhotoRepository
  extends CommonBaseRepository<{ photo: Document & IPhoto }>
  implements IPhotoRepository
{
  constructor() {
    super({ photo: Photo })
  }
  async findPhotoByName(photoName: string): Promise<IPhoto | null> {
    return this.findOne("photo", { photoName })
  }
  async addPhoto(photo: any): Promise<IPhoto> {
    return this.createData("photo", photo)
  }
  async getPhoto(): Promise<IPhoto[]> {
    return this.findAll("photo", {})
  }
  async updatePhoto(
    photoId: string,
    updatedData: Partial<IPhoto>
  ): Promise<IPhoto | null> {
    return this.updateById("photo", photoId, updatedData);
  }
  async findPhotoById(photoId: string): Promise<IPhoto | null> {
    return this.findById("photo", photoId)
  }
  async deletePhoto(photoId: string): Promise<void> {
    await this.deleteById("photo", photoId)
  }
  async isList(
    photoId: string,
    updatedData: Partial<IPhoto>
  ): Promise<IPhoto | null> {
    return this.updateById("photo", photoId, updatedData)
  }
}
