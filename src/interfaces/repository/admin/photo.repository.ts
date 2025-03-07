import { IPhoto } from "../../entities/photo.entity"

export default interface IPhotoRepository{
    findPhotoByName(photoName: string): Promise<IPhoto | null>
    addPhoto(photo: any): Promise<IPhoto>
    getPhoto(): Promise<IPhoto[]>
    updatePhoto( photoId: string, updatedData: Partial<IPhoto>): Promise<IPhoto | null>
    findPhotoById(photoId: string): Promise<IPhoto | null>
    deletePhoto(photoId: string): Promise<void>
    isList(photoId: string, updatedData: Partial<IPhoto>): Promise<IPhoto | null>
}