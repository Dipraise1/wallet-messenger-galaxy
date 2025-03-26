import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { useBlockchain } from '../lib/blockchain/blockchain-context';
import { BlockchainNetwork } from '../lib/blockchain/types';

interface NewContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContact: (address: string, name: string, blockchain: BlockchainNetwork) => void;
}

export const NewContactDialog: React.FC<NewContactDialogProps> = ({
  isOpen,
  onClose,
  onAddContact
}) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [contactName, setContactName] = useState('');
  const [selectedBlockchain, setSelectedBlockchain] = useState<BlockchainNetwork>('ethereum');
  const [error, setError] = useState('');
  
  const { blockchains, activeNetwork } = useBlockchain();

  const validateAddress = (address: string, blockchain: BlockchainNetwork): boolean => {
    if (!address.trim()) {
      setError('Address cannot be empty');
      return false;
    }

    // Basic validation for Ethereum-like addresses
    if ((blockchain === 'ethereum' || blockchain === 'base') && 
        !(/^0x[a-fA-F0-9]{40}$/.test(address))) {
      setError('Invalid Ethereum address format');
      return false;
    }

    // Basic validation for Solana addresses
    if (blockchain === 'solana' && address.length !== 44) {
      setError('Invalid Solana address format');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateAddress(walletAddress, selectedBlockchain)) {
      onAddContact(walletAddress, contactName || `New Contact (${walletAddress.substring(0, 6)}...)`, selectedBlockchain);
      setWalletAddress('');
      setContactName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-card rounded-xl w-full max-w-md p-6 animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">New Conversation</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-darkBg3"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Blockchain Network
              </label>
              <div className="grid grid-cols-3 gap-2">
                {blockchains.map((blockchain) => (
                  <button
                    key={blockchain.id}
                    type="button"
                    className={`p-2 rounded-lg flex flex-col items-center ${
                      selectedBlockchain === blockchain.id
                        ? 'bg-neonBlue/20 border border-neonBlue/50'
                        : 'bg-darkBg3/50 border border-white/10 hover:border-white/30'
                    }`}
                    onClick={() => setSelectedBlockchain(blockchain.id as BlockchainNetwork)}
                  >
                    <span className="text-xl mb-1">{blockchain.icon}</span>
                    <span className="text-xs">{blockchain.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="wallet-address" className="block text-sm font-medium mb-1">
                Wallet Address
              </label>
              <input
                id="wallet-address"
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="w-full bg-darkBg3/50 rounded-lg p-3 text-sm border border-white/10 focus:outline-none focus:ring-1 focus:ring-neonBlue/50"
                placeholder={`Enter ${selectedBlockchain} address`}
              />
            </div>
            
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium mb-1">
                Contact Name (Optional)
              </label>
              <input
                id="contact-name"
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full bg-darkBg3/50 rounded-lg p-3 text-sm border border-white/10 focus:outline-none focus:ring-1 focus:ring-neonBlue/50"
                placeholder="Enter a name for this contact"
              />
            </div>
            
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-darkBg3 hover:bg-darkBg3/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-neonBlue/20 hover:bg-neonBlue/30 text-neonBlue flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Start Conversation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 