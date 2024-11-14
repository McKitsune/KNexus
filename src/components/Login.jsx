import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Asegúrate de importar useNavigate
import '../styles/Login.css'; // Importa el archivo CSS

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Inicializa el hook useNavigate

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/user', { email, password });
            localStorage.setItem('token', response.data.token); // Guardar el token en localStorage
            setMessage('Inicio de sesión exitoso');
            navigate('/'); // Redirige al usuario a la página de inicio o alguna ruta protegida
        } catch (error) {
            setMessage(error.response.data.error || 'Error en el inicio de sesión');
        }
    };

    // Función para manejar el click en "¡Regístrate aquí!"
    const handleRedirectToRegister = () => {
        navigate('/register'); // Cambia la URL a la ruta de registro
    };

    return (
        <div className="login-container">
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleLogin}>
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
                <button type="submit" className="login-button">Iniciar Sesión</button>
            </form>
            {message && <p className="login-message">{message}</p>}
            <p>¿No tienes una cuenta? 
                <button onClick={handleRedirectToRegister} className="register-link">
                    ¡Regístrate aquí!
                </button>
            </p>
        </div>
    );
};

export default Login;
