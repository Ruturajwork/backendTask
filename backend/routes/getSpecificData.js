const express = require("express");
const router = express.Router();
const PMData = require("../models"); // Import your data model here
const authenticateJWT = require("../routes/generateToken");

// GET data with multiple parameters Or Single parameter
router.get("/val", authenticateJWT, async (req, res) => {
  try {
    // Extract query parameters from the request
    const { h, w, p1, p25, p10 } = req.query;

    // Create an object to filter data based on the query parameters
    const filter = {};
    if (h) filter.h = h;
    if (w) filter.w = w;
    if (p1) filter.p1 = p1;
    if (p25) filter.p25 = p25;
    if (p10) filter.p10 = p10;

    // Use the filter object to find data
    const data = await PMData.find(filter);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

module.exports = router;
