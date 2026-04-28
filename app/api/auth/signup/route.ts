import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import UserModel from "@/lib/models/user";
import { passwordHash } from "@/utils/utils";

export async function POST(req: NextRequest) {
  try {
    const { firstname, lastname, email, contactnumber, dob, password } =
      await req.json();
    if (
      !firstname ||
      !lastname ||
      !email ||
      !contactnumber ||
      !dob ||
      !password
    ) {
      return NextResponse.json(
        {
          status: 400,
          messgae: "Please fill all fields",
        },
        { status: 400 },
      );
    }
    await dbConnect();
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          status: 400,
          message: "User already exists",
        },
        { status: 400 },
      );
    }

    const hashedPAssword = await passwordHash(password);
    const newUser = new UserModel({
      firstname,
      lastname,
      contactnumber,
      dob,
      email,
      password: hashedPAssword,
    });

    await newUser.save();
    return NextResponse.json(
      {
        status: 200,
        message: "User created successfully",
        data: newUser,
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
