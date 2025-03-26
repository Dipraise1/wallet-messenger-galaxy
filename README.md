# Wallet Messenger Galaxy

A real-time wallet-to-wallet messaging application that works across multiple blockchains.

## Features

- Real-time messaging using Socket.io
- On-chain messaging for Ethereum, Solana, and Base networks
- Wallet connection and authentication
- Multiple blockchain support
- Modern UI built with React, Tailwind CSS, and Shadcn components
- Responsive design for desktop and mobile

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MetaMask extension for Ethereum/Base messaging
- Phantom wallet or similar for Solana messaging

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

### Running the Application

You can use the start script to run both the frontend and backend servers:

```
./start.sh
```

Or run them separately:

1. Start the backend server:
   ```
   npm run server
   ```

2. Start the frontend development server:
   ```
   npm run dev
   ```

The application will be available at http://localhost:8080.

## On-Chain Messaging

This application supports both Socket.io-based real-time messaging and on-chain messaging through blockchain networks:

### Ethereum/Base
- Connect with MetaMask wallet
- Messages are sent through a smart contract (implementation is simplified for demonstration)
- Real-world implementation would use a deployed messaging contract

### Solana
- Connect with Phantom wallet
- Messages use Solana program (implementation is simplified for demonstration)
- Real-world implementation would use an actual deployed program

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Socket.io
- Express
- Ethers.js for Ethereum interactions
- @solana/web3.js for Solana interactions

## Building for Production

Build the application for production:

```
npm run build-all
```

The built application will be in the `dist` directory.
