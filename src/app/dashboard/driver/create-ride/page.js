"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function CreateRidePage() {
  const router = useRouter();
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [availableSeats, setAvailableSeats] = useState(1);
  const [dateTime, setDateTime] = useState("");
  const [vehicleDetails, setVehicleDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateRide = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/rides/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pickupLocation, dropLocation, availableSeats, dateTime, vehicleDetails }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Ride created successfully!");
        router.push("/dashboard/driver");
      } else {
        toast.error(data.error || "Failed to create ride.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create a Ride</h2>
        <form onSubmit={handleCreateRide} className="space-y-4">
          {/* Pickup Location */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Pickup Location</label>
            <input
              type="text"
              placeholder="Enter pickup location"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Drop Location */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Drop Location</label>
            <input
              type="text"
              placeholder="Enter drop location"
              value={dropLocation}
              onChange={(e) => setDropLocation(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Available Seats */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Available Seats</label>
            <input
              type="number"
              placeholder="Enter available seats"
              value={availableSeats}
              onChange={(e) => setAvailableSeats(e.target.value)}
              className="w-full p-2 border rounded-md"
              min="1"
              required
            />
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Departure Time</label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Vehicle Details */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Vehicle Details</label>
            <input
              type="text"
              placeholder="E.g., Honda Civic, Black"
              value={vehicleDetails}
              onChange={(e) => setVehicleDetails(e.target.value)}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-500" disabled={loading}>
            {loading ? "Creating Ride..." : "Create Ride"}
          </Button>
        </form>
      </div>
    </div>
  );
}
