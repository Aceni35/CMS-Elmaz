import { Schema, model, Document } from "mongoose";

export type NewsStatus = "active" | "draft" | "archive";

export interface INews extends Document {
  cover: string;
  title: string;
  content: string;
  tagIds: string[];
  images: string[];
  createdBy: {fullName:string, id:string}
  views: {userId : string, viewedAt: Date}[]
  status: NewsStatus;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSchema = new Schema<INews>(
  {
    cover: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tagIds: { type: [String], default: [] },
    images: { type: [String], default: [] },
    createdBy: {
      fullName: {required: true, type:String},
      id: {required: true, type:String}
    },
    views: {
        type: [
          {
            userId: { type: String, required: true },
            viewedAt: { type: Date, default: Date.now },
          },
        ],
        default: [],
      },
    status: {
      type: String,
      enum: ["active", "draft", "archive"],
      required: true,
    },
  },
  { timestamps: true }
);

const News = model<INews>("News", NewsSchema);

export default News;
