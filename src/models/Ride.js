import mongoose from "mongoose";

const RideSchema = new mongoose.Schema({
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  pickupLocation: { type: String, required: true },
  dropLocation: { type: String, required: true },
  departureTime: { type: Date, required: true },
  availableSeats: { type: Number, required: true },
  vehicleDetails: { type: String, required: true },
  riders: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Ride = mongoose.models.Ride || mongoose.model("Ride", RideSchema);
export default Ride;
