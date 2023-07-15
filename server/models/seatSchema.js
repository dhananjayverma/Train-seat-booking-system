const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    seatNumber: [
      {
        seatNumber: { type: String, required: true },
        isAvailable: { type: Boolean, required: true },
      },
    ],
  },
  {
    versionKey: false,
  }
);

const SeatModel = mongoose.model("Seats", seatSchema);

module.exports = {
  SeatModel,
};
