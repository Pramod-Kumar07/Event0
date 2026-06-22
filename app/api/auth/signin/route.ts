import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import UserModel from "@/lib/models/user";
import { cookies } from "next/headers";
import { passwordCheck } from "@/utils/utils";

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
    const passCheck = await passwordCheck(password, existingUser?.password);
    if (!passCheck) {
      return NextResponse.json(
        { status: 401, message: "Unauthorized" },
        { status: 401 },
      );
    }
    const cookieStore = await cookies();
    const sessionData = JSON.stringify({
      token: "xxxx",
      isAuthenticated: true,
    });
    cookieStore.set("session", sessionData, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
    });
    const userData = {
      _id: existingUser?._id,
      firstname: existingUser?.firstname,
      lastname: existingUser?.lastname,
      contactnumber: existingUser?.contactnumber,
      dob: existingUser?.dob,
      email: existingUser?.email,
      createdAt: existingUser?.createdAt,
      updatedAt: existingUser?.updatedAt,
    };

    return NextResponse.json(
      {
        status: 200,
        message: "Logged in successfully",
        data: userData,
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
