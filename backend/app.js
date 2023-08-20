const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const xlsx = require("xlsx");
const cors = require("cors");
const PMData = require("./models");
const db = require("./db");
const router = express.Router();
const uploadRouter = require("./routes/uploadRoutes");
const getSpecificData = require("./routes/getSpecificData");
const csv = require("csv-parser");
const getSpecificDataTimeRange = require("./routes/getSpecificDataTimeRange");
const specific = require("./routes/specific");
const customData = require("./routes/customData");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Authentication middleware using JWT tokens
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.sendStatus(401);
  jwt.verify(token, "secret", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Define routes here...

/******************* Token Generation In Backend.Start ***************************/
// @desc   Token Generation In Backend.
// @route   GET /generate-token
// @access  public
const secretKey = "Ruturaj@123"; // secretKey for Project
app.get("/generate-token", (req, res) => {
  const user = {
    id: 1,
    username: "ruturaj",
  };

  // Generate a JWT token
  const token = jwt.sign(user, secretKey, { expiresIn: "30d" });

  res.json({ token });
});
/******************* Token Generation In Backend END ***************************/

/*******************Route to verify a JWT token START ***************************/
// @desc  Verify a JWT token.
// @route   GET /verify-token
// @access  public
app.get("/verify-token", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  // Verify the token
  jwt.verify(token.split(" ")[1], "Ruturaj@123", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token verification failed" });
    }

    res.json({ message: "Token is valid", user: decoded });
  });
});
/*******************Route to verify a JWT token END ***************************/

/*******************Route to Upload Csv File to MongoDB START ***************************/

// Configure Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// HTML form route for file upload
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html"); // Change the path as needed
});

// @desc  route for uploading CSV files
// @route   POST /upload
// @access  private
app.use("/upload", uploadRouter);
/*******************Route to Upload Csv File to MongoDB END ***************************/

/*******************Route to pull data for specific devices START ***************************/
// @desc  route for pull data of specific devices
// @route   GET /data/spec
// @access  public
app.use("/data/specificData", specific);
/*******************Route to pull data for specific devices  END ***************************/

/*******************Route to pull pm1, pm2.5, and pm10 values separately for all specified device  START ***************************/
// @desc  route for pull data of specific devices
// @route   GET /data/custom?devices=DeviceA
// @access  public
app.use("/data/custom", customData);
/*******************Route to pull pm1, pm2.5, and pm10 values separately for all specified device  END ***************************/

/*******************Route to GET data for a specific device START ***************************/
// @desc  route for pull data of specific devices
// @route   GET /data/val?h=Shubham
// @access  public
app.use("/data", getSpecificData);
/*******************Route to GET data for a specific device END ***************************/

/*******************Route to GET data for a specific device START ***************************/
app.use("/data/specific", getSpecificDataTimeRange);
/*******************Route to GET data for a specific device END ***************************/

// GET data within a time range for a specific device
router.get(
  "/data/:device/:startTime/:endTime",
  authenticateJWT,
  async (req, res) => {
    const device = req.params.device;
    const startTime = new Date(req.params.startTime);
    const endTime = new Date(req.params.endTime);
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
  }
);

router.get("/data1", async (req, res) => {
  try {
    // Extract device IDs from the query parameters
    const { devices } = req.query;

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

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
