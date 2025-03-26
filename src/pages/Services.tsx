import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Search, Filter, Briefcase, Star, ChevronRight, Wallet } from 'lucide-react';
import { ServiceListingDialog } from '../components/ServiceListingDialog';
import { ServiceDetailDialog, Service } from '../components/ServiceDetailDialog';
import { useBlockchain } from '../lib/blockchain/blockchain-context';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const Services = () => {
  const location = useLocation();
  const { walletInfo } = useBlockchain();
  const [searchQuery, setSearchQuery] = useState('');
  const [isListingDialogOpen, setIsListingDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Service categories for filter
  const categories = [
    { id: '', name: 'All Categories' },
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
  
  // Initial services data
  useEffect(() => {
    const initialServices: Service[] = [
      {
        id: '1',
        title: 'Smart Contract Development',
        provider: 'CryptoDevPro',
        providerAddress: '0x1234...5678',
        rating: 4.8,
        reviews: 56,
        category: 'development',
        price: '2',
        priceUnit: 'ETH',
        description: 'Custom smart contract development for DeFi, NFTs, and more. I specialize in creating secure, auditable smart contracts for various blockchain applications. Whether you need a token contract, NFT marketplace, or a custom DeFi protocol, I can help bring your project to life.',
        blockchain: 'ethereum',
        portfolio: [
          {
            title: 'DeFi Lending Protocol',
            description: 'Developed a decentralized lending protocol with variable interest rates and multiple collateral types.',
            url: 'https://github.com/example/defi-lending'
          },
          {
            title: 'NFT Marketplace',
            description: 'Created a full-featured NFT marketplace with royalty payments and auction functionality.',
            url: 'https://example-nft.com'
          }
        ],
        createdAt: Date.now() - 86400000 * 2 // 2 days ago
      },
      {
        id: '2',
        title: 'NFT Artwork Creation',
        provider: 'DigitalArtist',
        providerAddress: '0xabcd...efgh',
        rating: 4.9,
        reviews: 124,
        category: 'design',
        price: '0.5',
        priceUnit: 'SOL',
        description: 'Unique digital art creations for your NFT collections. I create high-quality, one-of-a-kind digital artwork that stands out in the NFT marketplace. My style combines elements of cyberpunk, vaporwave, and abstract expressionism.',
        blockchain: 'solana',
        portfolio: [
          {
            title: 'Cosmic Dreamers Collection',
            description: 'A collection of 50 unique space-themed artworks that sold out in 24 hours.',
            url: 'https://magiceden.io/example'
          }
        ],
        createdAt: Date.now() - 86400000 * 5 // 5 days ago
      },
      {
        id: '3',
        title: 'Blockchain Consulting',
        provider: 'CryptoAdvisor',
        providerAddress: '0x7890...1234',
        rating: 4.6,
        reviews: 32,
        category: 'consulting',
        price: '100',
        priceUnit: 'USDC',
        description: 'Expert advice on blockchain projects and tokenomics. I offer strategic consulting services for blockchain startups and established businesses looking to integrate blockchain technology. Services include tokenomics design, go-to-market strategy, and technical architecture review.',
        blockchain: 'base',
        createdAt: Date.now() - 86400000 * 7 // 7 days ago
      },
      {
        id: '4',
        title: 'DApp Front-end Development',
        provider: 'WebDevExpert',
        providerAddress: '0xdef0...9876',
        rating: 4.7,
        reviews: 41,
        category: 'development',
        price: '1000',
        priceUnit: 'MATIC',
        description: 'Beautiful and responsive front-end interfaces for your DApps. I specialize in creating intuitive and engaging user interfaces for decentralized applications. Using React, Next.js, and ethers.js, I build performant and user-friendly DApps that seamlessly integrate with blockchain technologies.',
        blockchain: 'polygon',
        portfolio: [
          {
            title: 'DEX Interface',
            description: 'A modern interface for a decentralized exchange with charts and advanced trading features.',
            url: 'https://dex-example.com'
          },
          {
            title: 'NFT Gallery',
            description: 'Interactive NFT gallery with filters, search, and wallet integration.',
            url: 'https://nft-gallery-example.vercel.app'
          },
          {
            title: 'DAO Dashboard',
            description: 'Governance dashboard for a DAO with proposal creation and voting functionality.',
            url: 'https://dao-example.com'
          }
        ],
        createdAt: Date.now() - 86400000 * 3 // 3 days ago
      },
      {
        id: '5',
        title: 'Blockchain Marketing Strategy',
        provider: 'CryptoMarketer',
        providerAddress: '0x4567...8901',
        rating: 4.5,
        reviews: 28,
        category: 'marketing',
        price: '800',
        priceUnit: 'USDC',
        description: 'Comprehensive marketing strategies for blockchain projects. I help blockchain projects gain visibility and community traction through organic growth tactics, content marketing, and community building.',
        blockchain: 'ethereum',
        createdAt: Date.now() - 86400000 * 10 // 10 days ago
      },
      {
        id: '6',
        title: 'Smart Contract Auditing',
        provider: 'SecurityExpert',
        providerAddress: '0xfedc...ba98',
        rating: 4.9,
        reviews: 47,
        category: 'development',
        price: '3',
        priceUnit: 'ETH',
        description: 'Professional smart contract security audits. I conduct thorough code reviews and security audits to identify vulnerabilities in your smart contracts before they go to production.',
        blockchain: 'ethereum',
        portfolio: [
          {
            title: 'DeFi Protocol Audit',
            description: 'Comprehensive security audit for a major DeFi lending protocol, identifying and fixing 3 critical vulnerabilities.',
            url: 'https://github.com/example/audit-reports'
          }
        ],
        createdAt: Date.now() - 86400000 * 1 // 1 day ago
      }
    ];
    
    setServices(initialServices);
  }, []);

  // Handle service listing
  const handleServiceSubmit = (serviceData: Service) => {
    const newService: Service = {
      ...serviceData,
      id: `${services.length + 1}`,
      price: serviceData.price,
      priceUnit: serviceData.priceUnit,
      rating: 0,
      reviews: 0
    };
    
    setServices([newService, ...services]);
  };

  // Handle viewing service details
  const handleViewService = (service: Service) => {
    setSelectedService(service);
    setIsDetailDialogOpen(true);
  };

  // Filter services based on search query and category
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter ? service.category === categoryFilter : true;
    
    return matchesSearch && matchesCategory;
  });

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

  // Check for wallet connection when trying to list a service
  const handleListServiceClick = () => {
    if (!walletInfo) {
      toast.error('Please connect your wallet to list a service');
    } else {
      setIsListingDialogOpen(true);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Services Marketplace</h1>
          <button 
            onClick={handleListServiceClick}
            className="button-hover bg-neonBlue/20 hover:bg-neonBlue/30 text-neonBlue rounded-lg px-4 py-2 flex items-center"
          >
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
            
            <button 
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="button-hover flex items-center justify-center px-4 py-2 rounded-lg bg-darkBg3/50 border border-white/10 text-gray-300 hover:border-white/20"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>
          
          {filtersOpen && (
            <div className="mt-4 p-4 border-t border-white/10 animate-fade-in">
              <h3 className="text-sm font-medium mb-3">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      categoryFilter === cat.id
                        ? 'bg-neonBlue/20 text-neonBlue'
                        : 'bg-darkBg3/50 text-gray-300 hover:bg-darkBg3'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.length > 0 ? (
            filteredServices.map((service) => (
              <div 
                key={service.id} 
                className="glass-card rounded-xl overflow-hidden animate-fade-in hover:neon-border transition-all duration-300"
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
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                      <span className="text-sm">{service.rating} ({service.reviews})</span>
                    </div>
                    <div className="text-sm bg-darkBg3 rounded-full px-3 py-1">
                      {categories.find(cat => cat.id === service.category)?.name || service.category}
                    </div>
                  </div>
                  
                  {service.portfolio && service.portfolio.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="text-xs bg-neonBlue/10 text-neonBlue rounded-full px-2 py-1 flex items-center">
                        <Briefcase className="w-3 h-3 mr-1" /> Portfolio: {service.portfolio.length} item{service.portfolio.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{service.price} {service.priceUnit}</span>
                      <span className="text-xs flex items-center text-gray-400">
                        {getBlockchainIcon(service.blockchain)}
                        <span className="ml-1 capitalize">{service.blockchain}</span>
                      </span>
                    </div>
                    <button 
                      onClick={() => handleViewService(service)}
                      className="text-neonBlue hover:text-blue-400 transition-colors flex items-center"
                    >
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
                {searchQuery 
                  ? `We couldn't find any services matching "${searchQuery}"`
                  : 'No services match the selected filters'
                }
              </p>
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('');
                }}
                className="button-hover bg-neonBlue/20 hover:bg-neonBlue/30 text-neonBlue rounded-lg px-4 py-2"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Service listing dialog */}
      <ServiceListingDialog 
        isOpen={isListingDialogOpen}
        onClose={() => setIsListingDialogOpen(false)}
        onSubmit={handleServiceSubmit}
      />

      {/* Service detail dialog */}
      <ServiceDetailDialog 
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        service={selectedService}
      />
    </Layout>
  );
};

export default Services;

