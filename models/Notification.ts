import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "new_order",
        "order_update",
        "low_stock",
        "promotion",
        "system",
      ],
      default: "system",
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Notification =
  models.Notification || model("Notification", NotificationSchema);

export default Notification;