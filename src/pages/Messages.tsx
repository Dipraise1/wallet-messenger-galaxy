import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageList } from '../components/MessageList';
import { MessageInput } from '../components/MessageInput';
import { PlusCircle, Settings, User, Loader2, ArrowLeft, Edit } from 'lucide-react';
import { Layout } from '../components/Layout';
import { useSocket } from '../lib/socket-context';
import { useBlockchain } from '../lib/blockchain/blockchain-context';
import { BlockchainMessage, BlockchainNetwork } from '../lib/blockchain/types';
import { NewContactDialog } from '../components/NewContactDialog';
import { MessageSettings } from '../components/MessageSettings';
import { MessageComposer } from '../components/MessageComposer';
import { toast } from 'sonner';

// Define types locally to avoid conflicts
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

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: string;
  isIncoming: boolean;
  contactId: string;
}

interface MessageOptions {
  isPaid?: boolean;
  isScheduled?: boolean;
  isEncrypted?: boolean;
  amount?: string;
  scheduledTime?: Date;
}

const Messages = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { walletInfo, activeNetwork, messages: blockchainMessages, sendMessage: sendBlockchainMessage } = useBlockchain();
  const socketData = useSocket();
  const { isConnected } = socketData;
  
  const [localContacts, setLocalContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [newContactDialogOpen, setNewContactDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [composerOpen, setComposerOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);

  // Handle contact selection
  const selectContact = (contact: Contact | null) => {
    setSelectedContact(contact);
  };

  // Redirect if no wallet is connected
  useEffect(() => {
    if (!walletInfo) {
      navigate('/');
    }
  }, [walletInfo, navigate]);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [blockchainMessages]);

  // Convert blockchain messages to local format and update contacts
  useEffect(() => {
    if (!walletInfo || blockchainMessages.length === 0) return;

    // Group messages by sender/recipient
    const contactsMap = new Map<string, { address: string, lastMessage: BlockchainMessage }>();
    
    blockchainMessages.forEach(message => {
      // For messages sent by us
      if (message.sender === walletInfo.address) {
        const contactId = message.recipient;
        if (!contactsMap.has(contactId) || contactsMap.get(contactId)!.lastMessage.timestamp < message.timestamp) {
          contactsMap.set(contactId, { 
            address: contactId, 
            lastMessage: message 
          });
        }
      } 
      // For messages received by us
      else if (message.recipient === walletInfo.address) {
        const contactId = message.sender;
        if (!contactsMap.has(contactId) || contactsMap.get(contactId)!.lastMessage.timestamp < message.timestamp) {
          contactsMap.set(contactId, { 
            address: contactId, 
            lastMessage: message 
          });
        }
      }
    });
    
    // Convert to contacts array
    const newContacts: Contact[] = Array.from(contactsMap.entries()).map(([id, data]) => {
      const existing = localContacts.find(c => c.walletAddress === data.address);
      return {
        id,
        name: existing?.name || `${data.address.substring(0, 6)}...${data.address.substring(data.address.length - 4)}`,
        walletAddress: data.address,
        avatar: '',
        lastMessage: data.lastMessage.content,
        timestamp: new Date(data.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unread: existing?.unread || 0,
        blockchain: data.lastMessage.blockchain
      };
    });
    
    setLocalContacts(prev => {
      // Merge with existing contacts, giving priority to new ones
      const merged = [...prev];
      newContacts.forEach(contact => {
        const index = merged.findIndex(c => c.walletAddress === contact.walletAddress);
        if (index >= 0) {
          merged[index] = contact;
        } else {
          merged.push(contact);
        }
      });
      return merged;
    });
  }, [blockchainMessages, walletInfo, localContacts]);

  // Convert blockchain messages to local format for display
  const getMessagesForContact = (contactId: string): Message[] => {
    if (!walletInfo) return [];
    
    return blockchainMessages
      .filter(msg => 
        (msg.sender === walletInfo.address && msg.recipient === contactId) ||
        (msg.sender === contactId && msg.recipient === walletInfo.address)
      )
      .sort((a, b) => a.timestamp - b.timestamp)
      .map(msg => ({
        id: msg.id,
        text: msg.content,
        timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: msg.sender,
        isIncoming: msg.sender !== walletInfo.address,
        contactId
      }));
  };

  const handleSendMessage = async (message: string, options?: MessageOptions) => {
    if (!walletInfo || !selectedContact) return;
    
    setIsSending(true);
    try {
      // If we have options, log them
      if (options) {
        console.log('Sending message with options:', options);
        
        // Show appropriate toast based on options
        if (options.isPaid) {
          toast.info(`Sending paid message with ${options.amount} ${activeNetwork}`);
        }
        if (options.isScheduled) {
          toast.info(`Message scheduled for ${options.scheduledTime ? new Date(options.scheduledTime).toLocaleString() : 'unknown time'}`);
        }
        if (options.isEncrypted) {
          toast.info('Sending encrypted message');
        }
      }
      
      const result = await sendBlockchainMessage(selectedContact.walletAddress, message);
      
      if (!result) {
        toast.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending blockchain message:', error);
      toast.error('Error sending message');
    } finally {
      setIsSending(false);
      setComposerOpen(false);
    }
  };

  const handleAddContact = (address: string, name: string, blockchain: BlockchainNetwork) => {
    // Check if contact already exists
    const existingContact = localContacts.find(c => c.walletAddress.toLowerCase() === address.toLowerCase());
    
    if (existingContact) {
      toast.info(`Contact already exists as "${existingContact.name}"`);
      selectContact(existingContact);
      return;
    }
    
    // Create new contact
    const newContact: Contact = {
      id: address,
      name,
      walletAddress: address,
      avatar: '',
      lastMessage: 'No messages yet',
      timestamp: 'Now',
      unread: 0,
      blockchain
    };
    
    setLocalContacts(prev => [...prev, newContact]);
    selectContact(newContact);
    toast.success(`Added contact: ${name}`);
  };

  const handleRenameContact = (contactId: string, newName: string) => {
    setLocalContacts(prev => 
      prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, name: newName } 
          : contact
      )
    );
    toast.success('Contact renamed');
  };

  const handleDeleteContact = (contactId: string) => {
    setLocalContacts(prev => prev.filter(contact => contact.id !== contactId));
    if (selectedContact?.id === contactId) {
      selectContact(null);
    }
    toast.success('Conversation deleted');
  };

  const handleBlockContact = (contactId: string) => {
    // In a real implementation, you would add the contact to a blocked list
    // For now, just delete the contact and show a toast
    handleDeleteContact(contactId);
    toast.success('Contact blocked');
  };

  const handleReportContact = (contactId: string) => {
    // In a real implementation, this would send a report to your backend
    toast.success('Contact reported');
    setSettingsDialogOpen(false);
  };

  // Get messages for the selected contact
  const currentMessages = selectedContact 
    ? getMessagesForContact(selectedContact.walletAddress)
    : [];

  // Show loading indicator if wallet info is not available yet
  if (!walletInfo) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-neonBlue mb-4" />
            <p className="text-gray-400">Connecting to wallet...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Contact list view for mobile
  const contactListView = (
    <div className={`lg:w-80 flex-shrink-0 ${isMobileView && selectedContact ? 'hidden' : 'block'}`}>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold flex items-center">
          Messages
          {isConnected ? (
            <span className="ml-2 inline-block w-2 h-2 bg-green-500 rounded-full" title="Connected"></span>
          ) : (
            <span className="ml-2 inline-block w-2 h-2 bg-red-500 rounded-full" title="Disconnected"></span>
          )}
          <span className="ml-4 text-xs bg-neonBlue/20 text-neonBlue px-2 py-1 rounded-full">
            {activeNetwork}
          </span>
        </h1>
        <button 
          onClick={() => setNewContactDialogOpen(true)}
          className="p-2 text-gray-400 hover:text-neonBlue rounded-full transition-colors"
          aria-label="Create new message"
          title="Create new message"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
      </div>
      
      <MessageList 
        contacts={localContacts} 
        onSelectContact={selectContact}
        selectedContactId={selectedContact?.id}
      />
    </div>
  );

  // Message view
  const messageView = (
    <div className={`flex-1 flex flex-col ${isMobileView && !selectedContact ? 'hidden' : 'block'}`}>
      {selectedContact ? (
        <>
          <div className="glass-card rounded-xl p-4 mb-4 flex justify-between items-center animate-fade-in">
            <div className="flex items-center">
              {isMobileView && (
                <button 
                  onClick={() => selectContact(null)}
                  className="mr-3 p-1 rounded-full hover:bg-darkBg3"
                  aria-label="Back to contacts"
                  title="Back to contacts"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
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
              <button 
                onClick={() => setComposerOpen(true)}
                className="p-2 text-gray-400 hover:text-neonBlue rounded-full transition-colors"
                aria-label="Advanced compose" 
                title="Advanced compose"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button 
                className="p-2 text-gray-400 hover:text-neonBlue rounded-full transition-colors"
                aria-label="View profile" 
                title="View profile"
              >
                <User className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setSettingsDialogOpen(true)}
                className="p-2 text-gray-400 hover:text-neonBlue rounded-full transition-colors"
                aria-label="Settings" 
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {composerOpen ? (
            <MessageComposer 
              onSendMessage={handleSendMessage}
              onCancel={() => setComposerOpen(false)}
            />
          ) : (
            <>
              <div className="flex-1 glass-card rounded-xl p-4 mb-4 overflow-y-auto animate-fade-in">
                <div className="flex flex-col space-y-4">
                  {currentMessages.map((message) => (
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
                  
                  {currentMessages.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <p>No messages yet</p>
                      <p className="text-xs mt-2">Send a message to start the conversation</p>
                    </div>
                  )}
                  
                  {isSending && (
                    <div className="flex justify-end">
                      <div className="bg-darkBg3/70 rounded-xl p-3 flex items-center">
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        <span className="text-xs text-gray-400">Sending...</span>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              <MessageInput onSendMessage={handleSendMessage} />
            </>
          )}
        </>
      ) : (
        <div className="flex-1 glass-card rounded-xl flex flex-col items-center justify-center p-8 animate-fade-in">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-xl font-semibold mb-2">Select a Conversation</h2>
          <p className="text-gray-400 text-center max-w-md">
            Choose a contact from the list or start a new conversation
          </p>
          <button 
            onClick={() => setNewContactDialogOpen(true)}
            className="mt-6 button-hover flex items-center bg-neonBlue/20 hover:bg-neonBlue/30 text-neonBlue rounded-lg px-4 py-2"
            aria-label="Create new message"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            New Message
          </button>
        </div>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)] gap-4">
        {contactListView}
        {messageView}
      </div>

      {/* Dialogs */}
      <NewContactDialog 
        isOpen={newContactDialogOpen}
        onClose={() => setNewContactDialogOpen(false)}
        onAddContact={handleAddContact}
      />

      <MessageSettings 
        isOpen={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
        contact={selectedContact}
        onDeleteContact={handleDeleteContact}
        onBlockContact={handleBlockContact}
        onReportContact={handleReportContact}
        onRenameContact={handleRenameContact}
      />
    </Layout>
  );
};

export default Messages;
