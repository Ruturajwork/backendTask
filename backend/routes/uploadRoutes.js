const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const router = express.Router();
const PMData = require("../models");
const { Readable } = require("stream");

// Configure Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Define the route for uploading CSV files
router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read the uploaded CSV file
    const rows = [];

    // Pipe the file buffer to the CSV parser
    const stream = Readable.from(req.file.buffer.toString());
    stream
      .pipe(csv())
      .on("data", (row) => {
        // Manually parse the "t" field into a Date object
        const dateParts = row.t ? row.t.split(",") : [];

        if (dateParts.length === 2) {
          const datePart = dateParts[0].trim();
          const timePart = dateParts[1].trim();

          // Split date and time components
          const dateComponents = datePart.split("/");
          const timeComponents = timePart.split(":");

          if (
            dateComponents.length === 3 &&
            timeComponents.length === 3 &&
            !isNaN(dateComponents[0]) &&
            !isNaN(dateComponents[1]) &&
            !isNaN(dateComponents[2]) &&
            !isNaN(timeComponents[0]) &&
            !isNaN(timeComponents[1]) &&
            !isNaN(timeComponents[2])
          ) {
            const formattedDate = new Date(
              `20${dateComponents[2]}`,
              dateComponents[1] - 1,
              dateComponents[0],
              timeComponents[0],
              timeComponents[1],
              timeComponents[2]
            );

            if (!isNaN(formattedDate)) {
              // Format the date as required: "YYYY-MM-DDTHH:mm:ss"
              const isoFormattedDate = formattedDate
                .toISOString()
                .slice(0, 19)
                .replace("T", " ");
              row.t = isoFormattedDate;
              rows.push(row);
            } else {
              console.warn(
                `Invalid date format in row: ${JSON.stringify(row)}`
              );
            }
          } else {
            console.warn(`Invalid date format in row: ${JSON.stringify(row)}`);
          }
        } else {
          console.warn(`Invalid date format in row: ${JSON.stringify(row)}`);
        }
      })
      .on("end", async () => {
        if (rows.length === 0) {
          return res
            .status(400)
            .json({ error: "No valid data found in the CSV file" });
        }

        // Insert the data into MongoDB (replace PMData with your data model)
        await PMData.insertMany(rows);

        res.status(201).json({ message: "Data uploaded successfully" });
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading data" });
  }
});

module.exports = router;
