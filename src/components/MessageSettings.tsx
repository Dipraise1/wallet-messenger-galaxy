import React, { useState } from 'react';
import { X, Bell, Trash2, Ban, Flag, Check, AlertCircle } from 'lucide-react';

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

interface MessageSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  onDeleteContact: (contactId: string) => void;
  onBlockContact: (contactId: string) => void;
  onReportContact: (contactId: string) => void;
  onRenameContact: (contactId: string, newName: string) => void;
}

export const MessageSettings: React.FC<MessageSettingsProps> = ({
  isOpen,
  onClose,
  contact,
  onDeleteContact,
  onBlockContact,
  onReportContact,
  onRenameContact
}) => {
  const [showRename, setShowRename] = useState(false);
  const [newName, setNewName] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);

  if (!isOpen || !contact) return null;

  const handleRename = () => {
    if (newName.trim()) {
      onRenameContact(contact.id, newName);
      setShowRename(false);
      setNewName('');
    }
  };

  const handleDelete = () => {
    if (deleteConfirmation) {
      onDeleteContact(contact.id);
      onClose();
    } else {
      setDeleteConfirmation(true);
    }
  };

  const getBlockchainIcon = (blockchain?: string) => {
    if (!blockchain) return '🔷';
    
    switch (blockchain) {
      case 'ethereum': return '🔷';
      case 'solana': return '🟣';
      case 'base': return '🔵';
      case 'polygon': return '🟪';
      case 'avalanche': return '🔺';
      case 'bsc': return '🟡';
      default: return '🔷';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-card rounded-xl w-full max-w-md p-6 animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-darkBg3"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-darkBg3 flex items-center justify-center text-2xl">
                {contact.avatar || contact.name.charAt(0)}
              </div>
              {contact.blockchain && (
                <div className="absolute -bottom-1 -right-1 text-base">
                  {getBlockchainIcon(contact.blockchain)}
                </div>
              )}
            </div>
            
            <div>
              {showRename ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={contact.name}
                    className="w-full bg-darkBg3/50 rounded-lg p-2 text-sm border border-white/10 focus:outline-none focus:ring-1 focus:ring-neonBlue/50"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleRename}
                      disabled={!newName.trim()}
                      className="p-1 rounded-md bg-neonGreen/20 text-neonGreen disabled:opacity-50"
                      title="Save name"
                      aria-label="Save name"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => {
                        setShowRename(false);
                        setNewName('');
                      }}
                      className="p-1 rounded-md bg-red-500/20 text-red-500"
                      title="Cancel rename"
                      aria-label="Cancel rename"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">{contact.name}</h3>
                  <button 
                    onClick={() => {
                      setShowRename(true);
                      setNewName(contact.name);
                    }}
                    className="ml-2 p-1 rounded-full hover:bg-darkBg3 text-gray-400"
                    aria-label="Edit name"
                    title="Edit name"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"></path>
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-sm text-gray-400">{contact.walletAddress}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-400 flex items-center">
                  {contact.blockchain ? contact.blockchain.charAt(0).toUpperCase() + contact.blockchain.slice(1) : 'Ethereum'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-darkBg3/50">
              <div className="flex items-center">
                <Bell className="w-5 h-5 mr-3 text-neonBlue" />
                <span>Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  aria-label="Toggle notifications"
                  title="Toggle notifications"
                />
                <div className="w-11 h-6 bg-darkBg3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neonBlue"></div>
              </label>
            </div>

            <button 
              onClick={() => onBlockContact(contact.id)}
              className="flex items-center w-full p-3 rounded-lg bg-darkBg3/50 hover:bg-darkBg3/80 transition-colors text-left"
            >
              <Ban className="w-5 h-5 mr-3 text-yellow-500" />
              <span>Block Contact</span>
            </button>

            <button 
              onClick={() => onReportContact(contact.id)}
              className="flex items-center w-full p-3 rounded-lg bg-darkBg3/50 hover:bg-darkBg3/80 transition-colors text-left"
            >
              <Flag className="w-5 h-5 mr-3 text-orange-500" />
              <span>Report Contact</span>
            </button>

            <button 
              onClick={handleDelete}
              className="flex items-center w-full p-3 rounded-lg bg-darkBg3/50 hover:bg-red-900/30 hover:text-red-300 transition-colors text-left"
            >
              <Trash2 className="w-5 h-5 mr-3 text-red-500" />
              <span>Delete Conversation</span>
            </button>

            {deleteConfirmation && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-sm text-red-200">Are you sure you want to delete this conversation? This action cannot be undone. Click the "Delete Conversation" button again to confirm.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 