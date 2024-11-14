import express from 'express';
import { generateUploadURL } from '../controllers/s3Controller.js';

const router = express.Router();


router.get('/s3/upload-url', generateUploadURL);

export default router;


