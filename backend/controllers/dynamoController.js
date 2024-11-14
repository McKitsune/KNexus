import { GetCommand, PutCommand, DeleteCommand, UpdateCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from '../config/dynamodb.js';
import crypto from 'crypto';

const getProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const data = await ddbDocClient.send(new GetCommand({
            TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
            Key: { id }
        }));
        if (data.Item) {
            res.json(data.Item);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Error fetching product from DynamoDB' });
    }
};

const putProduct = async (req, res) => {
    const product = req.body;

    if (!product.id) {
        return res.status(400).json({ error: 'Product ID is required' });
    }

    try {
        await ddbDocClient.send(new PutCommand({
            TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
            Item: product
        }));

        res.status(201).json({ message: 'Product added or updated successfully' });
    } catch (error) {
        console.error('Error adding/updating product:', error);
        res.status(500).json({ error: 'Error adding or updating product in DynamoDB' });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const data = await ddbDocClient.send(new ScanCommand({
            TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
        }));
        res.json(data.Items);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Error fetching products from DynamoDB' });
    }
};


const updateProduct = async (req, res) => {
    const { id } = req.params;
    const updatedFields = req.body;

    if (!id || Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ error: 'Product ID and at least one field to update are required' });
    }

    try {
        // Construir la expresión de actualización
        const updateExpression = [];
        const expressionAttributeNames = {};
        const expressionAttributeValues = {};

        Object.keys(updatedFields).forEach((key, index) => {
            const attributeName = `#field${index}`;
            const attributeValue = `:value${index}`;

            updateExpression.push(`${attributeName} = ${attributeValue}`);
            expressionAttributeNames[attributeName] = key;
            expressionAttributeValues[attributeValue] = updatedFields[key];
        });

        await ddbDocClient.send(new UpdateCommand({
            TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
            Key: { id },
            UpdateExpression: `SET ${updateExpression.join(', ')}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: 'UPDATED_NEW'
        }));

        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Error updating product in DynamoDB' });
    }
};


const deleteProduct = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: 'Product ID is required' });
    }
    try {
        await ddbDocClient.send(new DeleteCommand({
            TableName: process.env.DYNAMODB_TABLE_PRODUCTS,
            Key: { id }
        }));
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Error deleting product' });
    }
};

const putUser = async (req, res) => {
    const user = req.body;
    user.userId = user.userId || crypto.randomUUID(); // Genera un ID si no existe

    try {
        await ddbDocClient.send(new PutCommand({
            TableName: process.env.DYNAMODB_TABLE_USERS,
            Item: user
        }));
        res.status(201).json({ message: 'User added or updated successfully' });
    } catch (error) {
        console.error('Error adding/updating user:', error);
        res.status(500).json({ error: 'Error adding or updating user in DynamoDB' });
    }
};

const getUser = async (req, res) => {
    const { userId, email } = req.params;
    try {
        const data = await ddbDocClient.send(new GetCommand({
            TableName: process.env.DYNAMODB_TABLE_USERS,
            Key: { userId, email }
        }));
        if (data.Item) {
            res.json(data.Item);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Error fetching user from DynamoDB' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const data = await ddbDocClient.send(new ScanCommand({
            TableName: process.env.DYNAMODB_TABLE_USERS,
        }));
        res.json(data.Items);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users from DynamoDB' });
    }
};

const deleteUser = async (req, res) => {
    const { userId, email } = req.params;
    try {
        await ddbDocClient.send(new DeleteCommand({
            TableName: process.env.DYNAMODB_TABLE_USERS,
            Key: { userId, email }
        }));
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user from DynamoDB' });
    }
};

export { getAllProducts, getProduct, putProduct, updateProduct, deleteProduct, getUser, putUser, deleteUser, getAllUsers };
