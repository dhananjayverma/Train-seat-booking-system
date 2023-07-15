const mongoose = require("mongoose");

const connection = mongoose.connect(
  "mongodb+srv://suraj:sk2023assignment@trainapp.4dtyag0.mongodb.net/?retryWrites=true&w=majority"
);

module.exports = {
  connection,
};
