import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletConnect } from '../components/WalletConnect';
import { BlockchainSelector } from '../components/BlockchainSelector';
import { useBlockchain } from '../lib/blockchain/blockchain-context';
import { Blockchain } from '../lib/blockchain/types';

const Index = () => {
  const [step, setStep] = useState<'connect' | 'select'>('connect');
  const navigate = useNavigate();
  const { walletInfo } = useBlockchain();

  // If wallet is already connected, redirect to messages
  useEffect(() => {
    if (walletInfo) {
      navigate('/messages');
    }
  }, [walletInfo, navigate]);

  const handleConnect = () => {
    setStep('select');
  };

  const handleSelectBlockchain = (blockchain: Blockchain) => {
    // Navigate to messages page after successful blockchain connection
    navigate('/messages');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-darkBg p-4">
      <div className="mb-12 text-center animate-fade-in">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-neonBlue text-glow">Chain</span>
          <span className="text-white">Chat</span>
        </h1>
        <p className="text-gray-400 max-w-md mx-auto">
          Secure wallet-to-wallet messaging across multiple blockchains
        </p>
      </div>
      
      {step === 'connect' ? (
        <WalletConnect onConnect={handleConnect} />
      ) : (
        <BlockchainSelector onSelect={handleSelectBlockchain} />
      )}
      
      <div className="mt-12 flex space-x-8 text-gray-500 text-sm animate-fade-in">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-white transition-colors">Contact</a>
      </div>
    </div>
  );
};

export default Index;
