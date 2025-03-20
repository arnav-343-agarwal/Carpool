"use client"; 
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // ✅ For redirecting to login
import toast from "react-hot-toast";

const RideCard = ({ ride }) => {
  const [availableSeats, setAvailableSeats] = useState(ride.availableSeats);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleJoinRide = async () => {
    if (availableSeats <= 0) {
      toast.error("No seats available!");
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch(`/api/rides/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ✅ Sends authentication token via cookies
        body: JSON.stringify({ rideId: ride._id }),
      });

      const data = await res.json();

      if (res.ok) {
        setAvailableSeats((prev) => prev - 1);
        toast.success("You have successfully joined the ride!");
      } else if (res.status === 401) {
        toast.error("You need to log in first!");
        router.push("/login"); // ✅ Redirect to login page
      } else {
        toast.error(data.error || "Failed to join ride.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="border rounded-lg p-4 shadow-md bg-white dark:bg-gray-800">
      <h2 className="text-xl font-bold">
        {ride.pickupLocation} → {ride.dropLocation}
      </h2>
      <p className="text-gray-600 dark:text-gray-300">
        Departure: {new Date(ride.departureTime).toLocaleString()}
      </p>
      <p className="text-gray-700 dark:text-gray-400">
        Seats Left: {availableSeats}
      </p>
      <Button
        onClick={handleJoinRide}
        className="mt-3 w-full bg-indigo-600 text-white"
        disabled={availableSeats === 0 || loading}
      >
        {loading ? "Joining..." : availableSeats > 0 ? "Join Ride" : "Full"}
      </Button>
    </div>
  );
};

export default RideCard;
