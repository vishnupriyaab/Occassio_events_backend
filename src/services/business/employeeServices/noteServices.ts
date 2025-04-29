import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import { INote } from "../../../interfaces/entities/note.entity";
import INoteRepository from "../../../interfaces/repository/employee/note.repository";
import INoteService from "../../../interfaces/services/employee/note.services";
import { AppError } from "../../../middleware/errorHandling";
import { NoteRepository } from "../../../repositories/entities/employeeRepository/noteRepository";

export class NoteService implements INoteService {
  private _noteRepository: INoteRepository;
  constructor(noteRepository: INoteRepository) {
    this._noteRepository = noteRepository;
  }
  async saveNote(
    content: string,
    employeeId: string,
    conversationId: string,
    userId: string
  ): Promise<INote> {
    try {
      console.log(content, employeeId, conversationId, userId, "qwertyuiop");

      const existingUser = await this._noteRepository.existingUser(userId);
      console.log(existingUser, "asdfghjkl;xcvbnm,");
      if (existingUser) {
        throw new AppError(
          "ExistingUserError",
          HttpStatusCode.CONFLICT,
          "Already existing user"
        );
      }

      const noteData: INote = {
        content: content,
        employeeId: employeeId,
        conversationId: conversationId,
        userId: userId,
      };
      const saveNote = await this._noteRepository.saveNote(noteData);
      console.log(saveNote, "saveNote");
      return saveNote!;
    } catch (error) {
      console.log(error, "error");
      throw error;
    }
  }

  async getNote(userId: string): Promise<INote> {
    try {
      console.log(userId, "1111");
      const fetchNote = await this._noteRepository.getNote(userId);
      return fetchNote!;
    } catch (error) {
      throw error;
    }
  }

  async editNote(noteId: string, content: string): Promise<INote> {
    try {
      const editedResult = await this._noteRepository.editNote(noteId, content);
      return editedResult;
    } catch (error) {
      throw error;
    }
  }
}

const emplNoteRepository = new NoteRepository();
export const emplNoteService = new NoteService(emplNoteRepository);
