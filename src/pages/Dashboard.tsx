import { useEffect } from 'react';
import { useMarketStore } from '../store/useMarketStore';
import { IndexCard } from '../components/dashboard/IndexCard';
import { Circle } from 'lucide-react';

export const Dashboard = () => {
  const { indices, fetchMarketData, isLoading } = useMarketStore();

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  if (isLoading) return <div className="p-8">Loading market data...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center space-x-2 text-sm mb-6 bg-[var(--bg-secondary)] w-max px-3 py-1.5 rounded-full border border-[var(--border-color)]">
        <Circle size={10} className="fill-[var(--color-success)] text-[var(--color-success)]" />
        <span className="font-semibold text-white">Market <span className="text-[var(--color-success)]">is Open</span></span>
        <span className="text-[var(--border-color)] px-1">•</span>
        <span className="text-[var(--text-secondary)]">Closes in 02:15:34</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {indices.map(index => (
          <IndexCard key={index.symbol} index={index} />
        ))}
      </div>
    </div>
  );
};

