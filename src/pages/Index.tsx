
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WalletConnect } from '../components/WalletConnect';
import { BlockchainSelector } from '../components/BlockchainSelector';

interface Blockchain {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const Index = () => {
  const [step, setStep] = useState<'connect' | 'select'>('connect');
  const navigate = useNavigate();

  const handleConnect = () => {
    setStep('select');
  };

  const handleSelectBlockchain = (blockchain: Blockchain) => {
    // In a real app, we would store the selected blockchain
    console.log(`Selected blockchain: ${blockchain.name}`);
    
    // Navigate to messages page
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
