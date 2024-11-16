import { configDotenv } from "dotenv"
configDotenv()


export const PORT = process.env.PORT || 5000
export const JWT_SECRET = process.env.JWT_SECRET
export const PROD = process.env.PROD
export const DB_HOST = process.env.DB_HOST
export const DB_USER = process.env.DB_USER
export const DB_PASSWORD = process.env.DB_PASSWORD
export const DB_NAME = process.env.DB_NAME
export const DB_PORT = process.env.DB_PORT
export const PRIVATE_KEY = process.env.PRIVATE_KEY
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
