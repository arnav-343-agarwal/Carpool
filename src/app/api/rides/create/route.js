import { dbConnect } from "@/lib/dbConnect";
import Ride from "@/models/Ride";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await dbConnect();

    // Get token from cookies
    const token = req.cookies.get("token")?.value;
    if (!token) {
      console.log("🚨 No token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "driver") {
      console.log("🚨 Unauthorized access attempt by non-driver");
      return NextResponse.json({ error: "Only drivers can create rides" }, { status: 403 });
    }

    // Get ride data from request body
    const { pickupLocation, dropLocation, dateTime, availableSeats, vehicleDetails } = await req.json();

    if (!pickupLocation || !dropLocation || !dateTime || !availableSeats || !vehicleDetails) {
      console.log("🚨 Missing required fields:", { pickupLocation, dropLocation, dateTime, availableSeats, vehicleDetails });
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Ensure `dateTime` is a valid date
    const departureTime = new Date(dateTime);
    if (isNaN(departureTime.getTime())) {
      console.log("🚨 Invalid departureTime:", dateTime);
      return NextResponse.json({ error: "Invalid departure time" }, { status: 400 });
    }

    // Create new ride
    const newRide = new Ride({
      driver: decoded.id,
      pickupLocation,
      dropLocation,
      departureTime,
      availableSeats,
      vehicleDetails,
    });

    await newRide.save();
    console.log("Ride created successfully!", newRide);

    return NextResponse.json({ message: "Ride created successfully!" });
  } catch (error) {
    console.error("🚨 Server Error:", error); // Log full error details
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}
