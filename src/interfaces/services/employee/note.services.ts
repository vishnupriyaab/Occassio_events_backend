import { INote } from "../../entities/note.entity";

export default interface INoteService {
  saveNote(
    content: string,
    employeeId: string,
    conversationId: string,
    userId: string
  ): Promise<INote>;
  getNote(userId: string): Promise<INote>;
  editNote(noteId: string, content: string): Promise<INote>;
}
