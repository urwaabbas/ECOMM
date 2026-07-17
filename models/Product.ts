// models/Product.ts
import mongoose, { Schema, model, models } from "mongoose";

export interface IProduct {
  title: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  category: mongoose.Types.ObjectId; // Links directly to Category Schema
  images: string[]; // Array of image asset URLs
  stock: number;
  isFeatured?: boolean;
  ratings?: {
    average: number;
    count: number;
  };
}

const ProductSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    discountPrice: {
      type: Number,
      default: null,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },
    images: {
      type: [String],
      required: [true, "At least one product image is required"],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: "A product must have at least one image pointer.",
      },
    },
    stock: {
      type: Number,
      required: [true, "Stock count is required"],
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Performance compound full-text indices for high-speed catalog lookups
ProductSchema.index({ title: "text", description: "text" });

const Product = models.Product || model<IProduct>("Product", ProductSchema);
export default Product;