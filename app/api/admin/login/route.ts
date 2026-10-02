import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Username and password are required.",
        },
        { status: 400 }
      );
    }

    let admin = await Admin.findOne({ username });

    /*
     * Create the initial admin account from .env
     * if no admin exists in MongoDB.
     */
    if (!admin) {
      const envUsername = process.env.ADMIN_USERNAME;
      const envPassword = process.env.ADMIN_PASSWORD;

      if (
        !envUsername ||
        !envPassword ||
        username !== envUsername ||
        password !== envPassword
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid username or password.",
          },
          { status: 401 }
        );
      }

      const hashedPassword = await bcrypt.hash(
        envPassword,
        12
      );

      admin = await Admin.create({
        username: envUsername,
        password: hashedPassword,
      });
    } else {
      const passwordMatch = await bcrypt.compare(
        password,
        admin.password
      );

      if (!passwordMatch) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid username or password.",
          },
          { status: 401 }
        );
      }
    }

    const token = createToken({
      username: admin.username,
      role: "admin",
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
    });

    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}