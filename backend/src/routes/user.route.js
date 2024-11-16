// routes/userRoutes.js
import express from 'express';
import { getUser, getWalletHistory, login, register, sendMoney } from '../controller/user.controller.js';
import { loginRequired } from '../middleware/middleware.js';

export const userRoutes = express.Router();

userRoutes.get('/', loginRequired, getUser)

userRoutes.post('/register', register);
userRoutes.post('/login', login);
userRoutes.post('/send-money', loginRequired, sendMoney)
userRoutes.get('/wallet/history',loginRequired, getWalletHistory);

export default userRoutes;

