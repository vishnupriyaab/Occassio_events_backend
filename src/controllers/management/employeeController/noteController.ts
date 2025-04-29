import { Request, Response } from "express";
import INoteController from "../../../interfaces/controller/employee/note.controller";
import { emplNoteService } from "../../../services/business/employeeServices/noteServices";
import {
  ErrorResponse,
  successResponse,
} from "../../../integration/responseHandler";
import { HttpStatusCode } from "../../../constant/httpStatusCodes";
import INoteService from "../../../interfaces/services/employee/note.services";

export class NoteController implements INoteController {
  private _noteService: INoteService;
  constructor(noteService: INoteService) {
    this._noteService = noteService;
  }
  async saveNote(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body, "boddyyy");
      const { content, employeeId, conversationId, userId } = req.body;
      if (!content || !employeeId || !conversationId || !userId) {
        return ErrorResponse(
          res,
          HttpStatusCode.NOT_FOUND,
          "All field are required"
        );
      }
      const saveNote = await this._noteService.saveNote(
        content,
        employeeId,
        conversationId,
        userId
      );
      console.log(saveNote, "savenotein controller");
      return successResponse(
        res,
        HttpStatusCode.CREATED,
        "Note is saved",
        saveNote
      );
    } catch (error) {
      console.log(error, "error");
      throw error;
    }
  }

  async getNotes(req: Request, res: Response): Promise<void> {
    try {
      console.log("start");
      const userId = req.query.userId as string;

      console.log(userId, "qwertyuiop");

      const getNote = await this._noteService.getNote(userId);
      console.log(getNote, "getnote in controller");
      return successResponse(
        res,
        HttpStatusCode.OK,
        "Successfully fetched Note",
        getNote
      );
    } catch (error) {
      throw error;
    }
  }

  async editNotes(req: Request, res: Response): Promise<void> {
    try {
      const noteId = req.params.noteId;
      const { content } = req.body;
      console.log(noteId, content, "12345678909");

      const editResult = await this._noteService.editNote(noteId, content);
      return successResponse(res, HttpStatusCode.OK, "Successfully edited the note", editResult);
    } catch (error) {
      throw error;
    }
  }
}
export const emplNoteController = new NoteController(emplNoteService);
