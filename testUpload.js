import { generateUploadURL } from './backend/config/s3.js';
import fs from 'fs';

// Función de prueba para cargar una imagen a S3
async function testUpload() {
    try {
        const fileName = 'test-image.jpg'; 
        const uploadURL = await generateUploadURL(fileName);
        
        console.log('URL pre-firmada para la carga:', uploadURL);

        // Lee el archivo de prueba
        const fileStream = fs.createReadStream('../knexus/test-image.jpg');

        // Configuración de la solicitud de carga
        const options = {
            method: 'PUT',
            headers: { 'Content-Type': 'image/jpeg' },
            body: fileStream
        };

        // Realiza la solicitud de carga
        const response = await fetch(uploadURL, options);

        if (response.ok) {
            console.log('Archivo subido exitosamente a S3');
        } else {
            console.error('Error al subir el archivo:', response.statusText);
        }
    } catch (error) {
        console.error('Error en la prueba de carga:', error);
    }
}

// Ejecuta la función de prueba
testUpload();
