import React, { useState, useRef, useEffect } from 'react';
import { Send, PlusCircle, Image } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  // Handle keyboard events (Enter to send)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
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
          className="p-2 text-gray-400 hover:text-neonBlue button-hover rounded-full"
          title="Add attachment"
          aria-label="Add attachment"
        >
          <PlusCircle className="w-5 h-5" />
        </button>
        
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-neonBlue button-hover rounded-full"
          title="Send image"
          aria-label="Send image"
        >
          <Image className="w-5 h-5" />
        </button>
        
        <div className="flex-1 mx-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="w-full bg-darkBg3/50 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-neonBlue/50 placeholder-gray-500"
            rows={1}
            style={{ 
              minHeight: '44px', 
              maxHeight: '120px'
            }}
            aria-label="Message content"
          />
          <p className="text-xs mt-1 text-gray-500 hidden sm:block">
            Press <kbd className="px-1.5 py-0.5 bg-darkBg3 rounded-md">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-darkBg3 rounded-md">Shift+Enter</kbd> for new line
          </p>
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
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
