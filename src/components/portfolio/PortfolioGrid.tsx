import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Card } from '../ui/Card';
import { cn } from '../../utils/cn';

interface PortfolioRow {
  id: number;
  symbol: string;
  quantity: number;
  avg_price: number;
  // We'll calculate current value dynamically if we had real-time prices, but for now we just show db fields
}

export function PortfolioGrid() {
  const [items, setItems] = useState<PortfolioRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const data = await api.portfolio.getPortfolio();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const removePosition = async (symbol: string) => {
    try {
      await api.portfolio.removePosition(symbol);
      loadPortfolio();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="text-[var(--text-color)]">Loading portfolio...</div>;

  return (
    <Card className="p-6 overflow-hidden relative shadow-lg">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-light"></div>
      <h2 className="text-2xl font-bold text-[var(--text-color)] mb-4">Your Portfolio</h2>
      
      {items.length === 0 ? (
        <div className="text-[var(--text-secondary)] italic">Your portfolio is empty. Add positions to track them here!</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="py-3 px-4 font-semibold text-[var(--text-secondary)]">Symbol</th>
                <th className="py-3 px-4 font-semibold text-[var(--text-secondary)]">Shares</th>
                <th className="py-3 px-4 font-semibold text-[var(--text-secondary)]">Avg Price</th>
                <th className="py-3 px-4 font-semibold text-[var(--text-secondary)]">Total Cost</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors">
                  <td className="py-4 px-4 font-bold">{item.symbol}</td>
                  <td className="py-4 px-4">{item.quantity.toFixed(2)}</td>
                  <td className="py-4 px-4">${item.avg_price.toFixed(2)}</td>
                  <td className="py-4 px-4">${(item.quantity * item.avg_price).toFixed(2)}</td>
                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={() => removePosition(item.symbol)}
                      className="text-danger hover:text-red-500 font-medium px-3 py-1 rounded bg-danger/10 hover:bg-danger/20 transition-all"
                    >
                      Sell All
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
