import React from 'react';
import type { Stock } from '../../types';
import { Card } from '../ui/Card';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';

interface StockListProps {
  title: string;
  stocks: Stock[];
  isMarketOpen?: boolean;
  onViewAll?: () => void;
}

// Utility to generate a consistent color based on string
const getAvatarColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 65%, 45%)`;
};

export const StockList: React.FC<StockListProps> = ({ title, stocks, onViewAll }) => {
  return (
    <Card className="flex flex-col bg-[var(--bg-secondary)] border-[var(--border-color)] overflow-hidden h-full group">
      <div className="flex justify-between items-center p-4">
        <h3 className="text-base font-bold text-[var(--text-color)] tracking-tight">{title}</h3>
        {onViewAll && (
          <button onClick={onViewAll} className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center transition-colors">
            View All <ChevronRight size={14} className="ml-0.5" />
          </button>
        )}
      </div>

      {/* Header Row */}
      <div className="grid grid-cols-[1.5rem_1fr_auto_auto] gap-4 px-4 py-2 border-y border-[var(--border-color)] bg-[var(--bg-color)]/30 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
        <div className="text-center">#</div>
        <div>Coin</div>
        <div className="text-right w-24">Price</div>
        <div className="text-right w-20">24h %</div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col">
          {stocks.map((stock, index) => {
            const isPositive = stock.change >= 0;
            const colorClass = isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]';
            
            // Format price dynamically: show more precision for micro-prices
            const formattedPrice = stock.price < 0.01 
              ? stock.price.toPrecision(4) 
              : stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 3 });

            return (
              <Link
                to={`/stocks/${stock.symbol}`}
                key={stock.symbol} 
                className="grid grid-cols-[1.5rem_1fr_auto_auto] gap-4 px-4 py-3 items-center hover:bg-[var(--bg-color)] transition-all cursor-pointer border-b border-[var(--border-color)] last:border-0"
              >
                {/* Index */}
                <div className="text-xs font-semibold text-[var(--text-secondary)] text-center">
                  {index + 1}
                </div>
                
                {/* Coin Info */}
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div 
                    className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-sm"
                    style={{ backgroundColor: getAvatarColor(stock.symbol) }}
                  >
                    {stock.symbol.substring(0, 1)}
                  </div>
                  <div className="flex items-baseline space-x-2 truncate">
                    <span className="text-sm font-bold text-[var(--text-color)]">{stock.symbol}</span>
                    <span className="text-xs text-[var(--text-secondary)] truncate hidden sm:inline-block" title={stock.name}>
                      {stock.name}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-sm font-semibold text-[var(--text-color)] text-right w-24 font-mono">
                  ${formattedPrice}
                </div>

                {/* Change % */}
                <div className={`text-sm font-semibold flex items-center justify-end space-x-1 w-20 ${colorClass}`}>
                  <span className="text-[10px]">{isPositive ? '▲' : '▼'}</span>
                  <span>{Math.abs(stock.changePercent).toFixed(2)}%</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
