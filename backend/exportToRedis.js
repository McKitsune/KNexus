import redisClient from './config/redis.js';
import { ddbDocClient } from './config/dynamodb.js';
import { ScanCommand } from '@aws-sdk/lib-dynamodb';

async function exportToRedis() {
    try {
        const params = {
            TableName: 'products', 
        };
        const data = await ddbDocClient.send(new ScanCommand(params));

        
        await redisClient.set('products', JSON.stringify(data.Items), { EX: 3600 }); // Expira en 1 hora
        console.log('Datos exportados a Redis.');
    } catch (error) {
        console.error('Error exportando datos:', error);
    } finally {
        await redisClient.disconnect();
    }
}

exportToRedis();
