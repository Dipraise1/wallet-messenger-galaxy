import { 
  Connection, 
  PublicKey, 
  SystemProgram, 
  Transaction,
  LAMPORTS_PER_SOL,
  TransactionInstruction
} from '@solana/web3.js';
import { BlockchainProvider, BlockchainMessage, WalletInfo } from './types';

// Import SolanaWallet interface from the global declarations
type SolanaWallet = Window['solana'];

// This would be your deployed Solana program for messaging
const MESSAGE_PROGRAM_ID = '11111111111111111111111111111111'; // Using System Program as placeholder

export class SolanaProvider implements BlockchainProvider {
  private wallet: SolanaWallet | null = null;
  private connection: Connection | null = null;
  private address: string | null = null;
  private programId: PublicKey | null = null;

  constructor() {
    this.initProvider();
  }

  private initProvider() {
    // Check if Solana wallet is available
    if (typeof window !== 'undefined' && window.solana) {
      this.wallet = window.solana;
      
      // Connect to Solana network (devnet for testing)
      this.connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      
      try {
        // Use a known valid program ID (SystemProgram ID)
        this.programId = SystemProgram.programId;
      } catch (error) {
        console.error('Error initializing Solana program ID:', error);
      }
    }
  }

  async connect(): Promise<WalletInfo | null> {
    if (!this.wallet || !this.connection) {
      console.error('Solana wallet not available');
      return null;
    }

    try {
      // Request wallet connection
      const resp = await this.wallet.connect();
      this.address = resp.publicKey.toString();
      
      const balance = await this.getBalance();
      
      return {
        address: this.address,
        blockchain: 'solana',
        balance,
        connected: true
      };
    } catch (error) {
      console.error('Error connecting to Solana wallet:', error);
      return null;
    }
  }

  async disconnect(): Promise<void> {
    if (this.wallet) {
      await this.wallet.disconnect();
    }
    this.address = null;
  }

  async getBalance(): Promise<string> {
    if (!this.connection || !this.address) return '0';
    
    try {
      const publicKey = new PublicKey(this.address);
      const balance = await this.connection.getBalance(publicKey);
      return (balance / LAMPORTS_PER_SOL).toString();
    } catch (error) {
      console.error('Error getting Solana balance:', error);
      return '0';
    }
  }

  async sendMessage(recipient: string, content: string): Promise<BlockchainMessage | null> {
    if (!this.wallet || !this.connection || !this.address || !this.programId) {
      console.error('Solana wallet not properly initialized');
      return null;
    }
    
    try {
      // Validate the recipient address
      let recipientPubkey: PublicKey;
      try {
        recipientPubkey = new PublicKey(recipient);
      } catch (error) {
        console.error('Invalid Solana recipient address:', error);
        return null;
      }
      
      // Create instruction data (simplified for this example)
      // In a real implementation, you'd properly serialize your message data
      const data = Buffer.from(JSON.stringify({
        action: 'send_message',
        content,
        timestamp: Date.now()
      }));
      
      // Create a transaction instruction
      const instruction = new TransactionInstruction({
        keys: [
          { pubkey: new PublicKey(this.address), isSigner: true, isWritable: true },
          { pubkey: recipientPubkey, isSigner: false, isWritable: true },
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }
        ],
        programId: this.programId,
        data
      });
      
      // Create a new transaction and add the instruction
      const transaction = new Transaction().add(instruction);
      
      // Set recent blockhash and sign transaction
      transaction.recentBlockhash = (await this.connection.getRecentBlockhash()).blockhash;
      transaction.feePayer = new PublicKey(this.address);
      
      // Sign and send transaction
      const signedTransaction = await this.wallet.signTransaction(transaction);
      const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
      
      // Wait for confirmation
      await this.connection.confirmTransaction(signature);
      
      return {
        id: signature,
        sender: this.address,
        recipient,
        content,
        timestamp: Date.now(),
        signature,
        blockchain: 'solana'
      };
    } catch (error) {
      console.error('Error sending message on Solana:', error);
      return null;
    }
  }

  async getMessages(address: string): Promise<BlockchainMessage[]> {
    if (!this.connection || !this.programId) {
      console.error('Solana connection not initialized');
      return [];
    }
    
    try {
      // In a real app, you would query your Solana program for messages
      // This is a simplified placeholder
      console.log(`Fetching messages for ${address} on Solana`);
      
      // Simulate fetching messages (replace with actual implementation)
      return [
        {
          id: 'solana-msg-1',
          sender: 'SolanaAddressSender123',
          recipient: address,
          content: 'Hello from Solana blockchain!',
          timestamp: Date.now() - 3600000, // 1 hour ago
          signature: 'solana-signature-example',
          blockchain: 'solana'
        }
      ];
    } catch (error) {
      console.error('Error fetching messages from Solana:', error);
      return [];
    }
  }

  listenForMessages(address: string, callback: (message: BlockchainMessage) => void): () => void {
    if (!this.connection) {
      console.error('Solana connection not initialized');
      return () => {};
    }
    
    // This is a simplified approach for demonstration purposes
    // In a real app, you would use program account subscriptions or other methods
    
    // Create an interval to periodically check for new messages
    // This is not efficient for production use
    const intervalId = setInterval(async () => {
      try {
        // Simulate receiving a new message
        const randomReceive = Math.random() > 0.8;
        
        if (randomReceive) {
          const message: BlockchainMessage = {
            id: `solana-msg-${Date.now()}`,
            sender: 'SolanaRandomSender',
            recipient: address,
            content: `New message at ${new Date().toLocaleTimeString()}`,
            timestamp: Date.now(),
            signature: 'solana-signature-example',
            blockchain: 'solana'
          };
          
          callback(message);
        }
      } catch (error) {
        console.error('Error in Solana message listener:', error);
      }
    }, 15000); // Check every 15 seconds
    
    // Return cleanup function
    return () => {
      clearInterval(intervalId);
    };
  }
} 