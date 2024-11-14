import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { processPurchase } from '../controllers/purchaseController.js';


const router = express.Router();

// Ruta para realizar la compra, solo accesible para usuarios autenticados
router.post('/purchase', verifyToken, processPurchase);

export default router;