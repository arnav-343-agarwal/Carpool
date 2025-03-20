import { dbConnect } from "@/lib/dbConnect";
import Ride from "@/models/Ride";
import User from "@/models/User";
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

    // Find ride
    const ride = await Ride.findById(rideId);
    if (!ride) return NextResponse.json({ error: "Ride not found" }, { status: 404 });

    // Prevent driver from joining their own ride
    if (ride.driver.toString() === riderId) {
      return NextResponse.json({ error: "Drivers cannot join their own rides" }, { status: 403 });
    }

    // Check if the rider has already joined the ride
    if (ride.riders.includes(riderId)) {
      return NextResponse.json({ error: "You have already joined this ride" }, { status: 400 });
    }

    // Check if seats are available
    if (ride.availableSeats <= 0) {
      return NextResponse.json({ error: "No seats available" }, { status: 400 });
    }

    // Add rider to ride and reduce available seats
    ride.riders.push(riderId);
    ride.availableSeats -= 1;
    await ride.save();

    return NextResponse.json({ message: "Successfully joined the ride!" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
