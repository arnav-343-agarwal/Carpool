"use client";
import { useState, useEffect } from "react";
import Link from "next/link"; 
import toast from "react-hot-toast";

export default function AvailableRides() {
  const [rides, setRides] = useState([]);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [sortOption, setSortOption] = useState("departure"); // Default sort

  // Fetch rides from API
  const fetchRides = () => {
    let url = "/api/rides/available";
    if (pickupLocation || dropLocation) {
      url += `?pickupLocation=${pickupLocation}&dropLocation=${dropLocation}`;
    }

    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRides(data);
        } else {
          toast.error("Failed to load rides.");
        }
      })
      .catch(() => toast.error("Failed to load rides."));
  };

  useEffect(() => {
    fetchRides();
  }, []);

  // Sorting Function
  const sortedRides = [...rides].sort((a, b) => {
    if (sortOption === "departure") {
      return new Date(a.departureTime) - new Date(b.departureTime);
    }
    if (sortOption === "seats") {
      return b.availableSeats - a.availableSeats;
    }
    return 0;
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Find a Ride 🚗</h1>

      {/* Search Form */}
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Pickup Location"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          className="w-full md:w-1/3 p-2 border rounded-md"
        />
        <input
          type="text"
          placeholder="Drop Location"
          value={dropLocation}
          onChange={(e) => setDropLocation(e.target.value)}
          className="w-full md:w-1/3 p-2 border rounded-md"
        />
        <button
          onClick={fetchRides}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500"
        >
          Search
        </button>
      </div>

      {/* Sorting Dropdown */}
      <div className="mb-4 flex items-center gap-4">
        <label className="font-bold">Sort By:</label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="departure">Departure Time (Earliest First)</option>
          <option value="seats">Available Seats (Most First)</option>
        </select>
      </div>

      {/* Rides List */}
      {sortedRides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRides.map((ride) => (
            <div key={ride._id} className="border rounded-lg p-4 shadow-md bg-white">
              <h2 className="text-xl font-bold">{ride.pickupLocation} → {ride.dropLocation}</h2>
              <p className="text-gray-600">Departure: {new Date(ride.departureTime).toLocaleString()}</p>
              <p className="text-gray-600">Seats Available: {ride.availableSeats}</p>

              {/* Ride Details Button */}
              <Link
                href={`/rides/${ride._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 mt-2 block text-center"
              >
                Ride Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No rides available at the moment.</p>
      )}
    </div>
  );
}
