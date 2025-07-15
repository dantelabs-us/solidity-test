# **Skill Test: Smart Contract Development and Backend Integration**

## **Objective**
The goal of this test is to evaluate your ability to:
1. Develop a simple smart contract in Solidity.
2. Connect the smart contract to a Node.js backend using **ethers.js** or **web3.js**.
3. Expose RESTful API endpoints to interact with the smart contract.

---

## **Part 1: Smart Contract Development**

### **Requirements**
1. **Create a Token Contract**:
   - **Token Name**: `TestToken`
   - **Token Symbol**: `STT`
   - **Initial Supply**: Mint `1000` tokens to the contract deployer.
   - Implement the following functions:
     - `mint(address to, uint256 amount)`  
       - Allows only the owner to mint tokens.
     - `burn(uint256 amount)`  
       - Allows users to burn tokens from their own balance.
     - `balanceOf(address account)`  
       - Returns the token balance of a given address.

2. **Technical Details**:
   - Use Solidity version `^0.8.0`.
   - Use OpenZeppelin’s **Ownable** contract for owner-based access control.
   - Deploy the smart contract to a public testnet, such as **Sepolia** or **Goerli**.

---

## **Part 2: Node.js Backend Integration**

### **Requirements**
1. **Set Up the Node.js Backend**:
   - Use **Express.js** to create the backend server.
   - Use **ethers.js** or **web3.js** to connect to the deployed smart contract.

2. **Implement the Following API Endpoints**:

### **1. Mint Tokens**
   - **Endpoint**: `POST /mint`  
   - **Request Body**:
     ```json
     {
       "to": "0xRecipientAddress",
       "amount": 50
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Tokens minted successfully",
       "transactionHash": "0xTransactionHash"
     }
     ```

### **2. Burn Tokens**
   - **Endpoint**: `POST /burn`  
   - **Request Body**:
     ```json
     {
       "amount": 20
     }
     ```
   - **Response**:
     ```json
     {
       "message": "Tokens burned successfully",
       "transactionHash": "0xTransactionHash"
     }
     ```

### **3. Get Balance**
   - **Endpoint**: `GET /balance/:address`  
   - **Response**:
     ```json
     {
       "balance": 100
     }
     ```
     
---
