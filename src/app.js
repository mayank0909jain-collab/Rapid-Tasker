const express = require("express");
const cors = require("cors");
const auth = require('./modules/auth/auth.routes');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth',auth);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Home Services API is running",
  });
});

module.exports = app;