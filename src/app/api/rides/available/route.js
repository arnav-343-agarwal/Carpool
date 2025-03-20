import { dbConnect } from "@/lib/dbConnect";
import Ride from "@/models/Ride";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    // Extract search params (optional filtering by pickup/drop location)
    const { searchParams } = new URL(req.url);
    const pickupLocation = searchParams.get("pickupLocation");
    const dropLocation = searchParams.get("dropLocation");

    // Create query based on filters
    let query = { availableSeats: { $gt: 0 } }; // Only show rides with available seats
    if (pickupLocation) query.pickupLocation = new RegExp(pickupLocation, "i");
    if (dropLocation) query.dropLocation = new RegExp(dropLocation, "i");

    // Fetch available rides
    const rides = await Ride.find(query).populate({
        path: "driver",
        model: User, // Ensure model is referenced correctly
        select: "name email",
    });

    return NextResponse.json(rides);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
