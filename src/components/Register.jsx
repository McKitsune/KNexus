import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Register.css'; // Importa el archivo CSS

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/user', { name, email, password });
            setMessage(response.data.message);
            console.log("Datos enviados: ", { name, email, password });
        } catch (error) {
            setMessage(error.response.data.error || 'Error en el registro');
        }
    };

    return (
        <div className="register-container">
            <h1>Registro de Usuario</h1>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="register-button">Registrarse</button>
            </form>
            {message && <p className="register-message">{message}</p>}
        </div>
    );
};

export default Register;
