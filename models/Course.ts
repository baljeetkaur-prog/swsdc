import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICourse extends Document {
  courseName: string;
  category: string;
  duration: string;
  keyFeatures: string[];
  description: string;

  curriculum: {
    number: string;
    title: string;
  }[];

  mentor: {
    name: string;
    designation: string;
    about: string;
    image: string;
    imagePublicId?: string;
  };

  thumbnail: string;
  thumbnailPublicId?: string;

  video: string;
  videoPublicId?: string;

  slug: string;

  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    keyFeatures: {
      type: [String],
      required: true,
      default: [],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    curriculum: [
      {
        number: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    mentor: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      designation: {
        type: String,
        required: true,
        trim: true,
      },

      about: {
        type: String,
        required: true,
        trim: true,
      },

      image: {
        type: String,
        required: true,
      },

      imagePublicId: {
        type: String,
      },
    },

    thumbnail: {
      type: String,
      required: true,
    },

    thumbnailPublicId: {
      type: String,
    },

    video: {
      type: String,
      required: true,
    },

    videoPublicId: {
      type: String,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course: Model<ICourse> =
  mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);

export default Course;