import express from 'express';
import { getAllProducts, getProduct, putProduct, updateProduct, deleteProduct, getUser, putUser, deleteUser, getAllUsers } from '../controllers/dynamoController.js';

const router = express.Router();

// Rutas para productos
router.get('/products', getAllProducts);        // GET /api/products
router.get('/product/:id', getProduct);         // GET /api/product/:id
router.post('/product', putProduct);            // POST /api/product
router.post('/product/:id', updateProduct);     // POST /api/product
router.delete('/product/:id', deleteProduct);   // DELETE /api/product/:id

// Rutas para usuarios
router.get('/users', getAllUsers);              // GET /api/users
router.get('/users/:userId/:email', getUser);    // GET /api/user/:userId/:email
router.post('/user', putUser);                  // POST /api/user
router.delete('/user/:userId/:email', deleteUser); // DELETE /api/user/:userId/:email


export default router;
