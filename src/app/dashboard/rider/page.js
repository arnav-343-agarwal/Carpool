"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function RiderDashboard() {
  const [user, setUser] = useState(null);
  const [rides, setRides] = useState([]);

  useEffect(() => {
    // Fetch user details
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          toast.error("Failed to load user details.");
        }
      })
      .catch(() => toast.error("Failed to load user details."));

    // Fetch joined rides
    fetch("/api/rides/my-rides", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setRides(data))
      .catch(() => toast.error("Failed to load rides."));
  }, []);

  const handleLeaveRide = async (rideId) => {
    const confirmLeave = confirm("Are you sure you want to leave this ride?");
    if (!confirmLeave) return;

    try {
      const res = await fetch("/api/rides/leave", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rideId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Successfully left the ride!");
        setRides((prevRides) => prevRides.filter((ride) => ride._id !== rideId));
      } else {
        toast.error(data.error || "Failed to leave ride.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-6">
      {/* Rider Info Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold">Your Information</h2>
        <p><strong>Name:</strong> {user.name || "N/A"}</p>
        <p><strong>Email:</strong> {user.email || "N/A"}</p>
        <p><strong>Role:</strong> Rider</p>
      </div>

      <h1 className="text-3xl font-bold mb-6">Your Joined Rides 🚗</h1>
      {rides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rides.map((ride) => (
            <div key={ride._id} className="border rounded-lg p-4 shadow-md bg-white">
              <h2 className="text-xl font-bold">{ride.pickupLocation} → {ride.dropLocation}</h2>
              <p className="text-gray-600">Departure: {new Date(ride.departureTime).toLocaleString()}</p>
              
              {/* ✅ Leave Ride Button */}
              <Button
                onClick={() => handleLeaveRide(ride._id)}
                className="mt-3 w-full bg-red-600 text-white hover:bg-red-500"
              >
                Leave Ride
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p>No rides joined yet.</p>
      )}
    </div>
  );
}
