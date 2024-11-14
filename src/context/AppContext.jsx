import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [cart, setCart] = useState([]);

    // Función para añadir o quitar un producto de la wishlist
    const addToWishlist = (product) => {
        setWishlist((prevWishlist) => {
            if (prevWishlist.some(item => item.id === product.id)) {
                // Si ya está, quítalo
                return prevWishlist.filter(item => item.id !== product.id);
            } else {
                // Si no está, agrégalo
                return [...prevWishlist, product];
            }
        });
    };

    // Función para añadir al carrito
    const addToCart = (product) => {
        setCart((prevCart) => {
            if (!prevCart.some(item => item.id === product.id)) {
                return [...prevCart, { ...product, quantity: 1 }];
            }
            return prevCart;
        });
    };

    return (
        <AppContext.Provider value={{ wishlist, addToWishlist, cart, addToCart }}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;
