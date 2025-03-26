
import React from 'react';

interface Blockchain {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface BlockchainSelectorProps {
  onSelect: (blockchain: Blockchain) => void;
}

export const BlockchainSelector: React.FC<BlockchainSelectorProps> = ({ onSelect }) => {
  const blockchains: Blockchain[] = [
    { 
      id: 'ethereum', 
      name: 'Ethereum', 
      icon: '🔷', 
      color: 'neonBlue' 
    },
    { 
      id: 'solana', 
      name: 'Solana', 
      icon: '🟣', 
      color: 'neonPurple' 
    },
    { 
      id: 'base', 
      name: 'Base', 
      icon: '🔵', 
      color: 'neonBlue' 
    },
    { 
      id: 'polygon', 
      name: 'Polygon', 
      icon: '🟪', 
      color: 'neonPurple' 
    },
    { 
      id: 'avalanche', 
      name: 'Avalanche', 
      icon: '🔺', 
      color: 'neonPink' 
    },
    { 
      id: 'bsc', 
      name: 'BNB Chain', 
      icon: '🟡', 
      color: 'neonGreen' 
    },
  ];

  return (
    <div className="glass-card rounded-xl p-6 max-w-md w-full animate-fade-in">
      <h2 className="text-xl font-semibold text-center mb-2">Select Blockchain</h2>
      <p className="text-gray-400 text-center mb-6 text-sm">
        Choose a blockchain network to continue
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {blockchains.map((blockchain) => (
          <button
            key={blockchain.id}
            onClick={() => onSelect(blockchain)}
            className={`button-hover flex flex-col items-center justify-center p-4 rounded-lg border border-${blockchain.color}/30 bg-darkBg3/50 hover:bg-${blockchain.color}/10`}
          >
            <span className="text-2xl mb-2">{blockchain.icon}</span>
            <span className="text-sm font-medium">{blockchain.name}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-xs text-gray-500 text-center">
          You can change your selected blockchain at any time
        </p>
      </div>
    </div>
  );
};
