// Checkout.js
import React, { useState } from 'react';
import axios from 'axios';

const Checkout = () => {
    const [message, setMessage] = useState('');

    const handlePurchase = async () => {
        const token = localStorage.getItem('token'); // Obtener el token de localStorage

        if (!token) {
            setMessage('No estás autenticado');
            return;
        }

        try {
            // Enviar el token en el encabezado Authorization
            const response = await axios.post('/api/purchase', {}, {
                headers: {
                    Authorization: `Bearer ${token}`, // Enviar el token
                },
            });

            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || 'Error al procesar la compra');
        }
    };

    return (
        <div>
            <button onClick={handlePurchase}>Realizar Compra</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Checkout;
