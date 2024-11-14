import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './components/Header';
import Cart from './pages/Cart';
import Inventory from './pages/Inventory';
import WishList from './pages/WishList';
import AppProvider from './context/AppContext';
import Invoice from './components/Invoice';
import Payment from './components/Payment';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <AppProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/wishlist" element={<WishList />} />
          <Route path="/invoice/" element={<Invoice />} />
          <Route path="/payment/" element={<Payment />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
