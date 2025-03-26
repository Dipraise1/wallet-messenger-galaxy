import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080", // Match your Vite frontend port
    methods: ["GET", "POST"],
    credentials: true
  }
});

// In-memory storage for messages and contacts
let messages = [
  {
    id: 'm1',
    text: 'Hey, did you see that NFT?',
    timestamp: '10:30 AM',
    sender: '0x1234...5678',
    isIncoming: true,
    contactId: '1'
  },
  {
    id: 'm2',
    text: 'Yeah, it looks amazing! Are you planning to buy it?',
    timestamp: '10:32 AM',
    sender: 'me',
    isIncoming: false,
    contactId: '1'
  },
  {
    id: 'm3',
    text: 'I already placed a bid. The floor price is going up quickly.',
    timestamp: '10:33 AM',
    sender: '0x1234...5678',
    isIncoming: true,
    contactId: '1'
  }
];

let contacts = [
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
];

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // Send initial contacts data
  socket.emit('contacts', contacts);
  
  // Handle message fetch request
  socket.on('fetch_messages', (contactId) => {
    const contactMessages = messages.filter(message => message.contactId === contactId);
    socket.emit('messages', { contactId, messages: contactMessages });
  });
  
  // Handle new message
  socket.on('send_message', (messageData) => {
    const { text, contactId } = messageData;
    
    // Generate new message object
    const newMessage = {
      id: `m${Date.now()}`,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'me',
      isIncoming: false,
      contactId
    };
    
    // Add to messages
    messages.push(newMessage);
    
    // Update contact's last message
    const contactIndex = contacts.findIndex(contact => contact.id === contactId);
    if (contactIndex !== -1) {
      contacts[contactIndex].lastMessage = text;
      contacts[contactIndex].timestamp = 'Just now';
    }
    
    // Emit updated data
    io.emit('new_message', newMessage);
    io.emit('contacts', contacts);
    
    // Simulate receiving a response after 2 seconds
    setTimeout(() => {
      const responseMessage = {
        id: `m${Date.now()}`,
        text: `Response to: "${text.substring(0, 20)}${text.length > 20 ? '...' : ''}"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: contacts.find(c => c.id === contactId)?.walletAddress || 'unknown',
        isIncoming: true,
        contactId
      };
      
      // Add to messages
      messages.push(responseMessage);
      
      // Update contact's last message
      if (contactIndex !== -1) {
        contacts[contactIndex].lastMessage = responseMessage.text;
        contacts[contactIndex].timestamp = 'Just now';
        contacts[contactIndex].unread = (contacts[contactIndex].unread || 0) + 1;
      }
      
      // Emit updated data
      io.emit('new_message', responseMessage);
      io.emit('contacts', contacts);
    }, 2000);
  });
  
  // Handle read messages
  socket.on('read_messages', (contactId) => {
    const contactIndex = contacts.findIndex(contact => contact.id === contactId);
    if (contactIndex !== -1) {
      contacts[contactIndex].unread = 0;
      io.emit('contacts', contacts);
    }
  });
  
  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 