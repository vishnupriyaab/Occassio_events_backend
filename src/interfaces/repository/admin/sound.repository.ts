import { ISound } from "../../entities/sound.entity"

export default interface ISoundRepository{
    findSoundByName(soundName: string): Promise<ISound | null>
    addSound(sound: any): Promise<ISound>
    getSound(): Promise<ISound[]>
    updateSound( soundId: string, updatedData: Partial<ISound>): Promise<ISound | null>
    findSoundById(soundId: string): Promise<ISound | null>
    deleteSound(soundId: string): Promise<void>
    isList(soundId: string, updatedData: Partial<ISound>): Promise<ISound | null>
}