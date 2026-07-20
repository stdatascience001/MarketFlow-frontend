import { WatchlistGrid } from '../components/watchlist/WatchlistGrid';
import { useState } from 'react';
import { api } from '../services/api';

export function Watchlist() {
  const [symbol, setSymbol] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) return;
    try {
      await api.watchlist.addWatchlistItem(symbol.toUpperCase());
      window.location.reload(); // Simple refresh for now
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 mb-2">
          Watchlist
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">Keep a close eye on your favorite assets.</p>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WatchlistGrid />
        </div>
        <div>
          <div className="bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-[var(--text-color)]">Add to Watchlist</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm text-[var(--text-secondary)] mb-1">Symbol</label>
                <input 
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  type="text" 
                  placeholder="TSLA" 
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded p-2 text-[var(--text-color)] focus:outline-none focus:border-blue-400" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform"
              >
                Add Symbol
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
