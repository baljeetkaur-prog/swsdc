import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlog extends Document {
  blogName: string;
  slug: string;

  image: string;
  imagePublicId: string;

  metaTitle: string;
  metaDescription: string;

  keywords: string[];

  shortDescription: string;

  date: Date;

  category: string;
  tags: string[];

  content: string;

  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
  {
    blogName: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },

    imagePublicId: {
      type: String,
      required: true,
      trim: true,
    },

    metaTitle: {
      type: String,
      required: true,
      trim: true,
    },

    metaDescription: {
      type: String,
      required: true,
      trim: true,
    },

    keywords: {
      type: [String],
      default: [],
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Blog: Model<IBlog> =
  mongoose.models.Blog ||
  mongoose.model<IBlog>("Blog", BlogSchema);

export default Blog;