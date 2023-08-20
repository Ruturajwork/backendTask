const express = require("express");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  // Verify the token
  jwt.verify(token.split(" ")[1], "Ruturaj@123", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token verification failed" });
    }
    next();
    // res.json({ message: "Token is valid", user: decoded });
  });
};

module.exports = authenticateJWT;
