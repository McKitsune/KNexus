import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import api from '../services/api'; // Assuming this is your API handler
import '../styles/WishList.css';

const WishList = ({ addToCart }) => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [allProducts, setAllProducts] = useState([]);

    // Fetch all products once and filter by wishlist IDs
    const loadProducts = async () => {
        try {
            const response = await api.get('/products'); // Assuming this endpoint returns all products
            setAllProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // Load wishlist from localStorage and filter products
    const loadWishlistItems = () => {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            const wishlistIds = JSON.parse(savedWishlist);
            const filteredItems = allProducts.filter(product => wishlistIds.includes(product.id));
            setWishlistItems(filteredItems);
        }
    };

    // Fetch products on component mount
    useEffect(() => {
        loadProducts();
    }, []);

    // Load wishlist items whenever products or localStorage changes
    useEffect(() => {
        loadWishlistItems();

        // Listen for changes to localStorage
        const handleStorageChange = (event) => {
            if (event.key === 'wishlist') {
                loadWishlistItems();
            }
        };
        window.addEventListener('storage', handleStorageChange);

        // Cleanup event listener on unmount
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [allProducts]);

    const removeFromWishlist = (productId) => {
        const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
        setWishlistItems(updatedWishlist);

        const updatedWishlistIds = updatedWishlist.map(item => item.id);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlistIds));
    };

    return (
        <div className="wishlist-container">
            <h1>Lista de Deseos</h1>
            {wishlistItems.length === 0 ? (
                <p>Tu lista de deseos está vacía.</p>
            ) : (
                <div className="wishlist-grid">
                    {wishlistItems.map(item => (
                        <div key={item.id} className="product-card">
                            <img src={item.imageUrls[0]} alt={item.name} className="product-image" />
                            <div className="product-info">
                                <h3>{item.name}</h3>
                                <p>{new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(item.price)}</p>
                                <div className="product-actions">
                                    <button onClick={() => addToCart(item)}>
                                        <FontAwesomeIcon icon={faShoppingCart} /> 
                                    </button>
                                    <button onClick={() => removeFromWishlist(item.id)}>
                                        <FontAwesomeIcon icon={faHeart} /> 
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishList;
