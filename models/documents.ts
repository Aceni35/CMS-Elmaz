import { Schema, model, Document } from "mongoose";

export type DocumentType = "PDF" | "WORD" | "EXCEL" | "PPT" | "TXT" | "OTHER";

export interface IDocument extends Document {
  name: string;
  description: string;
  file: string;
  categoryId: string; 
  size: number; 
  type: DocumentType;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    name: { type: String, required: true, minlength: 2, maxlength: 100 },
    description: { type: String, default: "" },
    file: { type: String, required: true },
    categoryId: { type: String, required: true },
    size: { type: Number, required: true }, 
    type: {
      type: String,
      enum: ["PDF", "WORD", "EXCEL", "PPT", "TXT", "OTHER"],
      required: true,
    },
  },
  { timestamps: true }
);

const DocumentModel = model<IDocument>("Document", DocumentSchema);

export default DocumentModel;
