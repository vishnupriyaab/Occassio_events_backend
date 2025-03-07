import { IDecoration, IDecorationCreate } from "../../../interfaces/entities/decoration.entity";
import { ISound, ISoundCreate } from "../../../interfaces/entities/sound.entity";
import IDecorRepository from "../../../interfaces/repository/admin/decoration.repository";
import ISoundRepository from "../../../interfaces/repository/admin/sound.repository";
import IDecorServices from "../../../interfaces/services/admin/decoration.services";
import ISoundServices from "../../../interfaces/services/admin/sound.services";
import { SoundRepository } from "../../../repositories/entities/adminRepositories.ts/soundRepository";

export class SoundServices implements ISoundServices {
  private _soundRepo: ISoundRepository;
  constructor( soundRepo: ISoundRepository ) {
    this._soundRepo = soundRepo;
  }

  async getSounds(): Promise<ISound[]> {
    try {
      return await this._soundRepo.getSound();
    } catch (error) {
      throw error;
    }
  }

  async addSound(soundData: ISoundCreate): Promise<ISound> {
    try {
      console.log(soundData, "soundData");
      const existingSound = await this._soundRepo.findSoundByName(
        soundData.name
      );
      if (existingSound) {
        const error = new Error("already existing sound");
        error.name = "AlreadyExists";
        throw error;
      }
      const sound = {
        name: soundData.name,
        description: soundData.description,
        estimatedCost: {
          max: soundData.endingPrice,
          min: soundData.startingPrice,
        },
        list: soundData.blocked,
      };
      console.log(sound, "sound");
      const newSound = await this._soundRepo.addSound(sound);
      return newSound;
    } catch (error) {
      throw error;
    }
  }
  async updateSound(soundId: string, updatedData: any): Promise<ISound | null> {
    try {
      const updatedSound = await this._soundRepo.updateSound(
        soundId,
        updatedData
      );
      return updatedSound;
    } catch (error) {
      throw error;
    }
  }
  async deleteSound(soundId: string): Promise<void> {
    try {
      const Sound = await this._soundRepo.findSoundById(soundId);
      if (!Sound) {
        const error = new Error("Sound not found");
        error.name = "SoundNotFound";
        throw error;
      }

      await this._soundRepo.deleteSound(soundId);
      return;
    } catch (error) {
      throw error;
    }
  }
  async isList( soundId: string, updatedData: Partial<ISound> ): Promise<ISound | null> {
    try {
      const sound = await this._soundRepo.findSoundById(soundId);
      if (!sound) {
        const error = new Error("Sound not found");
        error.name = "SoundNotFound";
        throw error;
      }

      return await this._soundRepo.isList(soundId, updatedData);
    } catch (error) {
      throw error;
    }
  }
}

const adminSoundRepository = new SoundRepository();
export const adminSoundServices = new SoundServices(adminSoundRepository);
