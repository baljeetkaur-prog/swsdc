import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Query from "@/models/Query";


// ==========================================
// GET ALL QUERIES
// ==========================================
export async function GET() {
  try {
    await connectDB();

    const queries = await Query.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      queries,
    });
  } catch (error) {
    console.error("Failed to fetch queries:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch queries.",
      },
      {
        status: 500,
      }
    );
  }
}


// ==========================================
// CREATE QUERY
// ==========================================
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      message,
    } = body;

    // Basic validation
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const query = await Query.create({
      name,
      email,
      phone,
      message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Query saved successfully.",
        query,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Query API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save query.",
      },
      {
        status: 500,
      }
    );
  }
}
