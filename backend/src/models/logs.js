import { Sequelize, DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';


// Define the Logs Model
export const Logs = sequelize.define('Logs', {
  log_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false, // Describes the action taken (e.g., login, transaction)
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false, // Action status (e.g., 'success', 'failed')
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true, // Optional message for additional context
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW // Log timestamp
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW
  }
});


