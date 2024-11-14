import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Invoice.css';
import api from '../services/api';

const Invoice = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [emailStatus, setEmailStatus] = useState('');

    // Cargar los productos del carrito desde localStorage al montar el componente
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Calcular el total del carrito
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const handlePrint = () => {
        window.print();
    };

    // Verificar si el token existe y redirigir al login si no
    const handlePayment = () => {
        const token = localStorage.getItem('token'); // Obtener el token desde localStorage
    
        if (!token) {
            alert('Debes iniciar sesión para proceder con el pago');
            navigate('/login'); // Redirigir al login si no hay token
            return; // Detener la ejecución si no hay token
        }
    
        // Redirigir a la página de pago sin enviar el correo
        navigate('/payment');
    };

    const handlePurchase = async () => {
        const token = localStorage.getItem('token'); // Obtener el token desde localStorage

        if (!token) {
            alert('Debes iniciar sesión para realizar una compra');
            return; // Si no hay token, no continuar con la compra
        }

        try {
            const purchaseData = {
                cartItems: cartItems,
                total: calculateTotal(),
            };

            const response = await axios.post('http://localhost:5000/api/purchase', purchaseData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Enviar el token en los encabezados
                },
            });
            console.log('Compra exitosa', response.data);
        } catch (error) {
            console.error('Error al realizar la compra', error);
        }
    };

    return (
        <div className="invoice-container">
            <h1>Factura de Compra</h1>

            <div className="invoice-details">
                {cartItems.length === 0 ? (
                    <p>Tu carrito está vacío.</p>
                ) : (
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map(item => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.price)}</td>
                                    <td>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.price * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="3" className="total-label">Total:</td>
                                <td className="total-amount">{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(calculateTotal())}</td>
                            </tr>
                        </tfoot>
                    </table>
                )}
            </div>

            <div className="invoice-actions">
                <button className="payment-button" onClick={handlePayment}>
                    Ir a Opciones de Pago
                </button>
                <button className="print-button" onClick={handlePrint}>
                    Imprimir Factura
                </button>
            </div>
        </div>
    );
};

export default Invoice;
