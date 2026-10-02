import { connectDB } from "@/lib/mongodb";
import Course from "@/models/Course";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    await connectDB();

    const { slug } = await context.params;

    const course = await Course.findOne({
      slug: slug.toLowerCase(),
    });

    if (!course) {
      return Response.json(
        {
          success: false,
          message: "Course not found",
        },
        { status: 404 }
      );
    }

    return Response.json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Fetch course by slug error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch course",
      },
      { status: 500 }
    );
  }
}
