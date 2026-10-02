import mongoose, { Schema, Document, Model } from "mongoose";

interface SEOPageSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface ISEOSettings extends Document {
  home: SEOPageSettings;
  about: SEOPageSettings;
  services: SEOPageSettings;
  courses: SEOPageSettings;
  gallery: SEOPageSettings;
  blogs: SEOPageSettings;
  contact: SEOPageSettings;
  verifyCertificate: SEOPageSettings;

  createdAt: Date;
  updatedAt: Date;
}

const SEOPageSchema = new Schema<SEOPageSettings>(
  {
    metaTitle: {
      type: String,
      default: "",
      trim: true,
    },

    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },

    keywords: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const SEOSettingsSchema = new Schema<ISEOSettings>(
  {
    home: {
      type: SEOPageSchema,
      default: () => ({}),
    },

    about: {
      type: SEOPageSchema,
      default: () => ({}),
    },

    services: {
      type: SEOPageSchema,
      default: () => ({}),
    },

    courses: {
      type: SEOPageSchema,
      default: () => ({}),
    },

    gallery: {
      type: SEOPageSchema,
      default: () => ({}),
    },

    blogs: {
      type: SEOPageSchema,
      default: () => ({}),
    },

    contact: {
      type: SEOPageSchema,
      default: () => ({}),
    },

    verifyCertificate: {
      type: SEOPageSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

const SEOSettings: Model<ISEOSettings> =
  mongoose.models.SEOSettings ||
  mongoose.model<ISEOSettings>("SEOSettings", SEOSettingsSchema);

export default SEOSettings;