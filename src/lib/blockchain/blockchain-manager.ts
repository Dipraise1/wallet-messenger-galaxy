import { BlockchainProvider, BlockchainNetwork, WalletInfo, Blockchain, BlockchainMessage } from './types';
import { EthereumProvider } from './ethereum-provider';
import { SolanaProvider } from './solana-provider';

export class BlockchainManager {
  private providers: Map<BlockchainNetwork, BlockchainProvider> = new Map();
  private activeProvider: BlockchainProvider | null = null;
  private activeNetwork: BlockchainNetwork | null = null;
  private walletInfo: WalletInfo | null = null;
  private messageListeners: Array<() => void> = [];

  private static instance: BlockchainManager | null = null;

  // Available blockchains
  private blockchains: Blockchain[] = [
    {
      id: 'ethereum',
      name: 'Ethereum',
      icon: '🔷',
      color: '#627EEA',
      chainId: 1,
    },
    {
      id: 'solana',
      name: 'Solana',
      icon: '🟣',
      color: '#9945FF',
      network: 'devnet',
    },
    {
      id: 'base',
      name: 'Base',
      icon: '🔵',
      color: '#0052FF',
      chainId: 8453,
    }
  ];

  private constructor() {
    // Initialize providers
    this.providers.set('ethereum', new EthereumProvider());
    this.providers.set('solana', new SolanaProvider());
    
    // For Base, we can reuse Ethereum provider since it's EVM compatible
    // Just need to set the right chain ID when connecting
    this.providers.set('base', new EthereumProvider());
  }

  static getInstance(): BlockchainManager {
    if (!BlockchainManager.instance) {
      BlockchainManager.instance = new BlockchainManager();
    }
    return BlockchainManager.instance;
  }

  getBlockchains(): Blockchain[] {
    return this.blockchains;
  }

  getActiveProvider(): BlockchainProvider | null {
    return this.activeProvider;
  }

  getWalletInfo(): WalletInfo | null {
    return this.walletInfo;
  }

  getActiveNetwork(): BlockchainNetwork | null {
    return this.activeNetwork;
  }

  async connectWallet(network: BlockchainNetwork): Promise<WalletInfo | null> {
    const provider = this.providers.get(network);
    
    if (!provider) {
      console.error(`No provider available for network: ${network}`);
      return null;
    }
    
    try {
      const walletInfo = await provider.connect();
      
      if (walletInfo) {
        this.activeProvider = provider;
        this.activeNetwork = network;
        this.walletInfo = walletInfo;
        
        // Start listening for messages
        this.startMessageListening(walletInfo.address);
      }
      
      return walletInfo;
    } catch (error) {
      console.error(`Error connecting to ${network} wallet:`, error);
      return null;
    }
  }

  async disconnectWallet(): Promise<void> {
    if (this.activeProvider) {
      await this.activeProvider.disconnect();
      
      // Clean up message listeners
      this.stopMessageListening();
      
      this.activeProvider = null;
      this.activeNetwork = null;
      this.walletInfo = null;
    }
  }

  async sendMessage(recipient: string, content: string): Promise<BlockchainMessage | null> {
    if (!this.activeProvider || !this.walletInfo) {
      console.error('No active wallet connection');
      return null;
    }
    
    return this.activeProvider.sendMessage(recipient, content);
  }

  async getMessages(): Promise<BlockchainMessage[]> {
    if (!this.activeProvider || !this.walletInfo) {
      console.error('No active wallet connection');
      return [];
    }
    
    return this.activeProvider.getMessages(this.walletInfo.address);
  }

  private startMessageListening(address: string): void {
    // Clean up any existing listeners
    this.stopMessageListening();
    
    if (this.activeProvider) {
      const messageHandler = (message: BlockchainMessage) => {
        // Dispatch a custom event with the new message
        const event = new CustomEvent('blockchain-message', { 
          detail: { message } 
        });
        window.dispatchEvent(event);
        
        console.log(`New message received on ${this.activeNetwork}:`, message);
      };
      
      // Add the new listener
      const cleanup = this.activeProvider.listenForMessages(address, messageHandler);
      this.messageListeners.push(cleanup);
    }
  }

  private stopMessageListening(): void {
    // Run all cleanup functions
    this.messageListeners.forEach(cleanup => cleanup());
    this.messageListeners = [];
  }
} 