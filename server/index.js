const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");
const { seatRouter } = require("./routes/SeatRoutes");
const colors = require("colors");
const dotenv = require("dotenv");
const app = express();
app.use(express.json());
app.use(cors());

//dot.env
dotenv.config();
//database
connectDB();

app.use("/", seatRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server Running in ${process.env.DEV_MODE} mode on port no ${PORT}`.bgCyan
      .white
  );
});

