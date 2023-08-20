const mongoose = require("mongoose");

const pmDataSchema = new mongoose.Schema({
  device: String,
  t: Date,
  w: Number,
  h: String,
  p1: Number,
  p25: Number,
  p10: Number,
});

module.exports = mongoose.model("PMData", pmDataSchema);
