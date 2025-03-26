import { Transaction } from '@solana/web3.js';

// Define minimal interfaces for blockchain providers
interface SolanaWallet {
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions?: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage?: (message: Uint8Array) => Promise<{ signature: Uint8Array }>;
  publicKey?: { toString: () => string };
  isPhantom?: boolean;
}

interface EthereumProvider {
  isMetaMask?: boolean;
  request: (request: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (eventName: string, callback: (...args: unknown[]) => void) => void;
  removeListener: (eventName: string, callback: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
    solana?: SolanaWallet;
    solflare?: SolanaWallet;
  }
}  