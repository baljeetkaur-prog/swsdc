import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";
import Blog from "@/models/Blog";

// POST - Create a new blog
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
      return Response.json(
        {
          success: false,
          message: "All required fields are required",
        },
        { status: 400 }
      );
    }

    // Check duplicate slug
    const existingBlog = await Blog.findOne({
      slug: slug.trim().toLowerCase(),
    });

    if (existingBlog) {
      return Response.json(
        {
          success: false,
          message: "A blog with this slug already exists",
        },
        { status: 409 }
      );
    }

    // Create blog
    const blog = await Blog.create({
      blogName: blogName.trim(),

      slug: slug.trim().toLowerCase(),

      image: image.trim(),
      imagePublicId: imagePublicId.trim(),

      metaTitle: metaTitle.trim(),
      metaDescription: metaDescription.trim(),

      keywords: Array.isArray(keywords)
        ? keywords
            .map((keyword: string) => keyword.trim())
            .filter(Boolean)
        : [],

      shortDescription: shortDescription.trim(),

      category: category.trim(),

      tags: Array.isArray(tags)
        ? tags
            .map((tag: string) => tag.trim())
            .filter(Boolean)
        : [],

      content,
    });

    return Response.json(
      {
        success: true,
        message: "Blog added successfully",
        blog,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create blog error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create blog",
      },
      { status: 500 }
    );
  }
}

// GET - Fetch all blogs
export async function GET() {
  try {
    await connectDB();

    const blogs = await Blog.find({})
      .sort({ date: -1 })
      .select(
        "_id blogName slug image imagePublicId metaTitle metaDescription keywords shortDescription date category tags"
      );

    return Response.json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Fetch blogs error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch blogs",
      },
      { status: 500 }
    );
  }
}