import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card } from '../ui/Card';

interface WatchlistRow {
  id: number;
  symbol: string;
}

export function WatchlistGrid() {
  const [items, setItems] = useState<WatchlistRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const data = await api.watchlist.getWatchlist();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const removePosition = async (symbol: string) => {
    try {
      await api.watchlist.removeWatchlistItem(symbol);
      loadWatchlist();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="text-[var(--text-color)]">Loading watchlist...</div>;

  return (
    <Card className="p-6 overflow-hidden relative shadow-lg">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
      <h2 className="text-2xl font-bold text-[var(--text-color)] mb-4">Your Watchlist</h2>
      
      {items.length === 0 ? (
        <div className="text-[var(--text-secondary)] italic">Your watchlist is empty. Add symbols to keep an eye on them!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center p-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg hover:border-blue-400 transition-colors">
              <span className="font-bold text-lg">{item.symbol}</span>
              <button 
                onClick={() => removePosition(item.symbol)}
                className="text-danger hover:text-red-500 font-medium px-3 py-1 rounded bg-danger/10 hover:bg-danger/20 transition-all"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
