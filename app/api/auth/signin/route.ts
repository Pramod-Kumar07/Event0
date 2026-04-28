import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import UserModel from "@/lib/models/user";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { status: 400, message: "Enter email and password" },
        { status: 400 },
      );
    }
    await dbConnect();
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized" },
        { status: 401 },
      );
    }
    const cookieStore = await cookies();
    cookieStore.set("session", "xxxx", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
    });
    return NextResponse.json(
      {
        status: 200,
        message: "Logged in successfully",
        data: existingUser,
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        status: 500,
        message: err || "Something went wrong!",
      },
      { status: 500 },
    );
  }
}
