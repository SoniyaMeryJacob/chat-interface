// src/pages/api/upload.js
import multer from 'multer';
import path from 'path';

// Define the storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'public', 'uploads');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const filename = Date.now() + '-' + file.originalname;
    cb(null, filename);
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false,  // Disable Next.js's default body parser
  },
};

export default function handler(req, res) {
  // Handle file uploads via multer middleware
  upload.single('file')(req, res, (err) => {
    if (err) {
      return res.status(500).json({ error: 'File upload failed', message: err.message });
    }

    // Send back the response with the file info
    res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file,
    });
  });
}
