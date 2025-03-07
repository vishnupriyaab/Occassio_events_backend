import { ISound } from "../../../interfaces/entities/sound.entity";
import ISoundRepository from "../../../interfaces/repository/admin/sound.repository";
import Sound from "../../../models/soundModel";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";

export class SoundRepository
  extends CommonBaseRepository<{ sound: Document & ISound }>
  implements ISoundRepository
{
  constructor() {
    super({ sound: Sound });
  }
  async findSoundByName(soundName: string): Promise<ISound | null> {
    return this.findOne("sound", { soundName });
  }
  async addSound(sound: any): Promise<ISound> {
    return this.createData("sound", sound);
  }
  async getSound(): Promise<ISound[]> {
    return this.findAll("sound", {});
  }
  async updateSound( soundId: string, updatedData: Partial<ISound>): Promise<ISound | null> {
    return this.updateById("sound", soundId, updatedData);
  }
  async findSoundById(soundId: string): Promise<ISound | null> {
    return this.findById("sound", soundId);
  }
  async deleteSound(soundId: string): Promise<void> {
    await this.deleteById("sound", soundId);
  }
  async isList(soundId: string, updatedData: Partial<ISound>): Promise<ISound | null> {
    return this.updateById("sound", soundId, updatedData);
  }
}
