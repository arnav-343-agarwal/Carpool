import { dbConnect } from "@/lib/dbConnect";
import Ride from "@/models/Ride";
import User from "@/models/User";  // ✅ Ensure User model is imported
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const rideId = params?.id;  // ✅ Correctly access params.id
    if (!rideId) return NextResponse.json({ error: "Ride ID is required" }, { status: 400 });

    // ✅ Populate driver and riders correctly
    const ride = await Ride.findById(rideId)
      .populate("driver", "name email") // ✅ Fetch driver name and email
      .populate("riders", "name email"); // ✅ Fetch riders name and email

    if (!ride) return NextResponse.json({ error: "Ride not found" }, { status: 404 });

    return NextResponse.json(ride);
  } catch (error) {
    console.error("🚨 Server Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
