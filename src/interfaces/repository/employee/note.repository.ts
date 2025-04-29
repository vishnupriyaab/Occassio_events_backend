import { INote } from "../../entities/note.entity";

export default interface INoteRepository{
    existingUser(userId:string):Promise<INote>
    saveNote(noteData: INote): Promise<INote>
    getNote(userId: string): Promise<INote>
    editNote(noteId: string, content: string): Promise<INote>
}