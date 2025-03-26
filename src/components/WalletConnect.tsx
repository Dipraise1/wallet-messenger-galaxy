
import React from 'react';
import { Wallet, ChevronRight } from 'lucide-react';

interface WalletConnectProps {
  onConnect: () => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ onConnect }) => {
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
        onClick={onConnect}
        className="button-hover w-full bg-neonBlue/20 hover:bg-neonBlue/30 text-neonBlue border border-neonBlue/50 rounded-lg p-3 flex items-center justify-between font-medium"
      >
        <span className="flex items-center">
          <Wallet className="w-5 h-5 mr-2" />
          Connect Wallet
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
