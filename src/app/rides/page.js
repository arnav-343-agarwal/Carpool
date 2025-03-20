"use client"; // ✅ Required for useState & useEffect in Next.js App Router
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import RideCard from "@/components/RideCard";

export default function AvailableRides() {
  const [rides, setRides] = useState([]);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");

  // Fetch Rides Function
  const fetchRides = async () => {
    let url = `/api/rides/available`;
    if (pickupLocation || dropLocation) {
      url += `?pickupLocation=${pickupLocation}&dropLocation=${dropLocation}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      setRides(data);
    } catch (error) {
      console.error("Error fetching rides:", error);
    }
  };

  useEffect(() => {
    fetchRides(); // Fetch rides when page loads
  }, []);

  return (
    <main className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Available Rides 🚗</h1>

      {/* 🔍 Search Form */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Pickup Location"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          className="p-2 border rounded-md w-full"
        />
        <input
          type="text"
          placeholder="Drop Location"
          value={dropLocation}
          onChange={(e) => setDropLocation(e.target.value)}
          className="p-2 border rounded-md w-full"
        />
        <Button onClick={fetchRides} className="bg-indigo-600 text-white">
          Search
        </Button>
      </div>

      {/* 🚗 Ride Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rides.length > 0 ? (
          rides.map((ride) => <RideCard key={ride._id} ride={ride} />)
        ) : (
          <p>No rides available at the moment.</p>
        )}
      </div>
    </main>
  );
}
