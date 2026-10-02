import { connectDB } from "@/lib/mongodb";
import SEOSettings from "@/models/SEOSettings";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const settings = await SEOSettings.findOne();

    if (!settings) {
      const newSettings = await SEOSettings.create({});

      return Response.json({
        success: true,
        settings: newSettings,
      });
    }

    return Response.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Fetch SEO settings error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch SEO settings",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    // Check admin authentication
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

    const settings = await SEOSettings.findOneAndUpdate(
      {},
      {
        $set: body,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return Response.json({
      success: true,
      message: "SEO settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error("Update SEO settings error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to update SEO settings",
      },
      { status: 500 }
    );
  }
}