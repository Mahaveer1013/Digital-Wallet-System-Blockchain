import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

export const Transaction = sequelize.define('Transaction', {
    transaction_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4
    },
    sender_wallet_id: DataTypes.UUID,
    receiver_wallet_id: DataTypes.UUID,
    amount: DataTypes.FLOAT,
    currency: DataTypes.STRING,
    status: DataTypes.STRING,
    blockchain_tx_hash: DataTypes.STRING,
    timestamp: DataTypes.DATE,
});


