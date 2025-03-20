"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function RiderDashboard() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    fetch("/api/rides/my-rides", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setRides(data))
      .catch(() => toast.error("Failed to load rides."));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Joined Rides 🚗</h1>
      {rides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rides.map((ride) => (
            <div key={ride._id} className="border rounded-lg p-4 shadow-md bg-white">
              <h2 className="text-xl font-bold">{ride.pickupLocation} → {ride.dropLocation}</h2>
              <p className="text-gray-600">Departure: {new Date(ride.departureTime).toLocaleString()}</p>
              <Button className="mt-3 w-full bg-red-600 text-white">Leave Ride</Button>
            </div>
          ))}
        </div>
      ) : (
        <p>No rides joined yet.</p>
      )}
    </div>
  );
}
