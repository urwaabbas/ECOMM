import mongoose, { Schema, model, models } from "mongoose";

const CartItemSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: null },
    quantity: { type: Number, required: true, default: 1, min: 1 },
    image: { type: String, default: "" },
  },
  { _id: false },
);

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
  },
  { timestamps: true },
);

const Cart = models.Cart || model("Cart", CartSchema);
export default Cart;
