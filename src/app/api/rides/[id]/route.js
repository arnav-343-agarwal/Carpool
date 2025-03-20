import { dbConnect } from "@/lib/dbConnect";
import Ride from "@/models/Ride";
import User from "@/models/User";  
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const rideId = params?.id;  
    if (!rideId) return NextResponse.json({ error: "Ride ID is required" }, { status: 400 });

    const ride = await Ride.findById(rideId)
      .populate("driver", "name email") 
      .populate("riders", "name email"); 

    if (!ride) return NextResponse.json({ error: "Ride not found" }, { status: 404 });

    return NextResponse.json(ride);
  } catch (error) {
    console.error("🚨 Server Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
