import { v2 as cloudinary } from "cloudinary";
import { isAdmin } from "@/lib/auth";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function POST(request: Request) {
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

    const { publicId, resourceType } = await request.json();

    if (!publicId) {
      return Response.json(
        {
          success: false,
          message: "Public ID is required",
        },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || "image",
    });

    return Response.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to delete Cloudinary file",
      },
      { status: 500 }
    );
  }
}