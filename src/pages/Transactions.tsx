import React from 'react';
import { Layout } from '../components/Layout';
import { ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';

interface Transaction {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: string;
  token: string;
  from: string;
  to: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  blockchain: string;
  hash: string;
}

const Transactions = () => {
  // Dummy transactions data
  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'incoming',
      amount: '0.5',
      token: 'ETH',
      from: '0xabcd...1234',
      to: '0x7890...5678',
      timestamp: '2023-06-15 14:30',
      status: 'completed',
      blockchain: 'ethereum',
      hash: '0x123456789abcdef'
    },
    {
      id: '2',
      type: 'outgoing',
      amount: '100',
      token: 'USDC',
      from: '0x7890...5678',
      to: '0xabcd...1234',
      timestamp: '2023-06-14 09:15',
      status: 'completed',
      blockchain: 'base',
      hash: '0x987654321fedcba'
    },
    {
      id: '3',
      type: 'incoming',
      amount: '10',
      token: 'SOL',
      from: 'sol1234...5678',
      to: 'sol8765...4321',
      timestamp: '2023-06-13 11:45',
      status: 'completed',
      blockchain: 'solana',
      hash: 'solhash123456789'
    },
    {
      id: '4',
      type: 'outgoing',
      amount: '25',
      token: 'MATIC',
      from: '0x7890...5678',
      to: '0xdef0...9876',
      timestamp: '2023-06-12 16:20',
      status: 'pending',
      blockchain: 'polygon',
      hash: '0xmatichash123456'
    },
    {
      id: '5',
      type: 'outgoing',
      amount: '0.1',
      token: 'ETH',
      from: '0x7890...5678',
      to: '0xffff...0000',
      timestamp: '2023-06-10 13:10',
      status: 'failed',
      blockchain: 'ethereum',
      hash: '0xfailedhash123456'
    }
  ];

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

  // Function to get status styles
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-neonGreen/20 text-neonGreen';
      case 'pending':
        return 'bg-neonBlue/20 text-neonBlue';
      case 'failed':
        return 'bg-neonPink/20 text-neonPink';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Transactions</h1>
        </div>
        
        <div className="glass-card rounded-xl overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">From/To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Chain</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-darkBg3/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`p-1.5 rounded-full mr-2 ${
                          tx.type === 'incoming' ? 'bg-neonGreen/20' : 'bg-neonPink/20'
                        }`}>
                          {tx.type === 'incoming' ? (
                            <ArrowDownLeft className="w-4 h-4 text-neonGreen" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-neonPink" />
                          )}
                        </div>
                        <span className="text-sm font-medium capitalize">
                          {tx.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        {tx.amount} {tx.token}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {tx.type === 'incoming' ? 'From: ' : 'To: '}
                        {tx.type === 'incoming' ? tx.from : tx.to}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">{tx.timestamp}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm">
                        <span className="mr-1">{getBlockchainIcon(tx.blockchain)}</span>
                        <span className="capitalize">{tx.blockchain}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <a 
                        href={`https://etherscan.io/tx/${tx.hash}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-neonBlue hover:text-blue-400 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="ml-1">View</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Transactions;
