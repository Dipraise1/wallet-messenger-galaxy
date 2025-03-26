import React, { useState } from 'react';
import { useBlockchain } from '../lib/blockchain/blockchain-context';
import { Blockchain, BlockchainNetwork } from '../lib/blockchain/types';
import { Loader2 } from 'lucide-react';

interface BlockchainSelectorProps {
  onSelect: (blockchain: Blockchain) => void;
}

export const BlockchainSelector: React.FC<BlockchainSelectorProps> = ({ onSelect }) => {
  const { blockchains, connectWallet, isConnecting } = useBlockchain();
  const [selectedBlockchainId, setSelectedBlockchainId] = useState<string | null>(null);

  const handleSelect = async (blockchain: Blockchain) => {
    setSelectedBlockchainId(blockchain.id);
    
    try {
      // Connect to the selected blockchain
      const success = await connectWallet(blockchain.id as BlockchainNetwork);
      
      if (success) {
        // Call the onSelect callback to progress to the next step
        onSelect(blockchain);
      } else {
        setSelectedBlockchainId(null);
      }
    } catch (error) {
      console.error('Error connecting to blockchain:', error);
      setSelectedBlockchainId(null);
    }
  };

  return (
    <div className="glass-card rounded-xl p-6 max-w-md w-full animate-fade-in">
      <h2 className="text-xl font-semibold text-center mb-2">Select Blockchain</h2>
      <p className="text-gray-400 text-center mb-6 text-sm">
        Choose a blockchain network to continue
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {blockchains.map((blockchain) => {
          const isSelected = selectedBlockchainId === blockchain.id;
          const isLoading = isConnecting && isSelected;
          
          return (
            <button
              key={blockchain.id}
              onClick={() => handleSelect(blockchain)}
              disabled={isConnecting}
              className={`button-hover flex flex-col items-center justify-center p-4 rounded-lg border border-${blockchain.color}/30 ${
                isSelected ? `bg-${blockchain.color}/20` : 'bg-darkBg3/50'
              } hover:bg-${blockchain.color}/10 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <Loader2 className="w-8 h-8 mb-2 animate-spin text-white" />
              ) : (
                <span className="text-2xl mb-2">{blockchain.icon}</span>
              )}
              <span className="text-sm font-medium">{blockchain.name}</span>
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-xs text-gray-500 text-center">
          You can change your selected blockchain at any time
        </p>
      </div>
    </div>
  );
};
