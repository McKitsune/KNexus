import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

export async function generateUploadURL(fileName) {
    if (!fileName) throw new Error('El parámetro "fileName" es obligatorio');

    const command = new PutObjectCommand({
        Bucket: 'knexusimg', // Cambia esto a tu bucket real temporalmente
        Key: fileName,
        Expires: 60,
    });

    try {
        const url = await getSignedUrl(s3Client, command, { expiresIn: 60 }); // Solo aquí `expiresIn`
        return url;
    } catch (error) {
        console.error('Error al generar la URL de carga:', error);
        throw new Error('No se pudo generar la URL de carga');
    }
}
