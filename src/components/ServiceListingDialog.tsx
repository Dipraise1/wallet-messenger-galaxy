import React, { useState } from 'react';
import { X, Plus, Minus, Info, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useBlockchain } from '../lib/blockchain/blockchain-context';
import { Service } from './ServiceDetailDialog';

export interface ServiceCategory {
  id: string;
  name: string;
}

export interface PortfolioItem {
  title: string;
  description: string;
  url: string;
}

interface ServiceListingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (serviceData: Service) => void;
}

// Service categories
const serviceCategories: ServiceCategory[] = [
  { id: 'development', name: 'Development' },
  { id: 'design', name: 'Design' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'consulting', name: 'Consulting' },
  { id: 'writing', name: 'Content Writing' },
  { id: 'translation', name: 'Translation' },
  { id: 'financial', name: 'Financial Services' },
  { id: 'legal', name: 'Legal' },
  { id: 'admin', name: 'Administrative' },
  { id: 'other', name: 'Other' }
];

export const ServiceListingDialog: React.FC<ServiceListingDialogProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const { walletInfo, activeNetwork } = useBlockchain();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [priceUnit, setPriceUnit] = useState('');
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    { title: '', description: '', url: '' }
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleAddPortfolioItem = () => {
    setPortfolio([...portfolio, { title: '', description: '', url: '' }]);
  };

  const handleRemovePortfolioItem = (index: number) => {
    if (portfolio.length === 1) return;
    const newPortfolio = [...portfolio];
    newPortfolio.splice(index, 1);
    setPortfolio(newPortfolio);
  };

  const handlePortfolioChange = (index: number, field: string, value: string) => {
    const newPortfolio = [...portfolio];
    newPortfolio[index] = { ...newPortfolio[index], [field]: value };
    setPortfolio(newPortfolio);
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';
    if (!price.trim()) newErrors.price = 'Price is required';
    if (!priceUnit) newErrors.priceUnit = 'Currency is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    portfolio.forEach((item, index) => {
      if (item.url && !item.url.trim().match(/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/)) {
        newErrors[`url_${index}`] = 'Please enter a valid URL';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getCurrencyForNetwork = () => {
    switch (activeNetwork.toLowerCase()) {
      case 'ethereum': return ['ETH', 'USDC', 'USDT', 'DAI'];
      case 'solana': return ['SOL', 'USDC'];
      case 'base': return ['ETH', 'USDC'];
      case 'polygon': return ['MATIC', 'USDC', 'DAI'];
      case 'avalanche': return ['AVAX', 'USDC', 'USDT'];
      case 'bsc': return ['BNB', 'BUSD', 'USDT'];
      default: return ['ETH', 'USDC'];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 2 && validateStep2()) {
      // Filter out empty portfolio items
      const filteredPortfolio = portfolio.filter(item => 
        item.title.trim() || item.description.trim() || item.url.trim()
      );
      
      // Create service object
      const serviceData: Service = {
        id: `new_${Date.now()}`, // Generate a temporary ID
        title,
        description,
        category,
        price,
        priceUnit,
        portfolio: filteredPortfolio,
        provider: walletInfo?.address.slice(0, 6) || 'Anonymous',
        providerAddress: walletInfo?.address || '',
        blockchain: activeNetwork,
        createdAt: Date.now(),
        rating: 0,
        reviews: 0
      };
      
      onSubmit(serviceData);
      toast.success('Service listed successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('');
      setPrice('');
      setPriceUnit('');
      setPortfolio([{ title: '', description: '', url: '' }]);
      setCurrentStep(1);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="glass-card rounded-xl w-full max-w-2xl animate-scale-in overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold">List Your Service</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-darkBg3"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <div className="mb-6 flex justify-between items-center">
            <div className="flex space-x-2">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-neonBlue text-black' : 'bg-darkBg3 text-gray-400'
                }`}
              >
                1
              </div>
              <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-neonBlue' : 'bg-darkBg3'}`}></div>
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-neonBlue text-black' : 'bg-darkBg3 text-gray-400'
                }`}
              >
                2
              </div>
            </div>
            <div className="text-sm text-gray-400">
              Step {currentStep} of 2
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Service Title *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full bg-darkBg3/50 rounded-lg p-3 text-sm border ${
                      errors.title ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-neonBlue/50'
                    } focus:outline-none focus:ring-1`}
                    placeholder="e.g., Smart Contract Development"
                  />
                  {errors.title && (
                    <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full bg-darkBg3/50 rounded-lg p-3 text-sm border ${
                      errors.description ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-neonBlue/50'
                    } focus:outline-none focus:ring-1 min-h-[100px]`}
                    placeholder="Describe your service in detail..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={`w-full bg-darkBg3/50 rounded-lg p-3 text-sm border ${
                      errors.category ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-neonBlue/50'
                    } focus:outline-none focus:ring-1`}
                  >
                    <option value="">Select a category</option>
                    {serviceCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-xs text-red-500">{errors.category}</p>
                  )}
                </div>
                
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label htmlFor="price" className="block text-sm font-medium mb-1">
                      Price *
                    </label>
                    <input
                      id="price"
                      type="number"
                      min="0"
                      step="0.001"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className={`w-full bg-darkBg3/50 rounded-lg p-3 text-sm border ${
                        errors.price ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-neonBlue/50'
                      } focus:outline-none focus:ring-1`}
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <label htmlFor="priceUnit" className="block text-sm font-medium mb-1">
                      Currency *
                    </label>
                    <select
                      id="priceUnit"
                      value={priceUnit}
                      onChange={(e) => setPriceUnit(e.target.value)}
                      className={`w-full bg-darkBg3/50 rounded-lg p-3 text-sm border ${
                        errors.priceUnit ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-neonBlue/50'
                      } focus:outline-none focus:ring-1`}
                    >
                      <option value="">Select currency</option>
                      {getCurrencyForNetwork().map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                    {errors.priceUnit && (
                      <p className="mt-1 text-xs text-red-500">{errors.priceUnit}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start p-3 bg-darkBg3/30 rounded-lg mt-4">
                  <Info className="w-5 h-5 text-neonBlue mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-xs text-gray-400">
                    Your service will be listed on the {activeNetwork} network. Make sure your wallet is connected to the correct network.
                  </p>
                </div>
              </div>
            )}
            
            {currentStep === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Portfolio Items</h3>
                    <button
                      type="button"
                      onClick={handleAddPortfolioItem}
                      className="text-sm text-neonBlue hover:text-blue-400 flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Item
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4">
                    Add examples of your previous work to showcase your skills (optional)
                  </p>
                  
                  {portfolio.map((item, index) => (
                    <div 
                      key={index} 
                      className="glass-card rounded-lg p-4 mb-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-sm font-medium">Item {index + 1}</h4>
                        {portfolio.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemovePortfolioItem(index)}
                            className="text-red-500 hover:text-red-400"
                            title="Remove item"
                            aria-label="Remove item"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handlePortfolioChange(index, 'title', e.target.value)}
                          className="w-full bg-darkBg3/50 rounded-lg p-2 text-sm border border-white/10 focus:outline-none focus:ring-1 focus:ring-neonBlue/50"
                          placeholder="Title"
                        />
                        
                        <input
                          type="text"
                          value={item.url}
                          onChange={(e) => handlePortfolioChange(index, 'url', e.target.value)}
                          className={`w-full bg-darkBg3/50 rounded-lg p-2 text-sm border ${
                            errors[`url_${index}`] ? 'border-red-500 focus:ring-red-500' : 'border-white/10 focus:ring-neonBlue/50'
                          } focus:outline-none focus:ring-1`}
                          placeholder="URL (e.g., https://example.com)"
                        />
                        {errors[`url_${index}`] && (
                          <p className="mt-1 text-xs text-red-500">{errors[`url_${index}`]}</p>
                        )}
                        
                        <textarea
                          value={item.description}
                          onChange={(e) => handlePortfolioChange(index, 'description', e.target.value)}
                          className="w-full bg-darkBg3/50 rounded-lg p-2 text-sm border border-white/10 focus:outline-none focus:ring-1 focus:ring-neonBlue/50"
                          placeholder="Brief description"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-start p-3 bg-darkBg3/30 rounded-lg mt-4">
                  <Info className="w-5 h-5 text-neonBlue mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-xs text-gray-400">
                    Your service listing will be visible to all users on the platform. Make sure to provide accurate information.
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 border border-white/10 rounded-lg hover:bg-darkBg3/70"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 2 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-4 py-2 bg-neonBlue/20 text-neonBlue rounded-lg hover:bg-neonBlue/30 flex items-center"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 bg-neonBlue/20 text-neonBlue rounded-lg hover:bg-neonBlue/30"
                >
                  List Service
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 