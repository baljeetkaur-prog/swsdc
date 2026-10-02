import { connectDB } from "@/lib/mongodb";
import Certificate from "@/models/Certificate";

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const certificateNumber =
      searchParams.get("certificateNumber");

    if (!certificateNumber) {
      return Response.json(
        {
          success: false,
          message:
            "Certificate number is required",
        },
        { status: 400 }
      );
    }

    const certificate =
      await Certificate.findOne({
        certificateNumber:
          certificateNumber.trim(),
      }).lean();

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

    return Response.json({
      success: true,

      certificate: {
        certificateNumber:
          certificate.certificateNumber,

        studentName:
          certificate.studentName,

        fatherName:
          certificate.fatherName,

        motherName:
          certificate.motherName,

        dateOfBirth:
          certificate.dateOfBirth,

        address:
          certificate.address,

        courseName:
          certificate.courseName,

        specialisation:
          certificate.specialisation,

        grade:
          certificate.grade,

        duration: {
          from:
            certificate.duration.from,

          to:
            certificate.duration.to,
        },

        issueDate:
          certificate.issueDate,

        profileImage:
          certificate.profileImage,

        pdfFileId:
          certificate.pdfFileId,
      },
    });
  } catch (error) {
    console.error(
      "Certificate search error:",
      error
    );

    return Response.json(
      {
        success: false,
        message:
          "Failed to search certificate",
      },
      { status: 500 }
    );
  }
}