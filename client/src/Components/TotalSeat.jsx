import axios from "axios";
import React, { useState, useEffect } from "react";
import "./Style.css";

function SeatBooking() {
  // Constants
  const totalSeats = 80;
  const seatsInRow = 7;
  const maxSeatsPerBooking = 7;

  // State variables
  const [seats, setSeats] = useState(new Array(totalSeats).fill(false));
  const [bookedSeats, setBookedSeats] = useState([]);
  const [seatCount, setSeatCount] = useState("");
  const [alert, setAlert] = useState("");

  // Fetch initially booked seats on component mount
  useEffect(() => {
    fetchBookedSeats();
  }, []);

  // Function to fetch booked seats from the server
  const fetchBookedSeats = () => {
    axios
      .get("https://trainapi-zupt.onrender.com/bookedseats")
      .then((response) => {
        console.log(response.data.bookedSeats);
        // Update seat availability based on the response
        let bookedSeatsLength = response.data.bookedSeats.length;
        for (let i = 0; i < bookedSeatsLength; i++) {
          const newSeats = [...seats];
          let seatNumbers = response.data.bookedSeats[i].seatNumber;
          if (seatNumbers) {
            seatNumbers.forEach((seatNumber) => {
              const seatIndex = getSeatIndex(seatNumber.seatNumber);
              if (seatIndex !== -1) {
                newSeats[seatIndex] = true;
              }
            });
          }
          setSeats(newSeats);
          setBookedSeats(seatNumbers || []);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlert("Something went wrong. Please try again later.");
        setTimeout(() => {
          setAlert("");
        }, 3000);
      });
  };

  // Function to handle resetting the system
  const handleReset = () => {
    axios
      .delete("https://trainapi-zupt.onrender.com/deleteall")
      .then((response) => {
        console.log(response.data);
        setAlert(`${response.data.msg}`);
        setTimeout(() => {
          setAlert("");
        }, 3000);
        setSeats(new Array(totalSeats).fill(false));
        setBookedSeats([]);
      })
      .catch((error) => {
        console.error("Error:", error);
        setAlert("Something went wrong. Please try again later.");
        setTimeout(() => {
          setAlert("");
        }, 3000);
      });
  };

  // Function to handle seat booking
  const handleSeatBooking = () => {
    if (seatCount === "" || parseInt(seatCount) <= 0) {
      setAlert("Please enter a valid number of seats");
      setTimeout(() => {
        setAlert("");
      }, 3000);
      return;
    } else if (parseInt(seatCount) > maxSeatsPerBooking) {
      setAlert(`You can book only ${maxSeatsPerBooking} seats at a time`);
      setTimeout(() => {
        setAlert("");
      }, 3000);
      return;
    }

    axios
      .post("https://trainapi-zupt.onrender.com/booked", {
        noOfSeats: parseInt(seatCount),
      })
      .then((response) => {
        console.log(response.data);
        setAlert(`${seatCount} seat(s) booked successfully`);
        setTimeout(() => {
          setAlert("");
        }, 3000);
        fetchBookedSeats();
      })
      .catch((error) => {
        console.error("Error:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setAlert(error.response.data.error);
        } else {
          setAlert("Something went wrong. Please try again later.");
        }
        setTimeout(() => {
          setAlert("");
        }, 3000);
      });
  };

  // Function to generate seat number based on index
  const generateSeatNumber = (seatIndex) => {
    return (seatIndex + 1).toString();
  };

  // Function to get the index of a seat number
  const getSeatIndex = (seatNumber) => {
    for (let i = 0; i < totalSeats; i++) {
      if (generateSeatNumber(i) === seatNumber) {
        return i;
      }
    }
    return -1;
  };

  // Function to handle input change
  const handleChange = (event) => {
    setSeatCount(event.target.value);
  };

  // Calculate available and remaining seats
  const availableSeats = seats.reduce(
    (count, isBooked) => (isBooked ? count : count + 1),
    0
  );
  const restSeats =  totalSeats - bookedSeats.length * maxSeatsPerBooking - availableSeats;

  return (
    <div className="mydiv1">

      <h1 className="header">Seat Booking System</h1>

      {/* Input for seat count */}
      <p className="h1">Enter the number of seats:</p>
      <input
        type="number"
        value={seatCount}
        onChange={handleChange}
        placeholder={`No. of seats you want to book. Max: ${maxSeatsPerBooking}`}
        className="input1"
        max={maxSeatsPerBooking}
      />

]
      <button className="btn1" onClick={handleSeatBooking}>
        Reserve
      </button>
      <br />

    
      <button className="btn2" onClick={handleReset}>
        RESET
      </button>
      <br />

      {/* Alert message */}
      <h3 id="alert">{alert}</h3>
      <br />
      <br />
      <hr />

      {/* Seat count */}
      <div className="seat-count">
        {/* Booked seats */}
        <div className="seat-count-item">
          <strong>Booked Seat no.</strong>
          {bookedSeats.length > 0 &&
            bookedSeats.map((el, index) => (
              <p key={index} className="mynew1">
                {el.seatNumber}
              </p>
            ))}
        </div>

        {/* Available seats */}
        <div className="seat-count-item">
          <strong>Available Seats: {availableSeats}</strong>
          {restSeats > 0 && <p>Rest of the Seats: {restSeats}</p>}
        </div>
      </div>

      <br />
      <hr />

      {/* Seating arrangement */}
      <div
        style={{
          marginTop: "10px",
          display: "grid",
          gridTemplateColumns: `repeat(${seatsInRow},1fr)`,
        }}
      >
        {seats.map((isBooked, index) => (
          <div
            key={index}
            style={{
              backgroundColor: isBooked ? "blue" : "green",
              padding: "5px",
              margin: "5px",
              color: "white",
              borderRadius: "5px",
              width: "50px",
            }}
          >
            {generateSeatNumber(index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SeatBooking;
