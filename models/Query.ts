import mongoose, { Document, Model, Schema } from "mongoose";

export interface IQuery extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuerySchema = new Schema<IQuery>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Query: Model<IQuery> =
  mongoose.models.Query ||
  mongoose.model<IQuery>("Query", QuerySchema);

export default Query;