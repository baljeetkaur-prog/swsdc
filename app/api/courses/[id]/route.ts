import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";
import Course from "@/models/Course";
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

    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("Fetch course error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch course",
      },
      { status: 500 }
    );
  }
}
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
      return NextResponse.json(
        {
          success: false,
          message: "All required fields are required",
        },
        { status: 400 }
      );
    }

    const existingCourse = await Course.findById(id);

    if (!existingCourse) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found",
        },
        { status: 404 }
      );
    }

    const duplicateCourse = await Course.findOne({
      slug,
      _id: { $ne: id },
    });

    if (duplicateCourse) {
      return NextResponse.json(
        {
          success: false,
          message: "Another course already uses this slug",
        },
        { status: 409 }
      );
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      {
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
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Update course error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update course",
      },
      { status: 500 }
    );
  }
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

    const course = await Course.findById(id);

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found",
        },
        { status: 404 }
      );
    }

    // Delete mentor image
    if (course.mentor?.imagePublicId) {
      await cloudinary.uploader.destroy(
        course.mentor.imagePublicId,
        {
          resource_type: "image",
        }
      );
    }

    // Delete course thumbnail
    if (course.thumbnailPublicId) {
      await cloudinary.uploader.destroy(
        course.thumbnailPublicId,
        {
          resource_type: "image",
        }
      );
    }

    // Delete course video
    if (course.videoPublicId) {
      await cloudinary.uploader.destroy(
        course.videoPublicId,
        {
          resource_type: "video",
        }
      );
    }

    // Delete course from MongoDB
    await Course.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete course",
      },
      { status: 500 }
    );
  }
}