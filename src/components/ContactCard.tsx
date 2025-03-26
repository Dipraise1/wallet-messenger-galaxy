
import React from 'react';

interface Contact {
  id: string;
  name: string;
  walletAddress: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  blockchain: string;
}

interface ContactCardProps {
  contact: Contact;
  onClick: () => void;
  isSelected: boolean;
}

export const ContactCard: React.FC<ContactCardProps> = ({ 
  contact, 
  onClick,
  isSelected
}) => {
  // Function to truncate wallet address
  const truncateAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div 
      onClick={onClick}
      className={`p-3 cursor-pointer transition-colors duration-200 ${
        isSelected ? 'bg-darkBg3/70' : 'hover:bg-darkBg3/30'
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-darkBg3 flex items-center justify-center text-lg">
            {contact.avatar || contact.name.charAt(0)}
          </div>
          {contact.blockchain && (
            <div className="absolute -bottom-1 -right-1 text-xs">
              {contact.blockchain === 'ethereum' && '🔷'}
              {contact.blockchain === 'solana' && '🟣'}
              {contact.blockchain === 'base' && '🔵'}
              {contact.blockchain === 'polygon' && '🟪'}
              {contact.blockchain === 'avalanche' && '🔺'}
              {contact.blockchain === 'bsc' && '🟡'}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between">
            <p className="text-sm font-medium truncate">
              {contact.name || truncateAddress(contact.walletAddress)}
            </p>
            <p className="text-xs text-gray-500">{contact.timestamp}</p>
          </div>
          
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-400 truncate">{contact.lastMessage}</p>
            {contact.unread > 0 && (
              <div className="ml-2 bg-neonBlue rounded-full w-5 h-5 flex items-center justify-center">
                <span className="text-xs text-white">{contact.unread}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
