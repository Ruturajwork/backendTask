const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://ruturajsalunkhework:12345@cluster0.rnn7bwj.mongodb.net/PMdata",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

module.exports = mongoose;
