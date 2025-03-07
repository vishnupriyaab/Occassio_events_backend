import { ISound, ISoundCreate } from "../../entities/sound.entity"

export default interface ISoundServices{
    getSounds(): Promise<ISound[]>
    addSound(soundData: ISoundCreate): Promise<ISound>
    updateSound(soundId: string, updatedData: any): Promise<ISound | null>
    deleteSound(soundId: string): Promise<void>
    isList( soundId: string, updatedData: Partial<ISound> ): Promise<ISound | null>
}