require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const githubRoutes = require("./routes/githubRoutes");


const timerRoutes = require("./routes/timerRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/timer", timerRoutes);
app.use("/api/github", githubRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
