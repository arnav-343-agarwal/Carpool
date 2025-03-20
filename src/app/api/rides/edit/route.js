import { dbConnect } from "@/lib/dbConnect";
import Ride from "@/models/Ride";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PUT(req) {
  try {
    await dbConnect();

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "driver") {
      return NextResponse.json({ error: "Only drivers can edit rides" }, { status: 403 });
    }

    const { rideId, pickupLocation, dropLocation, dateTime, availableSeats, vehicleDetails } = await req.json();
    if (!rideId) return NextResponse.json({ error: "Ride ID is required" }, { status: 400 });

    const ride = await Ride.findById(rideId);
    if (!ride) return NextResponse.json({ error: "Ride not found" }, { status: 404 });

    if (ride.driver.toString() !== decoded.id) {
      return NextResponse.json({ error: "You can only edit your own rides" }, { status: 403 });
    }

    // ✅ Update ride details
    ride.pickupLocation = pickupLocation;
    ride.dropLocation = dropLocation;
    ride.dateTime = dateTime;
    ride.availableSeats = availableSeats;
    ride.vehicleDetails = vehicleDetails;

    await ride.save();
    return NextResponse.json({ message: "Ride updated successfully", ride });
  } catch (error) {
    console.error("🚨 Server Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
