// pages/api/upload.js
import multer from "multer";
import path from "path";
import { createRouter } from "next-connect";

const upload = multer({
  storage: multer.diskStorage({
    destination: "./public/uploads",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
});

const router = createRouter();
router.use(upload.single("file"));

router.post((req, res) => {
  res.status(200).json({ filePath: `/uploads/${req.file.filename}` });
});

export default router.handler();

export const config = {
  api: {
    bodyParser: false,
  },
};
