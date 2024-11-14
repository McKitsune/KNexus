import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faHeart, faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import logo from '../assets/react.svg'; 
import '../styles/Header.css';

const Header = () => {
    return (
        <header className="header">
            {/* Logo */}
            <div className="logo-container">
                <Link to="/">
                    <img src={logo} alt="Logo" className="logo" />
                </Link>
            </div>

            {/* Menú de navegación */}
            <nav className="nav-menu">
            <Link to="./" className="nav-link">Inicio</Link>
            <Link to="./inventory" className="nav-link">Inventario</Link>
            </nav>

            {/* Barra de búsqueda e iconos */}
            <div className="actions">
                <div className="search-container">
                    <input type="text" placeholder="Buscar" className="search-input" />
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </div>
                <Link to="/profile">
                <FontAwesomeIcon icon={faUser} className="action-icon" />
                </Link>
                <Link to="/wishlist">
                    <FontAwesomeIcon icon={faHeart} className="action-icon" />
                </Link>
                <Link to="/cart">
                    <FontAwesomeIcon icon={faShoppingBag} className="action-icon" />
                </Link>
            </div>
        </header>
    );
};

export default Header;
