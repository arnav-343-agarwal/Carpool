import { dbConnect } from "@/lib/dbConnect";
import Ride from "@/models/Ride";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();

    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const driverId = decoded.id;

    // Fetch all rides created by this driver
    const createdRides = await Ride.find({ driver: driverId }).populate("riders", "name email");

    return NextResponse.json(createdRides);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
