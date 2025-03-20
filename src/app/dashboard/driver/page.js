"use client";
import { useState, useEffect } from "react";
import Link from "next/link"; // ✅ Add this import
import toast from "react-hot-toast";

export default function DriverDashboard() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    fetch("/api/rides/my-created-rides", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setRides(data))
      .catch(() => toast.error("Failed to load rides."));
  }, []);

  const handleDeleteRide = async (rideId) => {
    const confirmDelete = confirm("Are you sure you want to delete this ride?");
    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/rides/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rideId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Ride deleted successfully!");
        setRides((prevRides) => prevRides.filter((ride) => ride._id !== rideId));
      } else {
        toast.error(data.error || "Failed to delete ride.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Created Rides 🚗</h1>

        {/* ✅ Create Ride Button */}
        <Link
          href="/dashboard/driver/create-ride"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
        >
          + Create Ride
        </Link>
      </div>

      {rides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rides.map((ride) => (
            <div key={ride._id} className="border rounded-lg p-4 shadow-md bg-white">
              <h2 className="text-xl font-bold">{ride.pickupLocation} → {ride.dropLocation}</h2>
              <p className="text-gray-600">Departure: {new Date(ride.dateTime).toLocaleString()}</p>
              <p className="text-gray-600">Seats Available: {ride.availableSeats}</p>

              {/* Cancel Ride Button */}
              <button
                onClick={() => handleDeleteRide(ride._id)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 mt-4 w-full"
              >
                Cancel Ride
              </button>

              {/* Edit Ride Button */}
              <Link
                href={`/dashboard/driver/edit-ride/${ride._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 mt-2 block text-center"
              >
                Edit Ride
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No rides created yet.</p>
      )}
    </div>
  );
}
