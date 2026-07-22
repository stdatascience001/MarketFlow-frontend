import React from 'react';
import type { MarketIndex } from '../../types';
import { Card } from '../ui/Card';
import { Area, AreaChart, Bar, BarChart, Line, LineChart, PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, YAxis } from 'recharts';
import { PieChart, BarChart2, Bitcoin, Smile, Frown, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

interface IndexCardProps {
  index: MarketIndex & { chartData?: { time: string; price: number }[] };
  isMarketOpen?: boolean;
}

const getCardMeta = (symbol: string, value: number) => {
  switch(symbol) {
    case 'TOTAL':
      return { icon: PieChart, iconBg: '#8b5cf6', iconColor: '#fff', chartType: 'area' };
    case 'VOL':
      return { icon: BarChart2, iconBg: '#2563eb', iconColor: '#fff', chartType: 'bar' };
    case 'BTCD':
      return { icon: Bitcoin, iconBg: '#f59e0b', iconColor: '#fff', chartType: 'line' };
    case 'FGI':
      const isGreed = value >= 50;
      return { icon: isGreed ? Smile : Frown, iconBg: isGreed ? '#10b981' : '#ef4444', iconColor: '#fff', chartType: 'gauge' };
    case '^GSPC':
    case '^IXIC':
    case '^DJI':
    case '^VIX':
      return { icon: Activity, iconBg: 'var(--color-primary)', iconColor: '#fff', chartType: 'area' };
    default:
      return { icon: DollarSign, iconBg: 'var(--bg-secondary)', iconColor: 'var(--text-color)', chartType: 'area' };
  }
}

export const IndexCard: React.FC<IndexCardProps> = ({ index, isMarketOpen = true }) => {
  const isPositive = index.change >= 0;
  const color = isPositive ? 'var(--color-success)' : 'var(--color-danger)';
  const gradientId = `gradient-${index.symbol}`;
  
  const meta = getCardMeta(index.symbol, index.price);
  const Icon = meta.icon;

  const renderChart = () => {
    if (!index.chartData) return null;
    
    if (meta.chartType === 'gauge') {
      const data = [
        { name: 'Value', value: index.price },
        { name: 'Rest', value: 100 - index.price }
      ];
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={30}
              outerRadius={45}
              dataKey="value"
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill={meta.iconBg} />
              <Cell fill="var(--border-color)" />
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
      );
    }
    
    if (meta.chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={index.chartData}>
            <YAxis domain={['dataMin', 'dataMax']} hide />
            <Bar dataKey="price" fill={meta.iconBg} radius={[2, 2, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    
    if (meta.chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={index.chartData}>
            <YAxis domain={['dataMin', 'dataMax']} hide />
            <Line type="monotone" dataKey="price" stroke={meta.iconBg} strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      );
    }
    
    return (
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={index.chartData}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={color} stopOpacity={0.3} />
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
    );
  };

  return (
    <Card className="flex flex-col justify-between p-5 h-36 bg-[var(--bg-secondary)] border-[var(--border-color)] relative overflow-hidden group hover:shadow-lg transition-all hover:border-[var(--color-primary)]/50 cursor-default">
      {/* Closed market dim overlay stripe */}
      {!isMarketOpen && (
        <div className="absolute inset-0 pointer-events-none border-t-2 border-[var(--color-danger)]/20 z-20" />
      )}

      {/* Top Section */}
      <div className="flex justify-between items-start z-10">
        <div className="flex flex-col">
           <div className="text-sm font-medium text-[var(--text-secondary)]">{index.name}</div>
           {!isMarketOpen && (
             <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-danger)] bg-[var(--color-danger)]/10 px-1.5 py-0.5 rounded-full leading-none w-max mt-1">
               Closed
             </span>
           )}
        </div>
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm" 
          style={{ backgroundColor: meta.iconBg }}
        >
          <Icon size={20} color={meta.iconColor} />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex justify-between items-end z-10 w-full mt-2">
        <div className="flex flex-col">
          <div className="text-2xl font-bold text-[var(--text-color)] tracking-tight">
            {index.valueText ? index.valueText.split(' ')[0] : index.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          
          {index.valueText && index.valueText.includes(' ') ? (
             <div className="text-sm font-medium mt-1" style={{ color: meta.iconBg }}>
               {index.valueText.split(' ').slice(1).join(' ')}
             </div>
          ) : (
            <div className="flex items-center gap-1 text-sm font-medium mt-1" style={{ color }}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{Math.abs(index.changePercent).toFixed(2)}%</span>
              <span className="text-[var(--text-secondary)] text-xs font-normal ml-0.5">
                {['TOTAL', 'VOL', 'BTCD'].includes(index.symbol) ? '(24h)' : ''}
              </span>
              {!isMarketOpen && (
                <span className="text-[var(--text-secondary)] text-[10px] ml-1">at close</span>
              )}
            </div>
          )}
        </div>
        
        {/* Chart Section */}
        <div className={`h-12 w-28 transition-opacity duration-300 opacity-80 group-hover:opacity-100 ${!isMarketOpen ? 'opacity-40' : ''}`}>
          {renderChart()}
        </div>
      </div>
    </Card>
  );
};
