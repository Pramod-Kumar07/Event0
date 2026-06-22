import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import UserModel from "@/lib/models/user";
import { passwordHash } from "@/utils/utils";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          status: 400,
          message: "Email and new password are required",
        },
        { status: 400 },
      );
    }

    await dbConnect();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          status: 404,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    user.password = await passwordHash(password);
    await user.save();

    return NextResponse.json(
      {
        status: 200,
        message: "Password updated successfully",
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        status: 500,
        message: err || "Something went wrong",
      },
      { status: 500 },
    );
  }
}
