import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Configuración de Nodemailer para usar Mailtrap como servidor SMTP (para pruebas)
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com', // Prueba esta opción
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,       // Usar la variable de entorno para el usuario
    pass: process.env.SMTP_PASSWORD     // Usar la variable de entorno para la contraseña
  }
});
console.log('Usuario SMTP:', process.env.EMAIL_USER);
console.log('Contraseña SMTP:', process.env.SMTP_PASSWORD);

// Configuración de lotes para envío masivo
const batchSize = 3; // Tamaño de cada lote
const batchDelay = 10000; // Retraso en milisegundos entre lotes (10 segundos)

// Ruta al archivo HTML para el cuerpo del correo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const htmlFile = path.resolve(__dirname, '../email/wellcome.html');
const html = fs.readFileSync(htmlFile, 'utf8'); // Lee el contenido HTML

// Función para enviar correos masivos a todos los destinatarios de una vez
export const sendMasiveMail = async (req, res) => {
  const { recipients, subject, text } = req.body;

  // Verificar que todos los campos requeridos estén presentes
  if (!recipients || !subject || !text) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const mailOptions = {
      from: 'kitsuneidea@folkstravels.com', // Usa el correo que estás usando como remitente
      to: recipients,                       // Recibe un array de destinatarios
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado con éxito:', info.response);
    res.status(200).json({ message: 'Correo enviado con éxito', info });

  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ message: 'Error al enviar el correo', error: error.message });
  }
};

// Función para enviar correos masivos en lotes (para evitar sobrecargar el servidor SMTP)
export const sendMasiveMailBatch = async (req, res) => {
  const { recipients, subject, text } = req.body;

  // Validación de campos requeridos
  if (!recipients || !subject || !text) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const errors = []; // Array para almacenar errores de envío
  const responsesTransporter = []; // Array para almacenar respuestas exitosas

  try {
    // Dividir destinatarios en lotes
    const batches = [];
    for (let i = 0; i < recipients.length; i += batchSize) {
      batches.push(recipients.slice(i, i + batchSize));
    }

    // Enviar cada lote con un retraso entre ellos
    for (const batch of batches) {
      await Promise.all(
        batch.map(async (recipient) => {
          const mailOptions = {
            from: 'kitsuneidea@folkstravels.com',
            to: recipient,
            subject,
            text,
            html
          };

          try {
            const response = await transporter.sendMail(mailOptions);
            responsesTransporter.push(response);
            console.log(`Correo enviado a ${recipient}`);
          } catch (error) {
            errors.push({ recipient, error: error.message });
            console.log(`Error al enviar el correo a ${recipient}: ${error.message}`);
          }
        })
      );

      // Espera `batchDelay` milisegundos antes de enviar el siguiente lote
      await new Promise(resolve => setTimeout(resolve, batchDelay));
    }

    // Respuesta con éxito o con errores parciales
    if (errors.length > 0) {
      res.status(207).json({ message: 'Mensajes enviados con algunos errores', errors });
    } else {
      res.status(200).json({ message: 'Todos los mensajes fueron enviados exitosamente', responsesTransporter });
    }

  } catch (error) {
    console.error('Error general en el envío de correos:', error);
    res.status(500).json({ message: 'Error general en el envío de correos', error: error.message });
  }
};
