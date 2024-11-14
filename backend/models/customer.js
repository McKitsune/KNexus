import { DataTypes } from 'sequelize';
import sequelize from 'index.js';

const Customer = sequelize.define('Customer',{
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        validate: {
            min: 8
        }
    },
});

export default Customer;