import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Area, AreaChart, ResponsiveContainer, YAxis, XAxis, Tooltip, CartesianGrid } from 'recharts';

interface MarketOverviewChartProps {
  data: { time: string; price: number }[];
}

export const MarketOverviewChart: React.FC<MarketOverviewChartProps> = ({ data }) => {
  const [timeframe, setTimeframe] = useState('1D');
  const timeframes = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'All'];

  // A more professional styling for the chart
  const color = 'var(--color-success)'; 
  const gradientId = 'market-overview-gradient';

  return (
    <Card className="flex flex-col bg-[var(--bg-secondary)] border-[var(--border-color)] p-4 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold text-[var(--text-color)]">Market Overview</h3>
        <div className="flex space-x-1">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                timeframe === tf 
                  ? 'bg-[var(--color-primary)] text-white font-medium' 
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-color)]'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 min-h-[250px] w-full">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                dy={10}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
                dx={-10}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-color)', 
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-color)',
                  borderRadius: '0.5rem'
                }} 
              />
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
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--text-secondary)] text-sm">
            No chart data available
          </div>
        )}
      </div>
    </Card>
  );
};
