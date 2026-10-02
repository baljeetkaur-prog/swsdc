import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

// GET - Fetch single blog by slug
export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    await connectDB();

    const { slug } = await params;

    const blog = await Blog.findOne({
      slug: slug.toLowerCase(),
    });

    if (!blog) {
      return Response.json(
        {
          success: false,
          message: "Blog not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Fetch blog error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch blog",
      },
      { status: 500 }
    );
  }
}