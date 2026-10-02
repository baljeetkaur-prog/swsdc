import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGallery extends Document {
  type: "photo" | "video";
  src: string;
  publicId: string;
  resourceType: "image" | "video";
  createdAt: Date;
  updatedAt: Date;
}

const GallerySchema = new Schema<IGallery>(
  {
    type: {
      type: String,
      enum: ["photo", "video"],
      required: true,
    },

    src: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    resourceType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Gallery: Model<IGallery> =
  mongoose.models.Gallery ||
  mongoose.model<IGallery>("Gallery", GallerySchema);

export default Gallery;