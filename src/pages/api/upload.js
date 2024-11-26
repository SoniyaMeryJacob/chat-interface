import multer from "multer";
import path from "path";
import { createRouter } from "next-connect";

// Configure Multer to store files in the "uploads" folder
const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    },
  }),
});

const router = createRouter();

// Middleware to handle file uploads
router.use(upload.single("file"));

// POST endpoint to upload files
router.post((req, res) => {
  res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});

export default router.handler();

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parsing for multer
  },
};
