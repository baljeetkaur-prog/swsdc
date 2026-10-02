import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";
import Course from "@/models/Course";

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
      courseName,
      category,
      duration,
      keyFeatures,
      description,
      curriculum,
      mentor,
      thumbnail,
      thumbnailPublicId,
      video,
      videoPublicId,
      slug,
    } = body;

    if (
      !courseName ||
      !category ||
      !duration ||
      !description ||
      !slug ||
      !thumbnail ||
      !video ||
      !mentor?.name ||
      !mentor?.designation ||
      !mentor?.about ||
      !mentor?.image
    ) {
      return Response.json(
        {
          success: false,
          message: "All required fields are required",
        },
        { status: 400 }
      );
    }

    const existingCourse = await Course.findOne({
      slug,
    });

    if (existingCourse) {
      return Response.json(
        {
          success: false,
          message: "A course with this name already exists",
        },
        { status: 409 }
      );
    }

    const course = await Course.create({
      courseName,
      category,
      duration,
      keyFeatures,
      description,
      curriculum,

      mentor: {
        name: mentor.name,
        designation: mentor.designation,
        about: mentor.about,
        image: mentor.image,
        imagePublicId: mentor.imagePublicId,
      },

      thumbnail,
      thumbnailPublicId,

      video,
      videoPublicId,

      slug,
    });

    return Response.json(
      {
        success: true,
        message: "Course added successfully",
        course,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create course error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to create course",
      },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    await connectDB();

    const courses = await Course.find({})
      .sort({ createdAt: -1 })
      .select(
        "_id courseName category duration keyFeatures thumbnail video slug"
      );

    return Response.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("Fetch courses error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch courses",
      },
      { status: 500 }
    );
  }
}