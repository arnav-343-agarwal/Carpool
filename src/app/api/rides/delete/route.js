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

    // Get rideId from request body
    const { rideId } = await req.json();
    if (!rideId) return NextResponse.json({ error: "Ride ID is required" }, { status: 400 });

    // Find the ride
    const ride = await Ride.findById(rideId);
    if (!ride) return NextResponse.json({ error: "Ride not found" }, { status: 404 });

    // Ensure only the ride creator (driver) can delete it
    if (ride.driver.toString() !== driverId) {
      return NextResponse.json({ error: "You can only delete your own rides" }, { status: 403 });
    }

    // Delete the ride
    await ride.deleteOne();

    return NextResponse.json({ message: "Ride deleted successfully!" });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
