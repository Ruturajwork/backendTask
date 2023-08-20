const express = require("express");
const router = express.Router();
const PMData = require("../models"); // Import your data model here
const authenticateJWT = require("../routes/generateToken");
// GET data for specific devices
router.get("/", async (req, res) => {
  try {
    // Extract device IDs from the query parameters
    const { devices } = req.query;
    console.log(devices);

    if (!devices) {
      return res.status(400).json({ error: "Please provide device IDs" });
    }

    // Split the device IDs if they are in a comma-separated string
    const deviceIDs = devices.split(",");

    // Use the device IDs to filter data
    const data = await PMData.find({ device: { $in: deviceIDs } });

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

module.exports = router;
