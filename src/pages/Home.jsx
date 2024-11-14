import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import '../styles/Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState(() => {
        const savedWishlist = localStorage.getItem('wishlist');
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        console.log('Wishlist actualizado:', wishlist);
    }, [wishlist]);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log('Cart actualizado:', cart);
    }, [cart]);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
            console.log('Productos obtenidos de la API:', response.data);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const addToWishlist = (productId) => {
        if (!wishlist.includes(productId)) {
            setWishlist((prevWishlist) => {
                const newWishlist = [...prevWishlist, productId];
                localStorage.setItem('wishlist', JSON.stringify(newWishlist));
                console.log('Producto añadido a wishlist:', productId);
                return newWishlist;
            });
        } else {
            setWishlist((prevWishlist) => {
                const newWishlist = prevWishlist.filter(id => id !== productId);
                localStorage.setItem('wishlist', JSON.stringify(newWishlist));
                console.log('Producto eliminado de wishlist:', productId);
                return newWishlist;
            });
        }
    };

    const addToCart = (product) => {
        setCart((prevCart) => {
            const productInCart = prevCart.find(item => item.id === product.id);
            let newCart;

            if (productInCart) {
                // Verificación del límite de stock
                if (productInCart.quantity < product.stock) {
                    newCart = prevCart.map(item =>
                        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                    );
                    console.log(`Cantidad aumentada para el producto ${product.id}:`, newCart);
                } else {
                    // Alerta de límite de stock alcanzado
                    setAlert(`No se pueden agregar más unidades de ${product.name}. Stock máximo alcanzado.`);
                    setTimeout(() => setAlert(null), 2000);
                    return prevCart; // Devuelve el carrito sin cambios si se alcanzó el límite
                }
            } else {
                newCart = [...prevCart, { ...product, quantity: 1 }];
                console.log('Producto añadido al carrito:', product);
            }

            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        });

        // Mostrar alerta temporal al añadir al carrito
        setAlert(`Se añadió ${product.name} al carrito`);
        setTimeout(() => setAlert(null), 2000);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price);
    };

    return (
        <div className="home-container">
            {/* Alerta temporal */}
            {alert && <div className="alert">{alert}</div>}

            <div className="products-grid">
                {products.map(product => (
                    <div key={product.id} className="product-card">
                        <div className="product-image-container">
                            <img src={product.imageUrls[0]} alt={product.name} className="product-image" />
                            <FontAwesomeIcon
                                icon={faHeart}
                                className={`wishlist-icon ${wishlist.includes(product.id) ? 'active' : ''}`}
                                onClick={() => addToWishlist(product.id)}
                            />
                            <FontAwesomeIcon
                                icon={faShoppingCart}
                                className="cart-icon"
                                onClick={() => addToCart(product)}
                            />
                        </div>
                        <div className="product-info">
                            <h2 className="product-name">{product.name}</h2>
                            <p className="product-category">{product.category}</p>
                            <p className="product-description">{product.description}</p>
                            <h4 className="product-price">
                                {product.discount ? (
                                    <>
                                        <span className="old-price">{formatPrice(product.price)}</span>
                                        <span className="discount-price">{formatPrice(product.price * (1 - product.discount))}</span>
                                    </>
                                ) : (
                                    <span>{formatPrice(product.price)}</span>
                                )}
                            </h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
