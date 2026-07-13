import React from 'react';
import type { MarketIndex } from '../../types';
import { Card } from '../ui/Card';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';

interface IndexCardProps {
  index: MarketIndex & { chartData?: { time: string; price: number }[] };
}

export const IndexCard: React.FC<IndexCardProps> = ({ index }) => {
  const isPositive = index.change >= 0;
  const color = isPositive ? 'var(--color-success)' : 'var(--color-danger)';
  const gradientId = `gradient-${index.symbol}`;

  return (
    <Card className="flex flex-row justify-between items-center p-4 h-28 bg-[var(--bg-secondary)] border-[var(--border-color)]">
      <div className="flex flex-col justify-between h-full">
        <div className="text-xs font-semibold text-[var(--text-color)] tracking-wide uppercase">
          {index.name}
        </div>
        <div className="text-xl font-bold text-[var(--text-color)] mt-1">
          {index.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="text-xs mt-1" style={{ color }}>
          {isPositive ? '+' : ''}{index.change.toFixed(2)} ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
        </div>
      </div>
      
      <div className="h-full w-24">
        {index.chartData && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={index.chartData}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis domain={['dataMin', 'dataMax']} hide />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={color} 
                strokeWidth={2}
                fillOpacity={1} 
                fill={`url(#${gradientId})`} 
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};
