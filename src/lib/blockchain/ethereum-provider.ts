import { ethers } from 'ethers';
import { BlockchainProvider, BlockchainMessage, WalletInfo } from './types';

// Simple ABI for our messaging contract
const MESSAGE_CONTRACT_ABI = [
  "event MessageSent(address indexed sender, address indexed recipient, string content, uint256 timestamp)",
  "function sendMessage(address recipient, string memory content) public",
  "function getMessages(address user) public view returns (tuple(address sender, address recipient, string content, uint256 timestamp)[] memory)"
];

// This would be your deployed contract address
const MESSAGE_CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Replace with actual contract

export class EthereumProvider implements BlockchainProvider {
  private provider: ethers.providers.Web3Provider | null = null;
  private signer: ethers.Signer | null = null;
  private messageContract: ethers.Contract | null = null;
  private address: string | null = null;

  constructor() {
    this.initProvider();
  }

  private initProvider() {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
    }
  }

  private async initContract() {
    if (!this.provider || !this.signer) return null;
    
    this.messageContract = new ethers.Contract(
      MESSAGE_CONTRACT_ADDRESS,
      MESSAGE_CONTRACT_ABI,
      this.signer
    );
    
    return this.messageContract;
  }

  async connect(): Promise<WalletInfo | null> {
    if (!this.provider) {
      console.error('MetaMask not installed');
      return null;
    }

    try {
      // Request account access
      const accounts = await this.provider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        console.error('No accounts available');
        return null;
      }

      this.address = accounts[0];
      this.signer = this.provider.getSigner();
      await this.initContract();

      const balance = await this.getBalance();
      
      return {
        address: this.address,
        blockchain: 'ethereum',
        balance,
        connected: true
      };
    } catch (error) {
      console.error('Error connecting to Ethereum wallet:', error);
      return null;
    }
  }

  async disconnect(): Promise<void> {
    this.signer = null;
    this.address = null;
    this.messageContract = null;
  }

  async getBalance(): Promise<string> {
    if (!this.provider || !this.address) return '0';
    
    try {
      const balance = await this.provider.getBalance(this.address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Error getting balance:', error);
      return '0';
    }
  }

  async sendMessage(recipient: string, content: string): Promise<BlockchainMessage | null> {
    if (!this.messageContract || !this.address || !this.signer) {
      console.error('Contract or wallet not initialized');
      return null;
    }
    
    try {
      // Send message transaction
      const tx = await this.messageContract.sendMessage(recipient, content);
      const receipt = await tx.wait();
      
      // Get event data from transaction receipt
      const event = receipt.events?.find(e => e.event === 'MessageSent');
      if (!event) {
        console.error('MessageSent event not found in transaction');
        return null;
      }
      
      // Create a signature using the sender's private key
      // This is a simplified demo - in a real app, you'd use a proper signing mechanism
      const messageHash = ethers.utils.id(`${this.address}:${recipient}:${content}:${Date.now()}`);
      const signature = await this.signer.signMessage(ethers.utils.arrayify(messageHash));
      
      return {
        id: tx.hash,
        sender: this.address,
        recipient,
        content,
        timestamp: Date.now(),
        signature,
        blockchain: 'ethereum'
      };
    } catch (error) {
      console.error('Error sending message on Ethereum:', error);
      return null;
    }
  }

  async getMessages(address: string): Promise<BlockchainMessage[]> {
    if (!this.messageContract || !this.address) {
      console.error('Contract or wallet not initialized');
      return [];
    }
    
    try {
      // In a real app, this would query your smart contract
      const rawMessages = await this.messageContract.getMessages(address);
      
      // Transform the raw data to our message format
      return rawMessages.map((msg: any, index: number) => ({
        id: `eth-msg-${index}`,
        sender: msg.sender,
        recipient: msg.recipient,
        content: msg.content,
        timestamp: msg.timestamp.toNumber(),
        signature: 'ethereum-signature', // In a real app, this would be a valid signature
        blockchain: 'ethereum' as const
      }));
    } catch (error) {
      console.error('Error fetching messages from Ethereum:', error);
      return [];
    }
  }

  listenForMessages(address: string, callback: (message: BlockchainMessage) => void): () => void {
    if (!this.messageContract) {
      console.error('Contract not initialized');
      return () => {};
    }
    
    // Set up event listener for new messages
    const filter = this.messageContract.filters.MessageSent(null, address);
    
    const handleEvent = (sender: string, recipient: string, content: string, timestamp: ethers.BigNumber) => {
      if (recipient.toLowerCase() === address.toLowerCase()) {
        const message: BlockchainMessage = {
          id: `eth-msg-${Date.now()}`,
          sender,
          recipient,
          content,
          timestamp: timestamp.toNumber(),
          signature: 'ethereum-signature', // In a real app, this would be a valid signature
          blockchain: 'ethereum'
        };
        
        callback(message);
      }
    };
    
    this.messageContract.on(filter, handleEvent);
    
    // Return cleanup function
    return () => {
      if (this.messageContract) {
        this.messageContract.off(filter, handleEvent);
      }
    };
  }
} 