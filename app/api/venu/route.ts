import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import Venu from "@/lib/models/venu";

export async function GET() {
  try {
    await dbConnect();

    const venues = await Venu.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        status: 200,
        message: "Venues fetched successfully.",
        data: venues.map((venue) => ({
          _id: venue._id,
          name: venue.name,
          address: venue.address,
          state: venue.state,
        })),
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

export async function POST(req: NextRequest) {
  try {
    const { name, address, state } = await req.json();
    if (!name || !address || !state) {
      return NextResponse.json(
        { status: 400, message: "Please enter mandatory fields" },
        { status: 400 },
      );
    }
    await dbConnect();
    const existingVenu = await Venu.findOne({ name });
    if (existingVenu) {
      return NextResponse.json(
        { status: 400, message: "Venu already exists." },
        { status: 400 },
      );
    }
    const newVenu = new Venu({
      name,
      address,
      state,
    });
    await newVenu.save();
    return NextResponse.json(
      {
        status: 200,
        message: "Venu added successfully.",
        data: { name, address, state },
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
