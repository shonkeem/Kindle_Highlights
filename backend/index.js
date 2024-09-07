// just imports all these frameworks
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// will load environment variables from a .env file
dotenv.config();
// initialize express app
const app = express();

//middleware setup
app.use(cors());
app.use(express.json());

// connect to mongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error", error));

// Basic route to test server
app.get("/", (req, res) => {
  res.send("API is running..."); //basic response to check if server is working
});

// define port on which server will listen
const PORT = process.env.PORT || 5000; //use PORT variable from environment or default to 5000

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
