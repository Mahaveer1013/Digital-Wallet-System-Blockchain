import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { Transaction } from './transaction.model.js';
import { BlockchainTransaction } from './blockchainTransaction.model.js';
import { Logs } from './logs.js';

export const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  password: DataTypes.STRING,
  wallet_address: DataTypes.STRING,
  privateKey: DataTypes.STRING,
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
});

// Define relationships
User.hasMany(Transaction, { foreignKey: 'sender_wallet_id' });
User.hasMany(BlockchainTransaction, { foreignKey: 'user_id' });
User.hasMany(Logs, { foreignKey: 'user_id' });


