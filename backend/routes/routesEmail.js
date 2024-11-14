import express from 'express';
import { sendMasiveMail, sendMasiveMailBatch } from '../controllers/mailController.js';

const router = express.Router();

// Rutas de correo electrónico
router.post('/mailMasive', sendMasiveMail);
router.post('/mailMasiveBatch', sendMasiveMailBatch);

export default router;