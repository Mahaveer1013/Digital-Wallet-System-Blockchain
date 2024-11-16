// config/db.js
import { Sequelize } from 'sequelize';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER, PROD } from '../utils/constant.js';

const isProduction = PROD === 'true';  // This will be 'true' in production

let sequelize;

if (isProduction) {
  // Use PostgreSQL in production
  sequelize = new Sequelize({
    dialect: 'postgres',
    host: DB_HOST,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT || 5432,  // Default to 5432 if DB_PORT isn't set
    logging: false,  // Disable query logging
    // dialectOptions: {
    //   ssl: {
    //     require: true,               // Require SSL for production
    //     rejectUnauthorized: false,   // Allow self-signed certificates
    //   },
    // },
  });
} else {
  // Use SQLite in development (default)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',   // SQLite file location
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,               // Require SSL for production
        rejectUnauthorized: false,   // Allow self-signed certificates
      },
    },// Disable query logging
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
};

export { sequelize, connectDB };
