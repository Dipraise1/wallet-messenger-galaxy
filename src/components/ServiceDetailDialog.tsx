import React, { useState } from 'react';
import { X, Star, MessageSquare, Link, ExternalLink, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { PortfolioItem } from './ServiceListingDialog';

export interface Service {
  id: string;
  title: string;
  provider: string;
  providerAddress: string;
  rating?: number;
  reviews?: number;
  category: string;
  price: string;
  priceUnit?: string;
  description: string;
  blockchain: string;
  portfolio?: PortfolioItem[];
  createdAt?: number;
}

interface ServiceDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

export const ServiceDetailDialog: React.FC<ServiceDetailDialogProps> = ({
  isOpen,
  onClose,
  service
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'details' | 'portfolio'>('details');
  
  if (!isOpen || !service) return null;

  // Function to get blockchain icon
  const getBlockchainIcon = (blockchain: string) => {
    switch (blockchain.toLowerCase()) {
      case 'ethereum': return '🔷';
      case 'solana': return '🟣';
      case 'base': return '🔵';
      case 'polygon': return '🟪';
      case 'avalanche': return '🔺';
      case 'bsc': return '🟡';
      default: return '🔷';
    }
  };
  
  // Format for category display
  const getCategoryName = (categoryId: string) => {
    const categories: Record<string, string> = {
      'development': 'Development',
      'design': 'Design',
      'marketing': 'Marketing',
      'consulting': 'Consulting',
      'writing': 'Content Writing',
      'translation': 'Translation',
      'financial': 'Financial Services',
      'legal': 'Legal',
      'admin': 'Administrative',
      'other': 'Other'
    };
    
    return categories[categoryId] || categoryId;
  };
  
  const handleContactProvider = () => {
    onClose();
    // Go to messages page and pass the provider's info
    navigate('/messages', { 
      state: { 
        newContact: {
          name: service.provider,
          walletAddress: service.providerAddress,
          blockchain: service.blockchain
        }
      }
    });
  };
  
  const handleHireNow = () => {
    toast.success('Hired! You will be contacted by the provider soon.');
    onClose();
  };
  
  const handleCopyLink = () => {
    const url = `${window.location.origin}/services/${service.id}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };
  
  const hasPortfolio = service.portfolio && service.portfolio.length > 0 && 
    service.portfolio.some(item => item.title || item.description || item.url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="glass-card rounded-xl w-full max-w-3xl animate-scale-in overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">{service.title}</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-darkBg3"
            aria-label="Close"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              <div className="mb-4">
                <div className="flex mb-4">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`px-4 py-2 rounded-t-lg ${
                      activeTab === 'details' 
                        ? 'border-b-2 border-neonBlue text-neonBlue' 
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    Details
                  </button>
                  {hasPortfolio && (
                    <button
                      onClick={() => setActiveTab('portfolio')}
                      className={`px-4 py-2 rounded-t-lg ${
                        activeTab === 'portfolio' 
                          ? 'border-b-2 border-neonBlue text-neonBlue' 
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      Portfolio
                    </button>
                  )}
                </div>
                
                {activeTab === 'details' && (
                  <div className="space-y-4">
                    <p className="text-gray-300">
                      {service.description}
                    </p>
                    
                    <div className="glass-card rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category</span>
                        <span>{getCategoryName(service.category)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price</span>
                        <span>{service.price} {service.priceUnit || ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Network</span>
                        <span className="flex items-center">
                          {getBlockchainIcon(service.blockchain)} <span className="ml-1 capitalize">{service.blockchain}</span>
                        </span>
                      </div>
                      {service.createdAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Listed</span>
                          <span>{new Date(service.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between pt-3">
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => toast('Reported feedback')}
                          className="text-gray-400 hover:text-gray-300"
                          title="Helpful"
                          aria-label="Mark as helpful"
                        >
                          <ThumbsUp className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => toast('Reported feedback')}
                          className="text-gray-400 hover:text-gray-300"
                          title="Not helpful"
                          aria-label="Mark as not helpful"
                        >
                          <ThumbsDown className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={handleCopyLink}
                          className="text-gray-400 hover:text-gray-300"
                          title="Copy link"
                          aria-label="Copy link to this service"
                        >
                          <Link className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex mt-2 md:mt-0">
                        <button 
                          onClick={() => handleHireNow()}
                          className="flex items-center px-4 py-2 bg-neonBlue/20 text-neonBlue rounded-lg hover:bg-neonBlue/30 mr-2"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Hire Now
                        </button>
                        <button 
                          onClick={handleContactProvider}
                          className="flex items-center px-4 py-2 border border-white/10 rounded-lg hover:bg-darkBg3/70"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'portfolio' && service.portfolio && (
                  <div>
                    {service.portfolio.some(item => item.title || item.description || item.url) ? (
                      <div className="space-y-6">
                        {service.portfolio.map((item, index) => {
                          // Skip empty items
                          if (!item.title && !item.description && !item.url) return null;
                          
                          return (
                            <div key={index} className="glass-card rounded-lg p-5">
                              {item.title && (
                                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                              )}
                              
                              {item.description && (
                                <p className="text-gray-300 mb-3">{item.description}</p>
                              )}
                              
                              {item.url && (
                                <a 
                                  href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-neonBlue hover:underline"
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Project
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <p>No portfolio items available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="md:w-1/3">
              <div className="glass-card rounded-lg p-5">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-darkBg3 flex items-center justify-center text-xl mr-3">
                    {service.provider.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{service.provider}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[140px]">{service.providerAddress}</p>
                  </div>
                </div>
                
                {service.rating && (
                  <div className="flex items-center mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(service.rating || 0) 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-500'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm">
                      {service.rating} ({service.reviews || 0} reviews)
                    </span>
                  </div>
                )}
                
                <div className="space-y-3">
                  <button
                    onClick={handleContactProvider}
                    className="w-full py-2 px-4 flex items-center justify-center rounded-lg bg-neonBlue/20 hover:bg-neonBlue/30 text-neonBlue transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Provider
                  </button>
                  
                  <button
                    onClick={handleHireNow}
                    className="w-full py-2 px-4 flex items-center justify-center rounded-lg border border-white/10 hover:bg-darkBg3 transition-colors"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Hire This Service
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 