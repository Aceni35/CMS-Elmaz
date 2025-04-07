import { Schema, model, Document } from "mongoose";

export interface IBreadcrumb {
    id: string;
    name: string;
    children: ICategory[];
  }
  
  export interface ICategory extends Document {
    name: string;
    parentId: string;
    breadcrumb: IBreadcrumb;
    children: ICategory[];
    createdAt: Date;
    updatedAt: Date;
  }
  

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    parentId: { type: String, required: true },

    breadcrumb: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      children: {
        type: [Schema.Types.Mixed],
        default: [],
      },
    },
    children: {
      type: [Schema.Types.Mixed],
      default: [],
    },
  },
  { timestamps: true }
);

const Category = model<ICategory>("Category", CategorySchema);

export default Category;

