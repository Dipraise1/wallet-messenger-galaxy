import React, { createContext, useContext, useEffect, useState } from 'react';
import { BlockchainManager } from './blockchain-manager';
import { BlockchainNetwork, WalletInfo, Blockchain, BlockchainMessage } from './types';

interface BlockchainContextType {
  blockchains: Blockchain[];
  walletInfo: WalletInfo | null;
  activeNetwork: BlockchainNetwork | null;
  isConnecting: boolean;
  messages: BlockchainMessage[];
  connectWallet: (network: BlockchainNetwork) => Promise<boolean>;
  disconnectWallet: () => Promise<void>;
  sendMessage: (recipient: string, content: string) => Promise<BlockchainMessage | null>;
  refreshMessages: () => Promise<void>;
}

const BlockchainContext = createContext<BlockchainContextType>({
  blockchains: [],
  walletInfo: null,
  activeNetwork: null,
  isConnecting: false,
  messages: [],
  connectWallet: async () => false,
  disconnectWallet: async () => {},
  sendMessage: async () => null,
  refreshMessages: async () => {},
});

export const useBlockchain = () => useContext(BlockchainContext);

interface BlockchainProviderProps {
  children: React.ReactNode;
}

export const BlockchainProvider: React.FC<BlockchainProviderProps> = ({ children }) => {
  const [manager] = useState<BlockchainManager>(BlockchainManager.getInstance());
  const [blockchains, setBlockchains] = useState<Blockchain[]>([]);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [activeNetwork, setActiveNetwork] = useState<BlockchainNetwork | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [messages, setMessages] = useState<BlockchainMessage[]>([]);

  // Initialize blockchains
  useEffect(() => {
    setBlockchains(manager.getBlockchains());
  }, [manager]);

  // Listen for blockchain messages
  useEffect(() => {
    const handleBlockchainMessage = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: BlockchainMessage }>;
      const { message } = customEvent.detail;
      
      setMessages(prev => {
        // Check if message already exists to avoid duplicates
        const exists = prev.some(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
    };
    
    window.addEventListener('blockchain-message', handleBlockchainMessage);
    
    return () => {
      window.removeEventListener('blockchain-message', handleBlockchainMessage);
    };
  }, []);

  const connectWallet = async (network: BlockchainNetwork): Promise<boolean> => {
    setIsConnecting(true);
    
    try {
      const info = await manager.connectWallet(network);
      
      if (info) {
        setWalletInfo(info);
        setActiveNetwork(network);
        
        // Initial messages load
        refreshMessages();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async (): Promise<void> => {
    try {
      await manager.disconnectWallet();
      setWalletInfo(null);
      setActiveNetwork(null);
      setMessages([]);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const sendMessage = async (recipient: string, content: string): Promise<BlockchainMessage | null> => {
    try {
      const message = await manager.sendMessage(recipient, content);
      
      if (message) {
        // Add the message to our local state
        setMessages(prev => [...prev, message]);
      }
      
      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  };

  const refreshMessages = async (): Promise<void> => {
    try {
      const msgs = await manager.getMessages();
      setMessages(msgs);
    } catch (error) {
      console.error('Error refreshing messages:', error);
    }
  };

  const value = {
    blockchains,
    walletInfo,
    activeNetwork,
    isConnecting,
    messages,
    connectWallet,
    disconnectWallet,
    sendMessage,
    refreshMessages,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
}; 