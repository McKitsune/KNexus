import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PutCommand, GetCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocClient } from '../config/dynamodb.js';

const CustomerController = {
  // Crear un nuevo usuario
  create: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // Verificar si el correo ya está registrado en DynamoDB
      const data = await ddbDocClient.send(new GetCommand({
        TableName: process.env.DYNAMODB_TABLE_USERS,
        Key: { email }
      }));

      if (data.Item) {
        return res.status(409).json({ error: "El correo ya está registrado" });
      }

      // Cifrar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el usuario en DynamoDB
      const newUser = { id: Date.now().toString(), name, email, password: hashedPassword };
      await ddbDocClient.send(new PutCommand({
        TableName: process.env.DYNAMODB_TABLE_USERS,
        Item: newUser
      }));

      return res.status(201).json({ message: "Usuario creado exitosamente", user: newUser });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Inicio de sesión de usuario
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const customer = await Customer.findOne({ where: { email } });

      if (!customer) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      // Comparar la contraseña ingresada con la contraseña cifrada en la base de datos
      const isPasswordValid = await bcrypt.compare(password, customer.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Credenciales inválidas" });
      }

      // Generar el token JWT
      const token = jwt.sign({ id: customer.id, email: customer.email }, process.env.JWT_SECRET, {
        expiresIn: '1h', // El token expira en 1 hora
      });

      return res.status(200).json({ message: "Inicio de sesión exitoso", token });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  

  // Obtener todos los usuarios (requiere autenticación)
  getAllCustomers: async (req, res) => {
    try {
      const customers = await Customer.findAll();
      return res.status(200).json({ customers });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Actualizar usuario
  updateCustomer: async (req, res) => {
    try {
      const { name, email } = req.body;
      const { id } = req.params;
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      customer.name = name || customer.name;
      customer.email = email || customer.email;

      await customer.save();
      return res.status(200).json({ message: "Usuario actualizado", customer });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Eliminar usuario
  deleteCustomer: async (req, res) => {
    try {
      const { id } = req.params;
      const customer = await Customer.findByPk(id);
      if (!customer) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      await customer.destroy();
      return res.status(200).json({ message: "Usuario eliminado" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Obtener perfil de usuario
  getProfile: async (req, res) => {
    try {
      const customer = await Customer.findByPk(req.customer.id); // `req.customer` es añadido por el middleware auth
      if (!customer) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      return res.status(200).json({ name: customer.name, email: customer.email });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};

export default CustomerController;
