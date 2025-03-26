
import React, { useState } from 'react';
import { Send, PlusCircle, Image } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="glass-card rounded-xl p-3 animate-fade-in"
    >
      <div className="flex items-end">
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-neonBlue button-hover"
          title="Add attachment"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
        
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-neonBlue button-hover"
          title="Send image"
        >
          <Image className="w-5 h-5" />
        </button>
        
        <div className="flex-1 mx-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-darkBg3/50 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-neonBlue/50 placeholder-gray-500"
            rows={1}
            style={{ 
              minHeight: '44px', 
              maxHeight: '120px'
            }}
          />
        </div>
        
        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-2 rounded-full button-hover ${
            message.trim() 
              ? 'text-neonBlue hover:bg-neonBlue/20' 
              : 'text-gray-500 cursor-not-allowed'
          }`}
          title="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
