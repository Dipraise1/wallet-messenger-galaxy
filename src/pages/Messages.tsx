
import React, { useState } from 'react';
import { MessageList } from '../components/MessageList';
import { MessageInput } from '../components/MessageInput';
import { PlusCircle, Settings, User } from 'lucide-react';
import { Layout } from '../components/Layout';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: string;
  isIncoming: boolean;
}

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

const Messages = () => {
  // Dummy data for demonstration
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Alex',
      walletAddress: '0x1234...5678',
      avatar: '',
      lastMessage: 'Hey, did you see that NFT?',
      timestamp: '10:30 AM',
      unread: 2,
      blockchain: 'ethereum'
    },
    {
      id: '2',
      name: 'Maya',
      walletAddress: '0xabcd...efgh',
      avatar: '',
      lastMessage: 'Thanks for sending those tokens!',
      timestamp: 'Yesterday',
      unread: 0,
      blockchain: 'solana'
    },
    {
      id: '3',
      name: 'Crypto Whales',
      walletAddress: 'Group',
      avatar: '',
      lastMessage: 'Jordan: Check out this new project',
      timestamp: '2 days ago',
      unread: 5,
      blockchain: 'base'
    }
  ]);

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  
  const [messages] = useState<Message[]>([
    {
      id: 'm1',
      text: 'Hey, did you see that NFT?',
      timestamp: '10:30 AM',
      sender: '0x1234...5678',
      isIncoming: true
    },
    {
      id: 'm2',
      text: 'Yeah, it looks amazing! Are you planning to buy it?',
      timestamp: '10:32 AM',
      sender: 'me',
      isIncoming: false
    },
    {
      id: 'm3',
      text: 'I already placed a bid. The floor price is going up quickly.',
      timestamp: '10:33 AM',
      sender: '0x1234...5678',
      isIncoming: true
    }
  ]);

  const handleSendMessage = (message: string) => {
    console.log(`Sending message: ${message}`);
    // In a real app, we would add the message to the conversation
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
  };

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)] gap-4">
        <div className="lg:w-80 flex-shrink-0">
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold">Messages</h1>
            <button className="p-2 text-gray-400 hover:text-neonBlue rounded-full transition-colors">
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
          
          <MessageList 
            contacts={contacts} 
            onSelectContact={handleSelectContact}
            selectedContactId={selectedContact?.id}
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          {selectedContact ? (
            <>
              <div className="glass-card rounded-xl p-4 mb-4 flex justify-between items-center animate-fade-in">
                <div className="flex items-center">
                  <div className="relative flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-darkBg3 flex items-center justify-center text-lg">
                      {selectedContact.avatar || selectedContact.name.charAt(0)}
                    </div>
                    {selectedContact.blockchain && (
                      <div className="absolute -bottom-1 -right-1 text-xs">
                        {selectedContact.blockchain === 'ethereum' && '🔷'}
                        {selectedContact.blockchain === 'solana' && '🟣'}
                        {selectedContact.blockchain === 'base' && '🔵'}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="font-medium">
                      {selectedContact.name || selectedContact.walletAddress}
                    </h2>
                    <p className="text-xs text-gray-400">
                      {selectedContact.walletAddress === 'Group' 
                        ? '3 members' 
                        : selectedContact.walletAddress}
                    </p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-400 hover:text-neonBlue rounded-full transition-colors">
                    <User className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-neonBlue rounded-full transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 glass-card rounded-xl p-4 mb-4 overflow-y-auto animate-fade-in">
                <div className="flex flex-col space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isIncoming ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-xl p-3 ${
                          message.isIncoming
                            ? 'bg-darkBg3 rounded-tl-none'
                            : 'bg-neonBlue/20 rounded-tr-none neon-border'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs text-gray-500 mt-1 text-right">
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <MessageInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className="flex-1 glass-card rounded-xl flex flex-col items-center justify-center p-8 animate-fade-in">
              <div className="text-6xl mb-4">💬</div>
              <h2 className="text-xl font-semibold mb-2">Select a Conversation</h2>
              <p className="text-gray-400 text-center max-w-md">
                Choose a contact from the list or start a new conversation
              </p>
              <button className="mt-6 button-hover flex items-center bg-neonBlue/20 hover:bg-neonBlue/30 text-neonBlue rounded-lg px-4 py-2">
                <PlusCircle className="w-5 h-5 mr-2" />
                New Message
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
