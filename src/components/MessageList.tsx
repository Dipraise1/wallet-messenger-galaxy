import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  walletAddress: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  blockchain?: string;
}

interface MessageListProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  selectedContactId?: string;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  contacts, 
  onSelectContact, 
  selectedContactId 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to truncate wallet address
  const truncateAddress = (address: string) => {
    if (address === 'Group' || address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function to get blockchain emoji
  const getBlockchainEmoji = (blockchain?: string) => {
    if (!blockchain) return '';
    
    switch (blockchain.toLowerCase()) {
      case 'ethereum':
        return '🔷';
      case 'solana':
        return '🟣';
      case 'base':
        return '🔵';
      case 'polygon':
        return '🟪';
      case 'avalanche':
        return '🔺';
      case 'bsc':
        return '🟡';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-darkBg2 border border-darkBg3 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-neonBlue/50 focus:border-neonBlue/50 transition-colors"
          aria-label="Search contacts"
        />
      </div>

      <div className="overflow-y-auto flex-1 px-1 -mx-1">
        {filteredContacts.length > 0 ? (
          <div className="space-y-2">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => onSelectContact(contact)}
                className={`w-full text-left p-3 rounded-xl flex items-start transition-colors ${
                  selectedContactId === contact.id
                    ? 'glass-card neon-border'
                    : 'hover:bg-darkBg2'
                }`}
                aria-label={`Chat with ${contact.name}`}
              >
                <div className="relative flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full bg-darkBg3 flex items-center justify-center text-lg">
                    {contact.avatar || contact.name.charAt(0)}
                  </div>
                  {contact.blockchain && (
                    <div className="absolute -bottom-1 -right-1 text-xs">
                      {getBlockchainEmoji(contact.blockchain)}
                    </div>
                  )}
                  {contact.unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-neonBlue text-darkBg1 rounded-full flex items-center justify-center text-xs font-medium">
                      {contact.unread}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <h3 className="font-medium truncate pr-1">
                      {contact.name}
                    </h3>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {contact.timestamp}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-400 truncate pr-2">
                      {contact.lastMessage}
                    </p>
                    {contact.walletAddress && contact.walletAddress !== 'Group' && (
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {truncateAddress(contact.walletAddress)}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-8 text-gray-400">
            <p>No contacts found for "{searchQuery}"</p>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No contacts yet</p>
            <p className="text-xs mt-2">Start a new conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};
