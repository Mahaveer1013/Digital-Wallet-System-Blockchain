import { ethers } from "ethers";
import { PRIVATE_KEY } from "../utils/constant.js";
import { provider } from "./blockchain.config.js";


// Function to send initial ETH to new user
export async function fundNewUserAccount(newUserAddress) {
    // Main funding wallet (private key should be kept secure)
    const fundingWallet = new ethers.Wallet(PRIVATE_KEY, provider);

    const jsonObject = {
        sender: "initial",
        receiver: newUserAddress.toString(),
        amount: ethers.parseEther("0.1").toString(),
        currency: "ETH",
        timestamp: new Date().toISOString(),
    }
    const jsonString = JSON.stringify(jsonObject);
    const hexData = ethers.hexlify(ethers.toUtf8Bytes(jsonString));
    // const hexData = ethers.hexlify(ethers.utils.toUtf8Bytes(jsonString)); 

    const transaction = {
        to: newUserAddress,
        data: hexData,
        value: ethers.parseEther("0.1"),  // Convert ETH amount to Wei
        gasLimit: 100000,   // Standard gas limit for basic transfer
    };

    try {
        // Send the transaction from the funding wallet
        const txResponse = await fundingWallet.sendTransaction(transaction);
        console.log("Funding Transaction Sent. Tx Hash:", txResponse.hash);

        // Wait for the transaction to be mined
        const txReceipt = await txResponse.wait();
        console.log("Funding Transaction Confirmed in Block", txReceipt.blockNumber);

        return txReceipt;
    } catch (error) {
        console.error("Error funding new user account:", error);
    }
}