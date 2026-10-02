import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";
import Gallery from "@/models/Gallery";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    if (!isAdmin(request)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const { id } = await context.params;

    const galleryItem = await Gallery.findById(id);

    if (!galleryItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Gallery item not found",
        },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(
      galleryItem.publicId,
      {
        resource_type: galleryItem.resourceType,
      }
    );

    // Delete from MongoDB
    await Gallery.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    console.error("Delete gallery item error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete gallery item",
      },
      { status: 500 }
    );
  }
}