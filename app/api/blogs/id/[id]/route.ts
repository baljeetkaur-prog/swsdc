import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";
import Blog from "@/models/Blog";
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

// GET - Fetch single blog for editing
export async function GET(
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

    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Fetch blog error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch blog",
      },
      { status: 500 }
    );
  }
}


// PUT - Update blog
export async function PUT(
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

    const body = await request.json();

    const {
      blogName,
      slug,
      image,
      imagePublicId,
      metaTitle,
      metaDescription,
      keywords,
      shortDescription,
      category,
      tags,
      content,
    } = body;

    // Required fields
    if (
      !blogName ||
      !slug ||
      !image ||
      !imagePublicId ||
      !metaTitle ||
      !metaDescription ||
      !shortDescription ||
      !category ||
      !content
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All required fields are required",
        },
        { status: 400 }
      );
    }

    // Find existing blog
    const existingBlog = await Blog.findById(id);

    if (!existingBlog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    const cleanSlug = slug.trim().toLowerCase();

    // Check duplicate slug
    const duplicateBlog = await Blog.findOne({
      slug: cleanSlug,
      _id: { $ne: id },
    });

    if (duplicateBlog) {
      return NextResponse.json(
        {
          success: false,
          message: "Another blog already uses this slug",
        },
        { status: 409 }
      );
    }

    // If featured image changed,
    // delete old image from Cloudinary
    if (
      imagePublicId !== existingBlog.imagePublicId &&
      existingBlog.imagePublicId
    ) {
      try {
        await cloudinary.uploader.destroy(
          existingBlog.imagePublicId,
          {
            resource_type: "image",
          }
        );
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete old blog image:",
          cloudinaryError
        );
      }
    }

    const updatedBlog =
      await Blog.findByIdAndUpdate(
        id,
        {
          blogName: blogName.trim(),

          slug: cleanSlug,

          image: image.trim(),

          imagePublicId:
            imagePublicId.trim(),

          metaTitle: metaTitle.trim(),

          metaDescription:
            metaDescription.trim(),

          keywords: Array.isArray(keywords)
            ? keywords
                .map((keyword: string) =>
                  keyword.trim()
                )
                .filter(Boolean)
            : [],

          shortDescription:
            shortDescription.trim(),

          category: category.trim(),

          tags: Array.isArray(tags)
            ? tags
                .map((tag: string) =>
                  tag.trim()
                )
                .filter(Boolean)
            : [],

          content,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.error("Update blog error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update blog",
      },
      { status: 500 }
    );
  }
}


export async function DELETE(request: Request, context: RouteContext) {
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

    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    // Delete featured image from Cloudinary
    if (blog.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(blog.imagePublicId, {
          resource_type: "image",
        });
      } catch (cloudinaryError) {
        console.error(
          "Failed to delete blog image from Cloudinary:",
          cloudinaryError
        );
      }
    }

    // Delete blog from MongoDB
    await Blog.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Delete blog error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete blog",
      },
      { status: 500 }
    );
  }
}