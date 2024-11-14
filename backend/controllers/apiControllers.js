// controllers/apiControllers.js
import redisClient from '../config/redis.js';
import dynamodb from '../config/dynamodb.js';

export async function getProducts(req, res) {
    try {
        console.time('Redis');
        const cachedData = await redisClient.get('products');
        console.timeEnd('Redis');

        if (cachedData) {
            console.log('Datos obtenidos desde Redis');
            return res.json(JSON.parse(cachedData)); 
        }

        console.time('DynamoDB');
        const params = {
            TableName: 'Products',
        };
        const data = await dynamodb.scan(params).promise();
        console.timeEnd('DynamoDB');

        await redisClient.set('products', JSON.stringify(data.Items), { EX: 3600 }); // Expira en 1 hora
        console.log('Datos obtenidos desde DynamoDB y almacenados en Redis');

        res.json(data.Items);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener datos' });
    }
}
