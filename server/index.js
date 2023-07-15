const cors = require("cors");
const express = require("express");
const { connection } = require("./config/db");
const { seatRouter } = require("./routes/SeatRoutes");
const app = express();
app.use(express.json());
app.use(cors());

app.use("/", seatRouter);
app.listen(5000, async () => {
  try {
    await connection;
    console.log("Connected to the Database");
  } catch (error) {
    console.log("Connection Error:", error);
  }
  console.log(`Server is running on port 5000`);
});







