import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";
import Certificate from "@/models/Certificate";

export async function GET(request: Request) {
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

    const certificates = await Certificate.find({})
      .sort({ createdAt: -1 })
      .lean();

    return Response.json({
      success: true,
      certificates,
    });
  } catch (error) {
    console.error("Certificates fetch error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to load certificates",
      },
      { status: 500 }
    );
  }
}