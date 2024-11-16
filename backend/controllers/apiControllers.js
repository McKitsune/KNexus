import redisClient from '../config/redis.js';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from '../config/dynamodb.js';

export async function getProductos(req, res) {
    try {
        
        const cachedData = await redisClient.get('products');

        if (cachedData) {
            console.log('🔴 Datos obtenidos desde Redis');
            return res.json(JSON.parse(cachedData)); 
        }

        
        const params = {
            TableName: 'Products', 
        };
        const data = await ddbDocClient.send(new ScanCommand(params));

        
        await redisClient.set('productos', JSON.stringify(data.Items), { EX: 3600 }); // Expira en 1 hora
        console.log('🟢 Datos obtenidos desde DynamoDB y almacenados en Redis');

        res.json(data.Items);
    } catch (err) {
        console.error('Error al obtener datos:', err);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
}
