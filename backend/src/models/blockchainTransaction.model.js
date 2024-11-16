import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

// Define Blockchain Transaction Model
export const BlockchainTransaction = sequelize.define('BlockchainTransaction', {
    blockchain_tx_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    user_id: DataTypes.UUID,
    wallet_address: DataTypes.STRING,
    blockchain_type: DataTypes.STRING,
    amount: DataTypes.FLOAT,
    tx_hash: DataTypes.STRING,
    gas_fee: DataTypes.FLOAT,
    status: DataTypes.STRING,
    timestamp: DataTypes.DATE,
});


