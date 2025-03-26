import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Contact {
  id: string;
  name: string;
  walletAddress: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  blockchain?: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: string;
  isIncoming: boolean;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  contacts: Contact[];
  messages: Message[];
  selectedContact: Contact | null;
  selectContact: (contact: Contact | null) => void;
  sendMessage: (text: string) => void;
  addContact: (contact: Contact) => void;
  removeContact: (contactId: string) => void;
  updateContact: (contactId: string, updates: Partial<Contact>) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    // Check if we should connect to a real socket server
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
    
    if (SOCKET_URL) {
      // Connect to real socket server if URL is provided
      const newSocket = io(SOCKET_URL);
      
      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });
      
      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });
      
      newSocket.on('contacts', (data: Contact[]) => {
        setContacts(data);
      });
      
      newSocket.on('messages', (data: Message[]) => {
        setMessages(data);
      });
      
      setSocket(newSocket);
      
      return () => {
        newSocket.disconnect();
      };
    } else {
      // Use mock data if no socket URL is provided
      console.log('Using mock socket data');
      setIsConnected(true);
      
      // Mock contacts
      const mockContacts: Contact[] = [
        {
          id: '1',
          name: 'Support Team',
          walletAddress: '0x1234...5678',
          avatar: '👩‍💼',
          lastMessage: 'How can we help you today?',
          timestamp: '10:30 AM',
          unread: 1,
          blockchain: 'ethereum'
        },
        {
          id: '2',
          name: 'Wallet Group',
          walletAddress: 'Group',
          avatar: '👥',
          lastMessage: 'Let\'s discuss the new update',
          timestamp: 'Yesterday',
          unread: 0,
          blockchain: 'solana'
        },
        {
          id: '3',
          name: 'Vitalik.eth',
          walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
          avatar: '👨‍💻',
          lastMessage: 'Checking the latest ETH price',
          timestamp: '2 days ago',
          unread: 0,
          blockchain: 'ethereum'
        },
      ];
      
      setContacts(mockContacts);
      
      // Set mock messages when a contact is selected
      if (selectedContact) {
        const mockMessages = [
          {
            id: '101',
            text: 'Hello there!',
            timestamp: '10:30 AM',
            sender: selectedContact.id,
            isIncoming: true,
          },
          {
            id: '102',
            text: 'Hi! How can I help?',
            timestamp: '10:31 AM',
            sender: 'me',
            isIncoming: false,
          },
          {
            id: '103',
            text: 'I need help with my wallet.',
            timestamp: '10:32 AM',
            sender: selectedContact.id,
            isIncoming: true,
          },
        ];
        
        setMessages(mockMessages);
      }
    }
  }, [selectedContact?.id]);

  const selectContact = (contact: Contact | null) => {
    setSelectedContact(contact);
    
    if (contact && socket) {
      socket.emit('select_contact', contact.id);
    }
  };

  const sendMessage = (text: string) => {
    if (!selectedContact) return;
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
      isIncoming: false,
    };
    
    setMessages((prev) => [...prev, newMessage]);
    
    if (socket) {
      socket.emit('message', {
        contactId: selectedContact.id,
        text,
      });
    }
  };

  const addContact = (contact: Contact) => {
    // Check if contact already exists
    const existing = contacts.find(c => c.walletAddress === contact.walletAddress);
    if (existing) return;
    
    setContacts(prev => [...prev, contact]);
    
    if (socket) {
      socket.emit('add_contact', contact);
    }
  };

  const removeContact = (contactId: string) => {
    setContacts(prev => prev.filter(c => c.id !== contactId));
    
    if (selectedContact?.id === contactId) {
      setSelectedContact(null);
    }
    
    if (socket) {
      socket.emit('remove_contact', contactId);
    }
  };

  const updateContact = (contactId: string, updates: Partial<Contact>) => {
    setContacts(prev => 
      prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, ...updates } 
          : contact
      )
    );
    
    if (selectedContact?.id === contactId) {
      setSelectedContact(prev => prev ? { ...prev, ...updates } : null);
    }
    
    if (socket) {
      socket.emit('update_contact', { contactId, updates });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        contacts,
        messages,
        selectedContact,
        selectContact,
        sendMessage,
        addContact,
        removeContact,
        updateContact,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}; 