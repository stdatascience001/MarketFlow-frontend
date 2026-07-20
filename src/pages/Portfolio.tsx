import { PortfolioGrid } from '../components/portfolio/PortfolioGrid';
import { useState } from 'react';
import { api } from '../services/api';

export function Portfolio() {
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  // Note: For a real app we would use a more robust form state, this is just to demonstrate functionality

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !quantity || !price) return;
    try {
      await api.portfolio.addPosition(symbol.toUpperCase(), parseFloat(quantity), parseFloat(price));
      window.location.reload(); // Simple refresh for now
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-light to-blue-500 mb-2">
          Portfolio
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">Manage your holdings and track performance.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PortfolioGrid />
        </div>
        <div>
          <div className="bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-[var(--text-color)]">Simulate Trade</h3>
            <form onSubmit={handleBuy} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Symbol</label>
                <input 
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  type="text" 
                  placeholder="AAPL" 
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-2 text-[var(--text-color)] focus:outline-none focus:border-primary" 
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Quantity</label>
                <input 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  type="number" 
                  min="0.1" 
                  step="0.1"
                  placeholder="10" 
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-2 text-[var(--text-color)] focus:outline-none focus:border-primary" 
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Average Price ($)</label>
                <input 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  type="number" 
                  min="1" 
                  step="0.01"
                  placeholder="150.00" 
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-2 text-[var(--text-color)] focus:outline-none focus:border-primary" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2 bg-gradient-to-r from-primary to-primary-dark text-white rounded font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform"
              >
                Buy Asset
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
