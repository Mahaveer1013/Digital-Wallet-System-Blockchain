import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { JWT_SECRET } from '../utils/constant.js';


export const loginRequired = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decodedData = jwt.verify(token, JWT_SECRET);
        const user = await User.findOne({ where: { user_id: decodedData.user_id } });

        if (!user.email || !user.wallet_address) {
            return res.status(404).json({ message: 'Some Requiremnets Not Found' })
        }
        req.user = {
            user_id: user.user_id,
            email: user.email,
            wallet_address: user.wallet_address
        };
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Failed to decrypt authorization token' });
    }
};

