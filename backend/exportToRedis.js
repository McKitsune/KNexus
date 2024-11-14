import { ddbDocClient } from './config/dynamodb.js'; 
import redisClient from './config/redis.js';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

async function exportToRedis() {
    const params = {
        TableName: 'Products',
    };

    try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        for (const producto of data.Items) {
            await redisClient.set(`producto:${producto.id}`, JSON.stringify(producto));
        }
        console.log('Datos exportados a Redis.');
    } catch (error) {
        console.error('Error exportando datos:', error);
    }
}

exportToRedis();
