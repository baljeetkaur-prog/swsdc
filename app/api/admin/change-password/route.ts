import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { getAdminFromRequest } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const adminData = getAdminFromRequest(request);

    if (!adminData) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const {
      currentPassword,
      newPassword,
    } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Current password and new password are required.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          message:
            "New password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({
      username: adminData.username,
    });

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin account not found.",
        },
        { status: 404 }
      );
    }

    const passwordMatch = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is incorrect.",
        },
        { status: 400 }
      );
    }

    const samePassword = await bcrypt.compare(
      newPassword,
      admin.password
    );

    if (samePassword) {
      return NextResponse.json(
        {
          success: false,
          message:
            "New password must be different from the current password.",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      12
    );

    admin.password = hashedPassword;

    await admin.save();

    return NextResponse.json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}