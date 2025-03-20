import { dbConnect } from "@/lib/dbConnect";
import Ride from "@/models/Ride";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function DELETE(req) {
  try {
    await dbConnect();

    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const driverId = decoded.id;

    // Get rideId and riderId from request body
    const { rideId, riderId } = await req.json();
    if (!rideId || !riderId) return NextResponse.json({ error: "Ride ID and Rider ID are required" }, { status: 400 });

    // Find the ride
    const ride = await Ride.findById(rideId);
    if (!ride) return NextResponse.json({ error: "Ride not found" }, { status: 404 });

    // Ensure only the ride creator (driver) can remove a rider
    if (ride.driver.toString() !== driverId) {
      return NextResponse.json({ error: "You can only remove riders from your own rides" }, { status: 403 });
    }

    // Check if the rider is actually in the ride
    if (!ride.riders.includes(riderId)) {
      return NextResponse.json({ error: "Rider not found in this ride" }, { status: 400 });
    }

    // Remove rider from the ride and increase available seats
    ride.riders = ride.riders.filter(id => id.toString() !== riderId);
    ride.availableSeats += 1;
    await ride.save();

    return NextResponse.json({ message: "Rider removed successfully!" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
