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
    const riderId = decoded.id;

    // Fetch all rides the rider has joined
    const joinedRides = await Ride.find({ riders: riderId }).populate("driver", "name email");

    return NextResponse.json(joinedRides);
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
