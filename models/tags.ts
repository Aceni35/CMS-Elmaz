import { Schema, model } from "mongoose";

interface ITag extends Document {
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true, unique: true, minlength: [2, "Tag name must be at least 2 characters"],
      maxlength: [15, "Tag name must be at most 15 characters"] }
  },
  { timestamps: true }
);

const Tag = model<ITag>("Tag", TagSchema);

export default Tag;
