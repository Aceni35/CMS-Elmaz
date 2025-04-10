import { Schema, model, Document } from "mongoose";

export type InvoiceType = "Company" | "Personal";
export type InvoiceArea = "Plav" | "Murino" | "Ruralne oblasti";
export type DocumentFileType = "PDF" | "WORD" | "EXCEL" | "PPT" | "TXT" | "OTHER";

export interface IInvoiceDocument extends Document {
  name: string;
  description: string;
  file: string;
  categoryId: string;
  size: number;
  type: DocumentFileType;
  invoiceType: InvoiceType;
  area: InvoiceArea;
  year: number;
  month: number;
  createdAt: Date;
  updatedAt: Date;
  sent: boolean;
}

const InvoiceDocumentSchema = new Schema<IInvoiceDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
    file: { type: String, required: true },
    categoryId: { type: String, required: true },
    size: { type: Number, required: true },
    type: {
      type: String,
      enum: ["PDF", "WORD", "EXCEL", "PPT", "TXT", "OTHER"],
      required: true,
    },
    invoiceType: {
      type: String,
      enum: ["Company", "Personal"],
      required: true,
    },
    area: {
      type: String,
      enum: ["Plav", "Murino", "Ruralne oblasti"],
      required: true,
    },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    sent: {type: Boolean, default: false}
  },
  { timestamps: true }
);

const InvoiceDocument = model<IInvoiceDocument>("InvoiceDocument", InvoiceDocumentSchema);

export default InvoiceDocument;
