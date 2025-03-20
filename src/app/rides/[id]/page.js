"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function RideDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/rides/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error("Ride not found.");
          router.push("/rides");
        } else {
          setRide(data);
        }
      })
      .catch(() => toast.error("Failed to load ride details."));
  }, [id, router]);

  const handleJoinRide = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/rides/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rideId: id }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Joined the ride successfully!");
        router.push("/dashboard/rider");
      } else {
        toast.error(data.error || "Failed to join ride.");
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
        <h2 className="text-2xl font-bold mb-6 text-center">Ride Details</h2>
        <p className="text-gray-600"><strong>Pickup:</strong> {ride.pickupLocation}</p>
        <p className="text-gray-600"><strong>Drop:</strong> {ride.dropLocation}</p>
        <p className="text-gray-600"><strong>Departure:</strong> {new Date(ride.departureTime).toLocaleString()}</p>
        <p className="text-gray-600"><strong>Seats Available:</strong> {ride.availableSeats}</p>
        <p className="text-gray-600"><strong>Vehicle:</strong> {ride.vehicleDetails}</p>
        <p className="text-gray-600"><strong>Driver:</strong> {ride.driver.name} ({ride.driver.email})</p>

        {ride.riders.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Riders</h3>
            <ul>
              {ride.riders.map((rider) => (
                <li key={rider._id}>{rider.name} ({rider.email})</li>
              ))}
            </ul>
          </div>
        )}

        <Button onClick={handleJoinRide} className="w-full bg-green-600 text-white mt-4" disabled={loading}>
          {loading ? "Joining..." : "Join Ride"}
        </Button>
      </div>
    </div>
  );
}
