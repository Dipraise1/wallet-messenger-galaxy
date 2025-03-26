// Common blockchain types
export type BlockchainNetwork = 'ethereum' | 'solana' | 'base';

export interface Blockchain {
  id: string;
  name: string;
  icon: string;
  color: string;
  chainId?: number; // For EVM chains
  network?: string; // For Solana
}

export interface BlockchainMessage {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: number;
  signature: string;
  blockchain: BlockchainNetwork;
}

export interface WalletInfo {
  address: string;
  blockchain: BlockchainNetwork;
  balance?: string;
  connected: boolean;
}

export interface BlockchainProvider {
  connect: () => Promise<WalletInfo | null>;
  disconnect: () => Promise<void>;
  getBalance: () => Promise<string>;
  sendMessage: (recipient: string, content: string) => Promise<BlockchainMessage | null>;
  getMessages: (address: string) => Promise<BlockchainMessage[]>;
  listenForMessages: (address: string, callback: (message: BlockchainMessage) => void) => () => void;
} 