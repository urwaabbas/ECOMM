import mongoose, { Schema, models } from "mongoose";

const NewsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Newsletter = models.Newsletter || mongoose.model("Newsletter", NewsletterSchema);
export default Newsletter;