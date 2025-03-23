const express = require("express");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;


// Enable CORS for frontend requests
app.use(cors());

// Load Google Cloud Storage credentials
const storage = new Storage({
  keyFilename: path.join(__dirname, "composed-apogee-454521-u8-52114df70671.json"), // Ensure this file is inside 'backend/'
});

const bucketName = "smartwastesystem"; // Replace with your bucket name
const bucket = storage.bucket(bucketName);

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const blob = bucket.file(`uploads/${Date.now()}-${req.file.originalname}`);
    const blobStream = blob.createWriteStream({
      resumable: false,
      contentType: req.file.mimetype,
    });

    blobStream.on("error", (err) => res.status(500).send(err.message));

    blobStream.on("finish", async () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
      res.status(200).json({ imageUrl: publicUrl });
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(port, () => console.log(`Backend running on http://localhost:${port}`));
