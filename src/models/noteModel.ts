import mongoose, { Document, Schema } from "mongoose";
import { INote } from "../interfaces/entities/note.entity";

const noteSchema: Schema = new Schema<INote>(
  {
    content: {
      type: String,
      required: true,
    },
    employeeId: {
      type: String,
    },
    conversationId: {
      type: String,
    },
    userId: {
      type: String,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model<INote & Document>("Note", noteSchema);
export default Note;