import { Document } from "mongoose";
import INoteRepository from "../../../interfaces/repository/employee/note.repository";
import CommonBaseRepository from "../../baseRepository/commonBaseRepository";
import { INote } from "../../../interfaces/entities/note.entity";
import Note from "../../../models/noteModel";

export class NoteRepository
  extends CommonBaseRepository<{ note: Document & INote }>
  implements INoteRepository
{
  constructor() {
    super({ note: Note });
  }

  async existingUser(userId: string): Promise<INote> {
    try {
      const existingUser = await this.findOne("note", { userId });
      return existingUser!;
    } catch (error) {
      throw error;
    }
  }

  async saveNote(noteData: INote): Promise<INote> {
    try {
      console.log("11");
      const saveNote = await this.createData("note", noteData);
      return saveNote!;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getNote(userId: string): Promise<INote> {
    try {
      const fetchNote = await this.findOne("note", { userId });
      return fetchNote!;
    } catch (error) {
      throw error;
    }
  }

  async editNote(noteId: string, content: string): Promise<INote> {
    try {
      const editedResult = await this.updateById("note", noteId, { content });
      return editedResult!;
    } catch (error) {
      throw error;
    }
  }
}
