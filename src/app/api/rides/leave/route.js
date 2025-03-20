import { dbConnect } from "@/lib/dbConnect";
import Ride from "@/models/Ride";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();

    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const riderId = decoded.id;

    // Get rideId from request body
    const { rideId } = await req.json();
    if (!rideId) return NextResponse.json({ error: "Ride ID is required" }, { status: 400 });

    // Find the ride
    const ride = await Ride.findById(rideId);
    if (!ride) return NextResponse.json({ error: "Ride not found" }, { status: 404 });

    // Ensure the rider is part of the ride
    if (!ride.riders.includes(riderId)) {
      return NextResponse.json({ error: "You are not part of this ride" }, { status: 400 });
    }

    // Remove rider from the ride and update available seats
    ride.riders = ride.riders.filter(id => id.toString() !== riderId);
    ride.availableSeats += 1;
    await ride.save();

    return NextResponse.json({ message: "Successfully left the ride!" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
