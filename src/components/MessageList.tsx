
import React from 'react';
import { ContactCard } from './ContactCard';

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
  return (
    <div className="glass-card rounded-xl overflow-hidden w-full max-w-xs animate-fade-in">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>
      
      <div className="divide-y divide-white/5 max-h-[70vh] overflow-y-auto no-scrollbar">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <ContactCard 
              key={contact.id}
              contact={contact}
              onClick={() => onSelectContact(contact)}
              isSelected={selectedContactId === contact.id}
            />
          ))
        ) : (
          <div className="p-6 text-center text-gray-500 italic">
            No messages yet
          </div>
        )}
      </div>
    </div>
  );
};
