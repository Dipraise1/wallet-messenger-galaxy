import React, { useState } from 'react';
import { useBlockchain } from '../lib/blockchain/blockchain-context';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface BlockchainTransactionProps {
  cid: string;
  onComplete: (txHash: string) => void;
  onError: (error: string) => void;
}

const BlockchainTransaction: React.FC<BlockchainTransactionProps> = ({ 
  cid, 
  onComplete, 
  onError 
}) => {
  const { walletInfo, activeNetwork } = useBlockchain();
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);

  // Mock function to simulate a transaction
  // In a real implementation, this would interact with the blockchain
  const saveProfileCIDToBlockchain = async () => {
    if (!walletInfo || !activeNetwork || !cid) {
      throw new Error('Wallet not connected or CID not provided');
    }

    // In a real implementation, we would:
    // 1. Create a transaction to store the CID on-chain
    // 2. Sign the transaction with the wallet
    // 3. Wait for confirmation
    // 4. Return the transaction hash

    // For this demo, we'll simulate the process
    return new Promise<string>((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Generate a mock transaction hash (in real world this would come from the blockchain)
        const txHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        
        // Randomly succeed or fail (90% success rate for demo)
        const success = Math.random() < 0.9;
        
        if (success) {
          resolve(txHash);
        } else {
          reject(new Error('Transaction failed. The network may be congested.'));
        }
      }, 2000); // Simulate 2 second delay
    });
  };

  // Get estimated gas cost (mock function)
  const estimateGas = async () => {
    if (activeNetwork === 'ethereum' || activeNetwork === 'base') {
      return '0.0012 ETH';
    } else if (activeNetwork === 'solana') {
      return '0.000005 SOL';
    }
    return 'Unknown';
  };

  // Start the transaction process
  const startTransaction = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Get gas estimate
      const estimate = await estimateGas();
      setGasEstimate(estimate);
      
      // Execute transaction
      const txHash = await saveProfileCIDToBlockchain();
      
      // Update state with transaction hash
      setTransactionHash(txHash);
      
      // Call completion callback
      onComplete(txHash);
    } catch (err) {
      console.error('Transaction error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-4">
      <h3 className="text-md font-medium mb-3">Save Profile On-Chain</h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Store your profile CID permanently on the {activeNetwork} blockchain for improved discoverability.
        This requires a small transaction fee.
      </p>
      
      {gasEstimate && !transactionHash && !error && (
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded mb-4">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            Estimated gas fee: {gasEstimate}
          </p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 p-3 rounded mb-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-300">
            {error}
          </p>
        </div>
      )}
      
      {transactionHash && (
        <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded mb-4 flex items-start">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-green-800 dark:text-green-300 font-medium">
              Profile saved on-chain successfully!
            </p>
            <p className="text-xs text-green-700 dark:text-green-400 mt-1 font-mono break-all">
              Transaction: {transactionHash}
            </p>
          </div>
        </div>
      )}
      
      <div className="flex justify-end mt-2">
        {!transactionHash && (
          <button
            onClick={startTransaction}
            disabled={isProcessing || !walletInfo || !cid}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              'Save On-Chain'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default BlockchainTransaction; 