import express from 'express';
import multer from 'multer';
import path from 'path';
import { processFrame } from '../controller/frameController';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

router.post('/', upload.single('video'), processFrame);

export default router;
