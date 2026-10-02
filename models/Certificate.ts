import mongoose, { Schema, Document } from "mongoose";

export interface ICertificate extends Document {
  certificateNumber: string;
  studentName: string;

  fatherName?: string;
  motherName?: string;
  dateOfBirth?: Date;
  address?: string;

  courseName?: string;
  specialisation?: string;

  grade?: string;

  duration?: {
    from?: Date;
    to?: Date;
  };

  issueDate: Date;

  profileImage?: string;
  profileImagePublicId?: string;

  pdfFileId: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    fatherName: {
      type: String,
      trim: true,
    },

    motherName: {
      type: String,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
    },

    address: {
      type: String,
      trim: true,
    },

    courseName: {
      type: String,
      trim: true,
    },

    specialisation: {
      type: String,
      trim: true,
    },

    grade: {
      type: String,
      trim: true,
    },

    duration: {
      from: {
        type: Date,
      },

      to: {
        type: Date,
      },
    },

    issueDate: {
      type: Date,
      required: true,
    },

    profileImage: {
      type: String,
      trim: true,
    },

    profileImagePublicId: {
      type: String,
      trim: true,
    },

    pdfFileId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.models.Certificate ||
  mongoose.model<ICertificate>(
    "Certificate",
    CertificateSchema
  );