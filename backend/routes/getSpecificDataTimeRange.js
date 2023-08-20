// const express = require("express");
// const router = express.Router();
// const PMData = require("../models"); // Import your data model here
// const authenticateJWT = require("../routes/generateToken");

// // function parseCustomDateTime(dateTimeString) {
// //   // Split the date and time parts
// //   const [datePart, timePart] = dateTimeString.split("_"); // Use "_" to split date and time

// //   // Split the date part into day, month, and year
// //   const [day, month, year] = datePart.split("-"); // Use "-" to split day, month, and year

// //   // Split the time part into hours, minutes, and seconds
// //   const [hours, minutes, seconds] = timePart.split("-"); // Use "-" to split hours, minutes, and seconds

// //   // Convert the parts to numbers
// //   const dayNum = parseInt(day, 10);
// //   const monthNum = parseInt(month, 10);
// //   const yearNum = parseInt(year, 10);
// //   const hoursNum = parseInt(hours, 10);
// //   const minutesNum = parseInt(minutes, 10);
// //   const secondsNum = parseInt(seconds, 10);

// //   // Create a Date object (note that months are 0-based in JavaScript)
// //   return new Date(
// //     2000 + yearNum,
// //     monthNum - 1,
// //     dayNum,
// //     hoursNum,
// //     minutesNum,
// //     secondsNum
// //   );
// // }
// function parseCustomDateTime(frontendDateTime) {
//   // Split the frontend date and time string
//   const [datePart, timePart] = frontendDateTime.split("_");

//   // Split the date part into day, month, and year
//   const [day, month, year] = datePart
//     .split("-")
//     .map((part) => parseInt(part, 10));

//   // Split the time part into hours, minutes, and seconds
//   const [hours, minutes, seconds] = timePart
//     .split("-")
//     .map((part) => parseInt(part, 10));

//   // Create a JavaScript Date object (Note: months are 0-based)
//   const jsDate = new Date(2000 + year, month - 1, day, hours, minutes, seconds);

//   // Convert the JavaScript Date object to the desired backend format
//   const backendDateTime = jsDate.toISOString();

//   return backendDateTime;
// }

// // Example usage:

// router.get("/:device/:dateTimeStart/:dateTimeEnd", async (req, res) => {
//   const device = req.params.device;

//   const dateTimeStartString = req.params.dateTimeStart;
//   const dateTimeEndString = req.params.dateTimeEnd;
//   console.log(`device: ${device}`);
//   console.log(`device: ${dateTimeStartString}`);
//   console.log(`device: ${dateTimeEndString}`);
//   // Parse the custom date-time strings into Date objects
//   const startTime = parseCustomDateTime(dateTimeStartString);
//   const endTime = parseCustomDateTime(dateTimeEndString);
//   console.log(startTime, endTime);
//   try {
//     // Convert startTime and endTime to ISO format
//     const isoStartTime = startTime;
//     const isoEndTime = endTime;
//     console.log(isoStartTime, isoEndTime);
//     const data = await PMData.find({
//       device,
//       t: { $gte: isoStartTime, $lte: isoEndTime },
//     });
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error fetching data" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const PMData = require("../models"); // Import your data model here
const moment = require("moment");

function parseCustomDateTime(dateTimeString) {
  const [datePart, timePart] = dateTimeString.split("_"); // Use "_" to split date and time
  const [day, month, year] = datePart.split("-"); // Use "-" to split day, month, and year
  const [hours, minutes, seconds] = timePart.split("-"); // Use "-" to split hours, minutes, and seconds

  const formattedDateTime = `20${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  // Parse the formatted date-time using moment.js
  return moment(formattedDateTime).toISOString();
}

router.get("/:device/:dateTimeStart/:dateTimeEnd", async (req, res) => {
  const device = req.params.device;
  const dateTimeStartString = req.params.dateTimeStart;
  const dateTimeEndString = req.params.dateTimeEnd;

  // Parse the custom date-time strings into ISO strings using moment.js
  const startTime = parseCustomDateTime(dateTimeStartString);
  const endTime = parseCustomDateTime(dateTimeEndString);

  try {
    const data = await PMData.find({
      device,
      t: { $gte: startTime, $lte: endTime },
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching data" });
  }
});

module.exports = router;
