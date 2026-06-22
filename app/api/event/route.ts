import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Event from "@/lib/models/event";
import Venu from "@/lib/models/venu";

export async function POST(req: NextRequest) {
  try {
    const { artist, venu, description, date } = await req.json();

    if (!artist || !venu || !description || !date) {
      return NextResponse.json(
        {
          status: 400,
          message: "Please enter all mandatory fields",
        },
        { status: 400 },
      );
    }

    await dbConnect();

    const venuData =
      (await Venu.findById(venu)) ??
      (await Venu.findOne({
        $or: [{ address: venu }, { name: venu }],
      }));

    if (!venuData) {
      return NextResponse.json(
        {
          status: 404,
          message: "Venue not found",
        },
        { status: 404 },
      );
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        {
          status: 400,
          message: "Please enter a valid date",
        },
        { status: 400 },
      );
    }

    const slugBase = `${artist}-${venuData.name}-${parsedDate.toISOString().slice(0, 10)}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const slug = `${slugBase}-${Date.now()}`;

    const existingEvent = await Event.findOne({ slug });
    if (existingEvent) {
      return NextResponse.json(
        {
          status: 400,
          message: "Event already exists",
        },
        { status: 400 },
      );
    }

    const newEvent = new Event({
      artist,
      venu: venuData._id,
      description,
      date: parsedDate,
      slug,
    });

    await newEvent.save();

    return NextResponse.json(
      {
        status: 200,
        message: "Event created successfully",
        data: {
          _id: newEvent._id,
          artist: newEvent.artist,
          venu: venuData,
          description: newEvent.description,
          date: newEvent.date,
          slug: newEvent.slug,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    return NextResponse.json(
      {
        status: 500,
        message: err || "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
