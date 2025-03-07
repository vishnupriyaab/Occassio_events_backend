import { IDecoration, IDecorationCreate } from "../../../interfaces/entities/decoration.entity";
import IDecorRepository from "../../../interfaces/repository/admin/decoration.repository";
import IDecorServices from "../../../interfaces/services/admin/decoration.services";
import { DecorRepository } from "../../../repositories/entities/adminRepositories.ts/decorationRepository";

export class DecorServices implements IDecorServices {
  private _decorRepo: IDecorRepository;
  constructor( decorRepo: IDecorRepository ) {
    this._decorRepo = decorRepo;
  }

  async getDecorations(): Promise<IDecoration[]> {
    try {
      return await this._decorRepo.getDecor();
    } catch (error) {
      throw error;
    }
  }

  async addDecoration(decorData: IDecorationCreate): Promise<IDecoration> {
    try {
      console.log(decorData, "decorData");
      const existingDecor = await this._decorRepo.findDecorByName(
        decorData.name
      );
      if (existingDecor) {
        const error = new Error("already existing decoration");
        error.name = "AlreadyExists";
        throw error;
      }
      const decoration = {
        name: decorData.name,
        description: decorData.description,
        estimatedCost: {
          max: decorData.endingPrice,
          min: decorData.startingPrice,
        },
        list: decorData.blocked,
      };
      console.log(decoration, "decoration");
      const newDecoration = await this._decorRepo.addDecor(decoration);
      return newDecoration;
    } catch (error) {
      throw error;
    }
  }
  async updatedecoration(decorationId: string, updatedData: any): Promise<IDecoration | null> {
    try {
      const updatedDecoration = await this._decorRepo.updateDecor(
        decorationId,
        updatedData
      );
      return updatedDecoration;
    } catch (error) {
      throw error;
    }
  }
  async deletedecoration(decorationId: string): Promise<void> {
    try {
      const decoration = await this._decorRepo.findDecorById(decorationId);
      if (!decoration) {
        const error = new Error("Decoration not found");
        error.name = "DecorationNotFound";
        throw error;
      }

      await this._decorRepo.deleteDecor(decorationId);
      return;
    } catch (error) {
      throw error;
    }
  }
  async isList( decorationId: string, updatedData: Partial<IDecoration> ): Promise<IDecoration | null> {
    try {
      const decor = await this._decorRepo.findDecorById(decorationId);
      if (!decor) {
        const error = new Error("Decoration not found");
        error.name = "DecorationNotFound";
        throw error;
      }

      return await this._decorRepo.isList(decorationId, updatedData);
    } catch (error) {
      throw error;
    }
  }
}

const adminDecorRepository = new DecorRepository();
export const adminDecorationServices = new DecorServices(adminDecorRepository);
