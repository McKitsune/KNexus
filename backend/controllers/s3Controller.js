// s3Controller.js
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const generateUploadURL = async (req, res) => {
    const { fileName } = req.query;

    if (!fileName) {
        return res.status(400).json({ error: "El parámetro 'fileName' es obligatorio." });
    }

    const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: fileName,
        ContentType: 'image/jpeg'
    });

    try {
        const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
        res.json({ url });
    } catch (error) {
        console.error("Error al generar la URL de carga:", error);
        res.status(500).json({ error: 'Error generating upload URL' });
    }
};

export { generateUploadURL };
