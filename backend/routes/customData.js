const express = require("express");
const router = express.Router();
const PMData = require("../models"); // Import your PMData model
const authenticateJWT = require("../routes/generateToken");

// Define a route to get PM1, PM2.5, and PM10 data for specified devices
router.get("/", async (req, res) => {
  try {
    // Extract the list of devices from the query parameters
    const { devices } = req.query;

    // Split the comma-separated device list into an array
    const deviceList = devices.split(",");

    // Create an object to store the data for each device and parameter
    const deviceData = {};

    // Loop through the devices and parameters and fetch data for each combination
    for (const device of deviceList) {
      const data = await PMData.find({ device });

      // Create an object to store the PM data for the device
      const devicePMData = {
        PM1: [],
        PM25: [],
        PM10: [],
      };

      // Filter and store data for each parameter
      for (const entry of data) {
        devicePMData.PM1.push(entry.p1);
        devicePMData.PM25.push(entry.p25);
        devicePMData.PM10.push(entry.p10);
      }

      // Store the PM data for the device in the main object
      deviceData[device] = devicePMData;
    }

    // Send the data as JSON response
    res.json(deviceData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

module.exports = router;
