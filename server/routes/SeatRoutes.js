const express = require("express");
const seatRouter = express.Router();
const { SeatModel } = require("../models/seatSchema");

// Book seats
const totalSeats = 80;
const seatsInRow = 7;
const lastRowSeats = 3;

const seats = new Array(totalSeats).fill(false);

const bookSeats = (seatCount) => {
  const result = [];
  for (let i = 0; i <= totalSeats - seatCount; i++) {
    let seatsPerRow = i < totalSeats - lastRowSeats ? seatsInRow : lastRowSeats;
    if (
      (i % seatsPerRow) + seatCount <= seatsPerRow &&
      seats.slice(i, i + seatCount).every((x) => x === false)
    ) {
      const newSeats = [...seats];
      for (let j = 0; j < seatCount; j++) {
        const seatIndex = i + j;
        newSeats[seatIndex] = true;
        const seatNumber = generateSeatNumber(seatIndex);
        result.push({ seatNumber: seatNumber, isAvailable: false });
      }
      seats.splice(0, totalSeats, ...newSeats);
      break;
    }
  }

  return result;
};

const generateSeatNumber = (seatIndex) => {
  return seatIndex + 1;
};

// Fetching the booked seats
seatRouter.get("/bookedseats", async (req, res) => {
  try {
    const bookedSeats = await SeatModel.find();
    res.status(200).send({ bookedSeats });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

// Delete all booked seats (RESET)
seatRouter.delete("/deleteall", async (req, res) => {
  try {
    await SeatModel.deleteMany({});
    seats.fill(false); // Reset the seats array
    res.status(200).send({ msg: "All Booked Seats Record Deleted" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

// Book seats ........................................................................
seatRouter.post("/booked", async (req, res) => {
  const seatCount = parseInt(req.body.noOfSeats);
  const newBookedSeats = bookSeats(seatCount);

  if (newBookedSeats.length > 0) {
    const seatDocuments = newBookedSeats.map((seat) => {
      return {
        seatNumber: seat.seatNumber,
        isAvailable: seat.isAvailable,
      };
    });

    try {
      const newSeatBook = new SeatModel({ seatNumber: seatDocuments });
      await newSeatBook.save();
      res.status(200).send({ msg: "New seats booked" });
    } catch (error) {
      res.status(400).json({ msg: error.message, msg1: "myname" });
    }
  } else {
    res.status(400).json({ error: "No seats available" });
  }
});

// *****************************************************

module.exports = {
  seatRouter,
};
