import React, { useState, useRef, useEffect } from 'react';
import { Send, X, DollarSign, Clock, Sparkles, Info } from 'lucide-react';
import { useBlockchain } from '../lib/blockchain/blockchain-context';

interface MessageComposerProps {
  onSendMessage: (message: string, options?: MessageOptions) => void;
  onCancel: () => void;
  initialMessage?: string;
}

interface MessageOptions {
  isPaid?: boolean;
  isScheduled?: boolean;
  isEncrypted?: boolean;
  amount?: string;
  scheduledTime?: Date;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  onCancel,
  initialMessage = '',
}) => {
  const { activeNetwork } = useBlockchain();
  const [message, setMessage] = useState(initialMessage);
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState<MessageOptions>({
    isPaid: false,
    isScheduled: false,
    isEncrypted: false,
    amount: '0.001',
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [message]);

  // Focus textarea when component mounts
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Only include options that are enabled
      const activeOptions = {
        ...(options.isPaid && { isPaid: true, amount: options.amount }),
        ...(options.isScheduled && { 
          isScheduled: true, 
          scheduledTime: options.scheduledTime || new Date(Date.now() + 3600000) // default 1 hour
        }),
        ...(options.isEncrypted && { isEncrypted: true }),
      };
      
      onSendMessage(message, Object.keys(activeOptions).length > 0 ? activeOptions : undefined);
    }
  };

  const getCurrencySymbol = () => {
    switch (activeNetwork.toLowerCase()) {
      case 'ethereum':
        return 'ETH';
      case 'solana':
        return 'SOL';
      case 'base':
        return 'ETH';
      case 'polygon':
        return 'MATIC';
      default:
        return 'ETH';
    }
  };

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Compose Message</h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-gray-400 hover:text-gray-200 rounded-full transition-colors"
          aria-label="Close composer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full bg-darkBg3/50 rounded-lg p-4 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-neonBlue/50 placeholder-gray-500"
          rows={4}
          aria-label="Message content"
        />

        {showOptions && (
          <div className="mt-4 space-y-4 animate-fade-in">
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              {/* Paid message option */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.isPaid}
                      onChange={(e) => 
                        setOptions({...options, isPaid: e.target.checked})
                      }
                      className="mr-2 accent-neonBlue"
                    />
                    <span className="text-sm">Paid Message</span>
                    <DollarSign className="w-4 h-4 ml-1 text-gray-400" />
                  </label>
                </div>
                {options.isPaid && (
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={options.amount}
                      onChange={(e) => setOptions({...options, amount: e.target.value})}
                      step="0.001"
                      min="0.001"
                      className="w-full bg-darkBg3 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-neonBlue/50"
                      aria-label="Amount"
                    />
                    <span className="ml-2 text-gray-400">{getCurrencySymbol()}</span>
                  </div>
                )}
              </div>

              {/* Scheduled message option */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={options.isScheduled}
                      onChange={(e) => 
                        setOptions({...options, isScheduled: e.target.checked})
                      }
                      className="mr-2 accent-neonBlue"
                    />
                    <span className="text-sm">Schedule</span>
                    <Clock className="w-4 h-4 ml-1 text-gray-400" />
                  </label>
                </div>
                {options.isScheduled && (
                  <input
                    type="datetime-local"
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : undefined;
                      setOptions({...options, scheduledTime: date});
                    }}
                    className="w-full bg-darkBg3 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-neonBlue/50"
                    aria-label="Schedule time"
                  />
                )}
              </div>
            </div>

            {/* Encrypted message option */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={options.isEncrypted}
                  onChange={(e) => 
                    setOptions({...options, isEncrypted: e.target.checked})
                  }
                  className="mr-2 accent-neonBlue"
                />
                <span className="text-sm">End-to-end encrypted</span>
                <Sparkles className="w-4 h-4 ml-1 text-gray-400" />
              </label>
              {options.isEncrypted && (
                <div className="mt-2 flex items-start text-xs text-gray-400">
                  <Info className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                  <p>
                    Encrypted messages can only be read by the recipient and use gas for on-chain encryption.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="text-sm text-gray-400 hover:text-neonBlue underline"
          >
            {showOptions ? 'Hide options' : 'Show options'}
          </button>

          <div className="space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-700 rounded-lg hover:bg-darkBg3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!message.trim()}
              className={`px-4 py-2 rounded-lg flex items-center ${
                message.trim()
                  ? 'bg-neonBlue/20 text-neonBlue hover:bg-neonBlue/30'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span>Send</span>
              <Send className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}; 