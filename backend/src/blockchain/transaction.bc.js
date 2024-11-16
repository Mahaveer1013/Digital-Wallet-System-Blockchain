import { User } from '../models/user.model.js';
import { ethers } from 'ethers';
import { provider } from './blockchain.config.js';
import axios from "axios";
import { decryptPrivateKey } from '../utils/function.js';

// Function to get current ETH to INR rate
async function getEthToInrRate() {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
    return response.data.ethereum.inr;  // Get the price of 1 ETH in INR
}

// Function to convert INR to ETH
async function convertInrToEth(inrAmount) {
    const rate = await getEthToInrRate();
    return inrAmount / rate;  // Convert INR to ETH
}

// Function to send INR-equivalent amount in ETH
export async function moneyTransfer(userPublicAddress, recipientPublicAddress, amountInInr) {
    const user = await User.findOne({ where: { wallet_address: userPublicAddress } });
    if (!user) {
        return { error: 'User not found' };
    }

    // Decrypt the private key stored in the database
    const decryptedPrivateKey = await decryptPrivateKey(user.privateKey);  // Decrypting the private key

    if (!decryptedPrivateKey) {
        return { error: 'Failed to decrypt private key' };
    }

    // Create wallet using decrypted private key
    const wallet = new ethers.Wallet(decryptedPrivateKey, provider);

    const senderBalanceBefore = await provider.getBalance(userPublicAddress);
    console.log(`Sender's balance before transaction: ${ethers.formatEther(senderBalanceBefore)} ETH`);

    // Log the receiver's balance before transaction
    const receiverBalanceBefore = await provider.getBalance(recipientPublicAddress);
    console.log(`Receiver's balance before transaction: ${ethers.formatEther(receiverBalanceBefore)} ETH`);

    const ethAmount = await convertInrToEth(amountInInr);

    const transaction = {
        to: recipientPublicAddress,
        value: ethers.parseEther(ethAmount.toString()),
    };

    try {
        const txResponse = await wallet.sendTransaction(transaction);
        console.log("Transaction Sent. Tx Hash:", txResponse.hash);

        const txReceipt = await txResponse.wait();
        console.log("Transaction Confirmed in Block", txReceipt.blockNumber);

        const senderBalanceBefore = await provider.getBalance(userPublicAddress);
        console.log(`Sender's balance before transaction: ${ethers.formatEther(senderBalanceBefore)} ETH`);

        // Log the receiver's balance before transaction
        const receiverBalanceBefore = await provider.getBalance(recipientPublicAddress);
        console.log(`Receiver's balance before transaction: ${ethers.formatEther(receiverBalanceBefore)} ETH`);
        return txReceipt;
    } catch (error) {
        console.error("Error in transaction:", error);
    }
}

export const walletHistory = async (address) => {
    try {
        const filter = {
            address: address, // the address of interest
            fromBlock: 0,  // starting from the genesis block
            toBlock: 'latest',  // until the latest block
        };

        // Get logs for the address
        const logs = await provider.getLogs(filter);
        
        // Optionally, you can process these logs into transaction data if needed
        console.log(logs);  // This will give you an array of logs (events or transactions)
        
        // Return formatted data (you can process the logs as needed)
        return logs.map(log => ({
            transactionHash: log.transactionHash,
            blockNumber: log.blockNumber,
            data: log.data,
        }));
    } catch (error) {
        console.error('Error fetching wallet history:', error);
    }
};

// export async function getAllBlocks() {
//     const latestBlock = await provider.getBlockNumber();  // Get the latest block number
//     for (let blockNumber = 0; blockNumber <= latestBlock; blockNumber++) {
//       const block = await provider.getBlock(blockNumber);
//       console.log(block);  // Output block data, you can store it or process it further
//     }
//   }
  
//   getAllBlocks();