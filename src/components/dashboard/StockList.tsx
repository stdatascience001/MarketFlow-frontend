import React from 'react';
import type { Stock } from '../../types';
import { Card } from '../ui/Card';
import { ChevronRight } from 'lucide-react';

interface StockListProps {
  title: string;
  stocks: Stock[];
  onViewAll?: () => void;
}

export const StockList: React.FC<StockListProps> = ({ title, stocks, onViewAll }) => {
  return (
    <Card className="flex flex-col bg-[var(--bg-secondary)] border-[var(--border-color)] overflow-hidden h-full">
      <div className="flex justify-between items-center p-4 border-b border-[var(--border-color)]">
        <h3 className="text-sm font-semibold text-[var(--text-color)]">{title}</h3>
        {onViewAll && (
          <button onClick={onViewAll} className="text-xs text-[var(--color-primary)] hover:underline flex items-center">
            View All <ChevronRight size={14} className="ml-0.5" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col">
          {stocks.map((stock, index) => {
            const isPositive = stock.change >= 0;
            const colorClass = isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]';
            
            return (
              <div 
                key={stock.symbol} 
                className={`flex items-center justify-between p-3 hover:bg-[var(--bg-color)] transition-colors cursor-pointer ${
                  index !== stocks.length - 1 ? 'border-b border-[var(--border-color)]' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--bg-color)] flex items-center justify-center font-bold text-xs">
                    {stock.symbol.substring(0, 1)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{stock.symbol}</span>
                    <span className="text-xs text-[var(--text-secondary)] truncate w-32" title={stock.name}>
                      {stock.name}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold">
                    ${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className={`text-xs font-medium ${colorClass}`}>
                    {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
