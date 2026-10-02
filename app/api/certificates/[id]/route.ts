import { ObjectId } from "mongodb";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";
import { getGridFSBucket } from "@/lib/gridfs";
import Certificate from "@/models/Certificate";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/* ================================
   CLOUDINARY CONFIG
================================ */

cloudinary.config({
  cloud_name:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET,

  secure: true,
});

/* ================================
   GET SINGLE CERTIFICATE
================================ */

export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
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

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid certificate ID",
        },
        { status: 400 }
      );
    }

    const certificate =
      await Certificate.findById(id).lean();

    if (!certificate) {
      return Response.json(
        {
          success: false,
          message: "Certificate not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      certificate,
    });
  } catch (error) {
    console.error(
      "Certificate fetch error:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to load certificate",
      },
      { status: 500 }
    );
  }
}

/* ================================
   UPDATE CERTIFICATE
================================ */

export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  let newPdfFileId: ObjectId | null = null;

  try {
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

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message: "Invalid certificate ID",
        },
        { status: 400 }
      );
    }

    const certificate =
      await Certificate.findById(id);

    if (!certificate) {
      return Response.json(
        {
          success: false,
          message: "Certificate not found",
        },
        { status: 404 }
      );
    }

    const formData =
      await request.formData();

    /* ================================
       GET FORM DATA
    ================================ */

    const certificateNumber =
      formData.get(
        "certificateNumber"
      ) as string | null;

    const studentName =
      formData.get(
        "studentName"
      ) as string | null;

    const fatherName =
      formData.get(
        "fatherName"
      ) as string | null;

    const motherName =
      formData.get(
        "motherName"
      ) as string | null;

    const dateOfBirth =
      formData.get(
        "dateOfBirth"
      ) as string | null;

    const address =
      formData.get(
        "address"
      ) as string | null;

    const courseName =
      formData.get(
        "courseName"
      ) as string | null;

    const specialisation =
      formData.get(
        "specialisation"
      ) as string | null;

    const grade =
      formData.get(
        "grade"
      ) as string | null;

    const durationFrom =
      formData.get(
        "durationFrom"
      ) as string | null;

    const durationTo =
      formData.get(
        "durationTo"
      ) as string | null;

    const issueDate =
      formData.get(
        "issueDate"
      ) as string | null;

    const profileImage =
      formData.get(
        "profileImage"
      ) as string | null;

    const profileImagePublicId =
      formData.get(
        "profileImagePublicId"
      ) as string | null;

    const fileValue =
      formData.get("file");

    const file =
      fileValue instanceof File
        ? fileValue
        : null;

    /* ================================
       REQUIRED FIELD VALIDATION
       
       ONLY THESE THREE ARE REQUIRED
    ================================ */

    if (
      !certificateNumber?.trim() ||
      !studentName?.trim() ||
      !issueDate
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Certificate number, student name and issue date are required",
        },
        { status: 400 }
      );
    }

    /* ================================
       PDF VALIDATION
       
       PDF replacement is optional.
    ================================ */

    if (
      file &&
      file.type !== "application/pdf"
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Only PDF files are allowed",
        },
        { status: 400 }
      );
    }

    /* ================================
       DATE VALIDATION
    ================================ */

    const issueDateValue =
      new Date(issueDate);

    if (
      Number.isNaN(
        issueDateValue.getTime()
      )
    ) {
      return Response.json(
        {
          success: false,
          message: "Invalid issue date",
        },
        { status: 400 }
      );
    }

    /* ================================
       OPTIONAL DATE VALIDATION
    ================================ */

    if (dateOfBirth) {
      const dobDate =
        new Date(dateOfBirth);

      if (
        Number.isNaN(
          dobDate.getTime()
        )
      ) {
        return Response.json(
          {
            success: false,
            message:
              "Invalid date of birth",
          },
          { status: 400 }
        );
      }
    }

    /* ================================
       DURATION VALIDATION
       
       Both are optional.
       
       If one or both are provided,
       validate the dates.
    ================================ */

    if (durationFrom) {
      const fromDate =
        new Date(durationFrom);

      if (
        Number.isNaN(
          fromDate.getTime()
        )
      ) {
        return Response.json(
          {
            success: false,
            message:
              "Invalid duration from date",
          },
          { status: 400 }
        );
      }
    }

    if (durationTo) {
      const toDate =
        new Date(durationTo);

      if (
        Number.isNaN(
          toDate.getTime()
        )
      ) {
        return Response.json(
          {
            success: false,
            message:
              "Invalid duration to date",
          },
          { status: 400 }
        );
      }
    }

    if (
      durationFrom &&
      durationTo &&
      new Date(durationFrom) >
        new Date(durationTo)
    ) {
      return Response.json(
        {
          success: false,
          message:
            "Duration From date cannot be after Duration To date",
        },
        { status: 400 }
      );
    }

    /* ================================
       CHECK DUPLICATE CERTIFICATE
    ================================ */

    const existingCertificate =
      await Certificate.findOne({
        certificateNumber:
          certificateNumber.trim(),

        _id: {
          $ne: id,
        },
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

    /* ================================
       SAVE OLD FILE VALUES
    ================================ */

    const oldPdfFileId =
      certificate.pdfFileId;

    const oldProfileImagePublicId =
      certificate.profileImagePublicId;

    const bucket =
      getGridFSBucket();

    /* ================================
       UPLOAD NEW PDF
       
       Only if user selected a new PDF.
    ================================ */

    if (file) {
      const buffer =
        Buffer.from(
          await file.arrayBuffer()
        );

      const uploadStream =
        bucket.openUploadStream(
          file.name,
          {
            metadata: {
              contentType:
                "application/pdf",
            },
          }
        );

      await new Promise<void>(
        (resolve, reject) => {
          Readable.from(buffer)
            .pipe(uploadStream)
            .on(
              "finish",
              resolve
            )
            .on(
              "error",
              reject
            );
        }
      );

      newPdfFileId =
        uploadStream.id as ObjectId;
    }

    /* ================================
       UPDATE REQUIRED FIELDS
    ================================ */

    certificate.certificateNumber =
      certificateNumber.trim();

    certificate.studentName =
      studentName.trim();

    certificate.issueDate =
      issueDateValue;

    /* ================================
       UPDATE OPTIONAL PERSONAL FIELDS
       
       Empty field = remove old value.
    ================================ */

    certificate.fatherName =
      fatherName?.trim() || undefined;

    certificate.motherName =
      motherName?.trim() || undefined;

    certificate.address =
      address?.trim() || undefined;

    certificate.courseName =
      courseName?.trim() || undefined;

    certificate.specialisation =
      specialisation?.trim() || undefined;

    certificate.grade =
      grade?.trim() || undefined;

    /* ================================
       OPTIONAL DATE OF BIRTH
    ================================ */

    certificate.dateOfBirth =
      dateOfBirth
        ? new Date(dateOfBirth)
        : undefined;

    /* ================================
       OPTIONAL DURATION
       
       Both empty = remove duration.
       
       One provided = save only that
       date.
    ================================ */

    if (
      durationFrom ||
      durationTo
    ) {
      certificate.duration = {
        ...(durationFrom
          ? {
              from: new Date(
                durationFrom
              ),
            }
          : {}),

        ...(durationTo
          ? {
              to: new Date(
                durationTo
              ),
            }
          : {}),
      };
    } else {
      certificate.duration =
        undefined;
    }

    /* ================================
       PROFILE IMAGE
       
       Empty values mean the image
       has been removed.
    ================================ */

    certificate.profileImage =
      profileImage?.trim() || undefined;

    certificate.profileImagePublicId =
      profileImagePublicId?.trim() ||
      undefined;

    /* ================================
       UPDATE PDF
       
       Only replace if a new PDF
       was uploaded.
    ================================ */

    if (newPdfFileId) {
      certificate.pdfFileId =
        newPdfFileId;
    }

    /* ================================
       SAVE DATABASE
    ================================ */

    await certificate.save();

    /* ================================
       DELETE OLD PDF
       
       Only after successful DB save.
    ================================ */

    if (
      newPdfFileId &&
      oldPdfFileId
    ) {
      try {
        await bucket.delete(
          oldPdfFileId
        );
      } catch (error) {
        console.error(
          "Failed to delete old certificate PDF:",
          error
        );
      }
    }

    /* ================================
       DELETE OLD CLOUDINARY IMAGE
       
       Only if the image was replaced
       or removed.
    ================================ */

    const newImagePublicId =
      profileImagePublicId?.trim() ||
      "";

    if (
      oldProfileImagePublicId &&
      oldProfileImagePublicId !==
        newImagePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(
          oldProfileImagePublicId,
          {
            resource_type: "image",
          }
        );
      } catch (error) {
        console.error(
          "Failed to delete old profile image:",
          error
        );
      }
    }

    return Response.json({
      success: true,
      message:
        "Certificate updated successfully",
      certificate,
    });
  } catch (error) {
    console.error(
      "Certificate update error:",
      error
    );

    /* ================================
       CLEANUP NEW PDF
    ================================ */

    if (newPdfFileId) {
      try {
        const bucket =
          getGridFSBucket();

        await bucket.delete(
          newPdfFileId
        );
      } catch (cleanupError) {
        console.error(
          "Failed to cleanup new PDF:",
          cleanupError
        );
      }
    }

    return Response.json(
      {
        success: false,
        message:
          "Failed to update certificate",
      },
      { status: 500 }
    );
  }
}

/* ================================
   DELETE CERTIFICATE
================================ */

export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
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

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json(
        {
          success: false,
          message:
            "Invalid certificate ID",
        },
        { status: 400 }
      );
    }

    const certificate =
      await Certificate.findById(id);

    if (!certificate) {
      return Response.json(
        {
          success: false,
          message:
            "Certificate not found",
        },
        { status: 404 }
      );
    }

    const bucket =
      getGridFSBucket();

    /* ================================
       DELETE PDF FROM GRIDFS
    ================================ */

    if (certificate.pdfFileId) {
      try {
        await bucket.delete(
          certificate.pdfFileId
        );
      } catch (error) {
        console.error(
          "GridFS PDF deletion error:",
          error
        );
      }
    }

    /* ================================
       DELETE PROFILE IMAGE
       FROM CLOUDINARY
    ================================ */

    if (
      certificate.profileImagePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(
          certificate.profileImagePublicId,
          {
            resource_type: "image",
          }
        );
      } catch (error) {
        console.error(
          "Cloudinary profile image deletion error:",
          error
        );
      }
    }

    /* ================================
       DELETE MONGODB RECORD
    ================================ */

    await Certificate.findByIdAndDelete(
      id
    );

    return Response.json({
      success: true,
      message:
        "Certificate deleted successfully",
    });
  } catch (error) {
    console.error(
      "Certificate delete error:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to delete certificate",
      },
      { status: 500 }
    );
  }
}