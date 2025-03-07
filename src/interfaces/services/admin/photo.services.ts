import { IPhoto, IPhotoCreate } from "../../entities/photo.entity"

export default interface IPhotoServices{
    getPhotos(): Promise<IPhoto[]>
    addPhoto(photoData: IPhotoCreate): Promise<IPhoto>
    updatePhoto(photoId: string, updatedData: any): Promise<IPhoto | null>
    deletePhoto(photoId: string): Promise<void>
    isList( photoId: string, updatedData: Partial<IPhoto> ): Promise<IPhoto | null>
}