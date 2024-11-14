import React, { useState, useEffect } from 'react';
import '../styles/Cart.css';
import { Link } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);

    // Cargar el carrito desde localStorage solo al montar el componente
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        console.log('Cart data from localStorage at load:', savedCart); // Debug: Muestra el contenido inicial de localStorage

        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
            console.log('cartItems set from localStorage:', JSON.parse(savedCart)); // Debug: Verifica la asignación de cartItems
        }
    }, []); // Solo ejecuta esto una vez al montar

    useEffect(() => {
        console.log('Current cartItems in state after setting:', cartItems); // Debug: Verifica el contenido de cartItems en el estado cada vez que cambia
    }, [cartItems]); // Monitorea cambios en cartItems

    // Calcular el total del carrito
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Función para incrementar la cantidad hasta el límite del stock
    const increaseQuantity = (productId) => {
        setCartItems((prevItems) => {
            const updatedCart = prevItems.map(item => {
                if (item.id === productId) {
                    // Verifica si la cantidad actual es menor que el stock antes de incrementar
                    if (item.quantity < item.stock) {
                        return { ...item, quantity: item.quantity + 1 };
                    } else {
                        alert(`La cantidad máxima disponible para ${item.name} es ${item.stock}.`);
                    }
                }
                return item;
            });
            localStorage.setItem('cart', JSON.stringify(updatedCart)); // Actualiza localStorage
            return updatedCart;
        });
    };

    // Función para reducir la cantidad
    const decreaseQuantity = (productId) => {
        setCartItems((prevItems) => {
            const updatedCart = prevItems.map(item =>
                item.id === productId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            );
            localStorage.setItem('cart', JSON.stringify(updatedCart)); // Actualiza localStorage
            return updatedCart;
        });
    };

    // Función para eliminar un producto del carrito
    const removeItem = (productId) => {
        setCartItems((prevItems) => {
            const updatedCart = prevItems.filter(item => item.id !== productId);
            localStorage.setItem('cart', JSON.stringify(updatedCart)); // Actualiza localStorage
            return updatedCart;
        });
    };

    

    return (
        <div className="cart-container">
            <h1>Carrito de Compras</h1>
            {cartItems.length === 0 ? (
                <p>Tu carrito está vacío.</p>
            ) : (
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <img src={item.imageUrls[0]} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-info">
                                <h2 className="cart-item-name">{item.name}</h2>
                                <p className="cart-item-price">
                                    {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.price)}
                                </p>
                                <div className="cart-item-quantity">
                                    <button onClick={() => decreaseQuantity(item.id)}>-</button>
                                    <span>Cantidad: {item.quantity}</span>
                                    <button onClick={() => increaseQuantity(item.id)}>+</button>
                                </div>
                                <button className="remove-item-button" onClick={() => removeItem(item.id)}>
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="cart-summary">
                <h2>Resumen de la Compra</h2>
                <p>Subtotal: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(calculateTotal())}</p>
                <Link to="/invoice">
                    <button className="checkout-button">Proceder al Pago</button>
                </Link>
            </div>
        </div>
    );
};

export default Cart;

