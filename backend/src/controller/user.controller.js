import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ethers } from 'ethers'; // For creating a wallet address
import { fundNewUserAccount } from '../blockchain/initial-amount.bc.js';
import { JWT_SECRET } from '../utils/constant.js';
import { encryptPrivateKey } from '../utils/function.js';
import { moneyTransfer, walletHistory } from '../blockchain/transaction.bc.js';
import { provider } from '../blockchain/blockchain.config.js';

export function getUser(req, res) {
  res.json(req.user);
}

export async function register(req, res) {
  try {
    console.log(req.body);

    const { email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const wallet = ethers.Wallet.createRandom();
    const publicKey = wallet.address;
    const encryptedPrivateKey = encryptPrivateKey(wallet.privateKey)
    fundNewUserAccount(publicKey);

    const newUser = await User.create({
      email,
      phone,
      password: hashedPassword,
      wallet_address: publicKey, // Save generated wallet address
      privateKey: encryptedPrivateKey, // Save generated wallet address
    });

    res.status(201).json({ message: 'User registered successfully', user_id: newUser.user_id, wallet_address: wallet.address });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ error: 'Invalid email or password' });

    // Generate JWT token
    const token = jwt.sign({ user_id: user.user_id, wallet_address: user.wallet_address }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, wallet_address: user.wallet_address });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export async function sendMoney(req, res) {
  try {
    const data = req.body
    if (!data.wallet_address || !data.amount) {
      return res.status(400).json({ error: 'Data is required' });
    }
    if (typeof data.amount !== "number" || isNaN(data.amount)) {
      return res.status(400).json({ error: 'Amount must be Number' });
    }

    moneyTransfer(req.user.wallet_address, data.wallet_address, data.amount)

    res.status(201).json({
      message: 'Money Transfered successfully',
    })
  } catch (error) {
    console.log(error);
  }
}

export const getWalletHistory = async (req, res) => {
  const history = await walletHistory(req.user.wallet_address);
  res.json(history);
}