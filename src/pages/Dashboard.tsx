import { useEffect } from 'react';
import { useMarketStore } from '../store/useMarketStore';
import { IndexCard } from '../components/dashboard/IndexCard';
import { StockList } from '../components/dashboard/StockList';
import { MarketOverviewChart } from '../components/dashboard/MarketOverviewChart';
import { SectorsChart } from '../components/dashboard/SectorsChart';
import { Circle } from 'lucide-react';

export const Dashboard = () => {
  const { indices, topGainers, topLosers, mostActive, sectors, fetchMarketData, isLoading } = useMarketStore();

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  if (isLoading) return <div className="p-8 flex items-center justify-center text-[var(--text-secondary)]">Loading dashboard...</div>;

  // We'll use the S&P 500 chart data for the market overview if available
  const sp500Data = indices.find(idx => idx.symbol === '^GSPC')?.chartData || [];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="flex items-center space-x-2 text-sm bg-[var(--bg-secondary)] w-max px-3 py-1.5 rounded-full border border-[var(--border-color)]">
        <Circle size={10} className="fill-[var(--color-success)] text-[var(--color-success)]" />
        <span className="font-semibold text-[var(--text-color)]">Market <span className="text-[var(--color-success)]">is Open</span></span>
        <span className="text-[var(--border-color)] px-1">•</span>
        <span className="text-[var(--text-secondary)]">Closes in 02:15:34</span>
      </div>
      
      {/* Top Row: Index Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map(index => (
          <IndexCard key={index.symbol} index={index} />
        ))}
      </div>

      {/* Middle Row: Stock Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="h-80">
          <StockList title="Top Gainers" stocks={topGainers} onViewAll={() => {}} />
        </div>
        <div className="h-80">
          <StockList title="Top Losers" stocks={topLosers} onViewAll={() => {}} />
        </div>
        <div className="h-80">
          <StockList title="Most Active" stocks={mostActive} onViewAll={() => {}} />
        </div>
      </div>

      {/* Bottom Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px]">
        <div className="lg:col-span-2 h-full min-h-0 relative">
          <MarketOverviewChart data={sp500Data} />
        </div>
        <div className="h-full min-h-0 relative">
          <SectorsChart data={sectors} />
        </div>
      </div>
    </div>
  );
};
