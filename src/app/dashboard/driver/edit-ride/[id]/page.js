"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function EditRidePage() {
  const router = useRouter();
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/rides/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error("Ride not found.");
          router.push("/dashboard/driver");
        } else {
          setRide(data);
        }
      })
      .catch(() => toast.error("Failed to load ride details."));
  }, [id, router]);

  const handleRemoveRider = async (riderId) => {
    const confirmRemove = confirm("Are you sure you want to remove this rider?");
    if (!confirmRemove) return;

    try {
      const res = await fetch("/api/rides/remove-rider", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rideId: id, riderId }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Rider removed successfully!");
        setRide((prevRide) => ({
          ...prevRide,
          riders: prevRide.riders.filter((r) => r._id !== riderId),
          availableSeats: prevRide.availableSeats + 1, // Increase available seats
        }));
      } else {
        toast.error(data.error || "Failed to remove rider.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  const handleUpdateRide = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/rides/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...ride, rideId: id }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Ride updated successfully!");
        router.push("/dashboard/driver");
      } else {
        toast.error(data.error || "Failed to update ride.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
    }

    setLoading(false);
  };

  if (!ride) return <p>Loading ride details...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Ride</h2>
        <form onSubmit={handleUpdateRide} className="space-y-4">
          <label className="block text-gray-700 font-medium">Pickup Location</label>
          <input
            type="text"
            value={ride.pickupLocation}
            onChange={(e) => setRide({ ...ride, pickupLocation: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />

          <label className="block text-gray-700 font-medium">Drop Location</label>
          <input
            type="text"
            value={ride.dropLocation}
            onChange={(e) => setRide({ ...ride, dropLocation: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />

          <label className="block text-gray-700 font-medium">Available Seats</label>
          <input
            type="number"
            value={ride.availableSeats}
            onChange={(e) => setRide({ ...ride, availableSeats: e.target.value })}
            className="w-full p-2 border rounded-md"
            min="1"
            required
          />

          <label className="block text-gray-700 font-medium">Departure Time</label>
          <input
            type="datetime-local"
            value={ride.dateTime}
            onChange={(e) => setRide({ ...ride, dateTime: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />

          <label className="block text-gray-700 font-medium">Vehicle Details</label>
          <input
            type="text"
            value={ride.vehicleDetails}
            onChange={(e) => setRide({ ...ride, vehicleDetails: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />

          <Button type="submit" className="w-full bg-blue-600 text-white mt-4" disabled={loading}>
            {loading ? "Updating Ride..." : "Update Ride"}
          </Button>
        </form>

        {/* Rider List with Remove Button */}
        {ride.riders.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-700">Riders</h3>
            <ul>
              {ride.riders.map((rider) => (
                <li key={rider._id} className="flex justify-between items-center border-b py-2">
                  <span>{rider.name} ({rider.email})</span>
                  <button
                    onClick={() => handleRemoveRider(rider._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-400"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
