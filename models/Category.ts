// models/Category.ts
import mongoose, { Schema, model, models } from "mongoose";

export interface ICategory {
  name: string;
  slug: string; // URL-friendly string (e.g., "winter-collection", "electronics")
  description?: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Category slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Category = models.Category || model<ICategory>("Category", CategorySchema);
export default Category;