import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dynamoRoutes from './routes/dynamoRoutes.js';
import uploadRoutes from './routes/upload.js';
import routesEmail from './routes/routesEmail.js';
import routesCustomer from './routes/routesCustomer.js';
import purchaseRoutes from './routes/purchaseRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de rutas unificada
app.use('/api', uploadRoutes);      // Rutas de carga de archivos
app.use('/api', dynamoRoutes);      // Rutas de productos y usuarios
app.use('/api', routesEmail);       // Rutas de correo electrónico
app.use('/api', routesCustomer);
app.use('/api', purchaseRoutes);

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error en el servidor', error: err.message });
});

// Escuchar el puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});