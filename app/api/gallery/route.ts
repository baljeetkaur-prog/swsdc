import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";
import Gallery from "@/models/Gallery";

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

    await connectDB();

    const body = await request.json();

    const {
      type,
      src,
      publicId,
      resourceType,
    } = body;

    if (
      !type ||
      !src ||
      !publicId ||
      !resourceType
    ) {
      return Response.json(
        {
          success: false,
          message: "All gallery fields are required",
        },
        { status: 400 }
      );
    }

    if (!["photo", "video"].includes(type)) {
      return Response.json(
        {
          success: false,
          message: "Invalid gallery type",
        },
        { status: 400 }
      );
    }

    if (!["image", "video"].includes(resourceType)) {
      return Response.json(
        {
          success: false,
          message: "Invalid resource type",
        },
        { status: 400 }
      );
    }

    const galleryItem = await Gallery.create({
      type,
      src,
      publicId,
      resourceType,
    });

    return Response.json(
      {
        success: true,
        message: "Gallery item added successfully",
        galleryItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create gallery item error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create gallery item",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    const gallery = await Gallery.find({})
      .sort({ createdAt: -1 })
      .select(
        "_id type src publicId resourceType createdAt"
      );

    return Response.json({
      success: true,
      gallery,
    });
  } catch (error) {
    console.error("Fetch gallery error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch gallery",
      },
      { status: 500 }
    );
  }
}