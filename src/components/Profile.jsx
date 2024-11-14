import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
    const [profileData, setProfileData] = useState(null); // Estado para los datos del perfil
    const [error, setError] = useState(''); // Estado para los errores
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token'); // Obtener el token de localStorage

                // Si no hay token, redirige al inicio de sesión
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Solicitar los datos del perfil al backend
                const response = await axios.get('/api/users/', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Incluir el token en el encabezado de la solicitud
                    },
                });

                setProfileData(response.data); // Almacenar los datos del perfil en el estado
            } catch (err) {
                // Manejo de errores más detallado
                if (err.response) {
                    // El servidor respondió con un error
                    setError(`Error al cargar el perfil: ${err.response.data.error || err.response.statusText}`);
                } else {
                    // Error de red o algo que ocurrió antes de que la solicitud llegara al servidor
                    setError('Error de red o servidor. Intenta nuevamente más tarde.');
                }
            }
        };

        fetchProfile(); // Llamar a la función para obtener los datos del perfil
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Eliminar el token de localStorage
        navigate('/login'); // Redirigir al usuario a la página de inicio de sesión
    };

    return (
        <div className="profile-container">
            <h1>Perfil del Usuario</h1>

            {/* Mostrar mensaje de error si hay algún problema */}
            {error && <p className="error-message">{error}</p>}

            {/* Mostrar los datos del perfil o un mensaje si aún se están cargando */}
            {profileData ? (
                <div className="profile-data">
                    <p><strong>Nombre:</strong> {profileData.name}</p>
                    <p><strong>Email:</strong> {profileData.email}</p>
                    {/* Otros datos del perfil que quieras mostrar */}
                    <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
                </div>
            ) : (
                <p>Cargando perfil...</p>
            )}
        </div>
    );
};

export default Profile;
