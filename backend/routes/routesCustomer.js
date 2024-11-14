import express from 'express';
import CustomerController from '../controllers/customerController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Rutas de autenticación y usuario
router.post('/users', CustomerController.create); // Registro
router.post('/users/login', CustomerController.login); // Inicio de sesión

router.post('/create', CustomerController.create);
// Rutas protegidas
router.get('/users', auth, CustomerController.getAllCustomers); // Obtener todos los usuarios
router.put('/users/:id', auth, CustomerController.updateCustomer); // Actualizar usuario
router.delete('/users/:id', auth, CustomerController.deleteCustomer); // Eliminar usuario
router.get('/users/profile', auth, CustomerController.getProfile); // Ruta protegida para el perfil

export default router;