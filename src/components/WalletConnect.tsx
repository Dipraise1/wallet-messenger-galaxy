import React from 'react';
import { Wallet, ChevronRight, Loader2 } from 'lucide-react';
import { useBlockchain } from '../lib/blockchain/blockchain-context';

interface WalletConnectProps {
  onConnect: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
  const { connectWallet, isConnecting, walletInfo } = useBlockchain();

  const handleConnect = async () => {
    // We'll select the blockchain in the next step (in BlockchainSelector component)
    // For now, just call the onConnect callback to progress to the next step
    onConnect();
  };

  return (
    <div className="glass-card rounded-xl p-6 max-w-md w-full animate-fade-in">
      <div className="flex items-center justify-center mb-6">
        <Wallet className="w-12 h-12 text-neonBlue icon-glow" />
      </div>
      <h2 className="text-xl font-semibold text-center mb-2">Connect Your Wallet</h2>
      <p className="text-gray-400 text-center mb-6 text-sm">
        Connect your blockchain wallet to start messaging
      </p>
      
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="button-hover w-full bg-neonBlue/20 hover:bg-neonBlue/30 text-neonBlue border border-neonBlue/50 rounded-lg p-3 flex items-center justify-between font-medium disabled:opacity-70 disabled:cursor-not-allowed"
      >
        <span className="flex items-center">
          {isConnecting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5 mr-2" />
              Connect Wallet
            </>
          )}
        </span>
        <ChevronRight className="w-5 h-5" />
      </button>
      
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-xs text-gray-500 text-center">
          By connecting your wallet, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};
