import mongoose, { Schema, model, models } from "mongoose";

const WishlistItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: null },
    image: { type: String, default: "" },
  },
  { _id: false },
);

const WishlistSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [WishlistItemSchema],
  },
  { timestamps: true },
);

const Wishlist = models.Wishlist || model("Wishlist", WishlistSchema);
export default Wishlist;
