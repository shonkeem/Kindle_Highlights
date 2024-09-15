// just imports all these frameworks
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");

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

// define schema and model to store file metadata in MongoDB
const fileSchema = new mongoose.Schema({
  filename: String,
  filepath: String,
  mimetype: String,
  size: Number,
  uploadDate: { type: Date, default: Date.now },
});
const File = mongoose.model("File", fileSchema);

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Set uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Initialize multer with storage configuration
const upload = multer({ storage });

// Ensure uploads directory exists
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Route to handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).send("No file uploaded.");
    }

    console.log("File received:", file); //Log file details

    // Save file metadata to MongoDB
    const savedFile = new File({
      filename: file.filename,
      filepath: file.path,
      mimetype: file.mimetype,
      size: file.size,
    });

    await savedFile.save();
    console.log("File metadata saved:", savedFile); //Log saved metadata

    res.status(200).json({
      message: "File uploaded successfully",
      file: savedFile,
    });
  } catch (error) {
    console.error("Error uploading file", error);
    res.status(500).send("File upload failed.");
  }
});

// Basic route to test server
app.get("/", (req, res) => {
  res.send("API is running..."); //basic response to check if server is working
});

// define port on which server will listen
const PORT = process.env.PORT || 5000; //use PORT variable from environment or default to 5000

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
