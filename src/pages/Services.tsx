
import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { Search, Filter, Briefcase, Star, ChevronRight } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  provider: string;
  providerAddress: string;
  rating: number;
  reviews: number;
  category: string;
  price: string;
  description: string;
  blockchain: string;
}

const Services = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dummy services data
  const services: Service[] = [
    {
      id: '1',
      title: 'Smart Contract Development',
      provider: 'CryptoDevPro',
      providerAddress: '0x1234...5678',
      rating: 4.8,
      reviews: 56,
      category: 'Development',
      price: 'From 2 ETH',
      description: 'Custom smart contract development for DeFi, NFTs, and more.',
      blockchain: 'ethereum'
    },
    {
      id: '2',
      title: 'NFT Artwork Creation',
      provider: 'DigitalArtist',
      providerAddress: '0xabcd...efgh',
      rating: 4.9,
      reviews: 124,
      category: 'Design',
      price: 'From 0.5 SOL',
      description: 'Unique digital art creations for your NFT collections.',
      blockchain: 'solana'
    },
    {
      id: '3',
      title: 'Blockchain Consulting',
      provider: 'CryptoAdvisor',
      providerAddress: '0x7890...1234',
      rating: 4.6,
      reviews: 32,
      category: 'Consulting',
      price: 'From 100 USDC',
      description: 'Expert advice on blockchain projects and tokenomics.',
      blockchain: 'base'
    },
    {
      id: '4',
      title: 'DApp Front-end Development',
      provider: 'WebDevExpert',
      providerAddress: '0xdef0...9876',
      rating: 4.7,
      reviews: 41,
      category: 'Development',
      price: 'From 1000 MATIC',
      description: 'Beautiful and responsive front-end interfaces for your DApps.',
      blockchain: 'polygon'
    }
  ];

  // Filter services based on search query
  const filteredServices = services.filter(service => 
    service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to get blockchain icon
  const getBlockchainIcon = (blockchain: string) => {
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
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Services Marketplace</h1>
          <button className="button-hover bg-neonBlue/20 hover:bg-neonBlue/30 text-neonBlue rounded-lg px-4 py-2 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            List a Service
          </button>
        </div>
        
        <div className="glass-card rounded-xl p-4 animate-fade-in">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 rounded-lg bg-darkBg3/50 border border-white/10 focus:outline-none focus:ring-1 focus:ring-neonBlue/50 placeholder-gray-500"
                placeholder="Search services, providers, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <button className="button-hover flex items-center justify-center px-4 py-2 rounded-lg bg-darkBg3/50 border border-white/10 text-gray-300 hover:border-white/20">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div 
                key={service.id} 
                className="glass-card rounded-xl overflow-hidden animate-scale-in hover:neon-border transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-darkBg3 flex items-center justify-center text-lg mr-3">
                      {service.provider.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{service.provider}</p>
                      <p className="text-xs text-gray-400">{service.providerAddress}</p>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{service.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                      <span className="text-sm">{service.rating} ({service.reviews})</span>
                    </div>
                    <div className="text-sm bg-darkBg3 rounded-full px-3 py-1">
                      {service.category}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{service.price}</span>
                      <span className="text-xs flex items-center text-gray-400">
                        {getBlockchainIcon(service.blockchain)}
                        <span className="ml-1 capitalize">{service.blockchain}</span>
                      </span>
                    </div>
                    <button className="text-neonBlue hover:text-blue-400 transition-colors flex items-center">
                      <span className="text-sm">View</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full glass-card rounded-xl p-8 text-center animate-fade-in">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No services found</h3>
              <p className="text-gray-400 mb-6">
                We couldn't find any services matching "{searchQuery}"
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="button-hover bg-neonBlue/20 hover:bg-neonBlue/30 text-neonBlue rounded-lg px-4 py-2"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Services;
