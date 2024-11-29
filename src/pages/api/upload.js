import nextConnect from 'next-connect';
import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: './public/uploads', // The directory where files will be stored
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Adds timestamp to filename
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  fileFilter: (req, file, cb) => {
    // Only allow image files (can be extended to other types)
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, etc.) are allowed!'), false);
    }
  },
});

// API route handler using nextConnect
const apiRoute = nextConnect({
  onError(error, req, res) {
    // Log the full error details for debugging
    console.error('Error occurred during file upload:', error);  // Log the error object
    console.error('Error message:', error.message);              // Log error message
    console.error('Error stack trace:', error.stack);            // Log stack trace for deeper analysis

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      // Handle file size limit exceeded error
      return res.status(400).json({ error: 'File size exceeds the 5MB limit.' });
    } else if (error.message === 'Only image files (JPEG, PNG, GIF, etc.) are allowed!') {
      // Handle non-image file upload attempt
      return res.status(400).json({ error: 'Only image files (JPEG, PNG, GIF, etc.) are allowed!' });
    } else {
      // General error handling for other types of errors
      return res.status(500).json({ error: `Something went wrong: ${error.message}` });
    }
  },
  onNoMatch(req, res) {
    // Handle unsupported HTTP methods
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  },
});

// Use multer for handling the file upload
apiRoute.use(upload.single('file'));

// POST request handler (file upload)
apiRoute.post((req, res) => {
  if (!req.file) {
    // If no file is uploaded, return a bad request error
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // The uploaded file's URL (accessible publicly in the `public/uploads` folder)
  const fileUrl = `/uploads/${req.file.filename}`;

  // Respond with a JSON object containing success message and the file URL
  return res.status(200).json({
    success: true,
    fileUrl,
    message: 'File uploaded successfully',
  });
});

export default apiRoute;

// Disable body parsing to allow multer to handle the incoming request
export const config = {
  api: {
    bodyParser: false, // Disables default body parsing to handle file uploads
  },
};
