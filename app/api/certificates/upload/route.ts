import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";
import { getGridFSBucket } from "@/lib/gridfs";
import Certificate from "@/models/Certificate";
import { Readable } from "stream";

export async function POST(request: Request) {
  try {
    // Admin authentication
    if (!isAdmin(request)) {
      return Response.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const formData = await request.formData();

    // Required fields
    const certificateNumber =
      formData.get("certificateNumber") as string;

    const studentName =
      formData.get("studentName") as string;

    const issueDate =
      formData.get("issueDate") as string;

    const file =
      formData.get("file") as File;

    // Optional fields
    const fatherName =
      formData.get("fatherName") as string;

    const motherName =
      formData.get("motherName") as string;

    const dateOfBirth =
      formData.get("dateOfBirth") as string;

    const address =
      formData.get("address") as string;

    const courseName =
      formData.get("courseName") as string;

    const specialisation =
      formData.get("specialisation") as string;

    const grade =
      formData.get("grade") as string;

    const durationFrom =
      formData.get("durationFrom") as string;

    const durationTo =
      formData.get("durationTo") as string;

    const profileImage =
      formData.get("profileImage") as string;

    const profileImagePublicId =
      formData.get("profileImagePublicId") as string;

    // Check only required fields
    if (
      !certificateNumber ||
      !studentName ||
      !issueDate ||
      !file
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Certificate number, student name, issue date and PDF certificate are required",
        },
        { status: 400 }
      );
    }

    // Make sure uploaded file is actually a PDF
    if (file.type !== "application/pdf") {
      return Response.json(
        {
          success: false,
          message: "Only PDF files are allowed",
        },
        { status: 400 }
      );
    }

    // Check duplicate certificate number
    const existingCertificate =
      await Certificate.findOne({
        certificateNumber,
      });

    if (existingCertificate) {
      return Response.json(
        {
          success: false,
          message:
            "Certificate number already exists",
        },
        { status: 409 }
      );
    }

    // GridFS bucket
    const bucket = getGridFSBucket();

    const buffer = Buffer.from(
      await file.arrayBuffer()
    );

    const uploadStream =
      bucket.openUploadStream(file.name, {
        metadata: {
          contentType: "application/pdf",
        },
      });

    // Upload PDF to GridFS
    await new Promise<void>(
      (resolve, reject) => {
        Readable.from(buffer)
          .pipe(uploadStream)
          .on("finish", resolve)
          .on("error", reject);
      }
    );

    // Build certificate data
    const certificateData: any = {
      certificateNumber,
      studentName,
      issueDate: new Date(issueDate),
      pdfFileId: uploadStream.id,
    };

    // Add optional text fields only when provided
    if (fatherName) {
      certificateData.fatherName = fatherName;
    }

    if (motherName) {
      certificateData.motherName = motherName;
    }

    if (address) {
      certificateData.address = address;
    }

    if (courseName) {
      certificateData.courseName = courseName;
    }

    if (specialisation) {
      certificateData.specialisation =
        specialisation;
    }

    if (grade) {
      certificateData.grade = grade;
    }

    // Optional Date of Birth
    if (dateOfBirth) {
      certificateData.dateOfBirth =
        new Date(dateOfBirth);
    }

    // Optional duration
    if (durationFrom || durationTo) {
      certificateData.duration = {};

      if (durationFrom) {
        certificateData.duration.from =
          new Date(durationFrom);
      }

      if (durationTo) {
        certificateData.duration.to =
          new Date(durationTo);
      }
    }

    // Optional profile image
    if (profileImage) {
      certificateData.profileImage =
        profileImage;
    }

    if (profileImagePublicId) {
      certificateData.profileImagePublicId =
        profileImagePublicId;
    }

    // Create certificate
    const certificate =
      await Certificate.create(
        certificateData
      );

    return Response.json(
      {
        success: true,
        message:
          "Certificate uploaded successfully",
        certificate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Certificate upload error:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Certificate upload failed",
      },
      { status: 500 }
    );
  }
}