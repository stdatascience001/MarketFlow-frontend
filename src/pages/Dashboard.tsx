import { useEffect, useState } from 'react';
import { useMarketStore } from '../store/useMarketStore';
import { IndexCard } from '../components/dashboard/IndexCard';
import { StockList } from '../components/dashboard/StockList';
import { MarketOverviewChart } from '../components/dashboard/MarketOverviewChart';
import { SectorsChart } from '../components/dashboard/SectorsChart';
import { Circle, Lock } from 'lucide-react';

export const Dashboard = () => {
  const {
    marketType, indices, topGainers, topLosers, mostActive, sectors,
    fetchMarketData, isLoading, marketStatus, refreshMarketStatus,
  } = useMarketStore();

  // Countdown timer that ticks every second
  const [tick, setTick] = useState(0);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Tick every second so the countdown updates; refresh store status every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
      // Every 60 ticks (~1 minute) re-evaluate market open/close state
      if (tick > 0 && tick % 60 === 0) refreshMarketStatus();
    }, 1000);
    return () => clearInterval(interval);
  }, [tick, refreshMarketStatus]);

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center text-[var(--text-secondary)]">
        Loading dashboard…
      </div>
    );
  }

  const isCrypto = marketType === 'crypto';
  const isOpen = isCrypto ? true : marketStatus.isOpen;
  const statusLabel = isCrypto ? 'Open 24/7' : marketStatus.statusLabel;
  const sp500Data = indices.find(idx => idx.symbol === '^GSPC' || idx.symbol === 'TOTAL')?.chartData || [];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">

      {/* ── Market Status Badge ─────────────────────────────────────────────── */}
      {isOpen ? (
        /* Market OPEN */
        <div className="flex items-center space-x-2 text-sm bg-[var(--bg-secondary)] w-max px-3 py-1.5 rounded-full border border-[var(--border-color)]">
          <Circle size={10} className="fill-[var(--color-success)] text-[var(--color-success)]" />
          <span className="font-semibold text-[var(--text-color)]">
            {isCrypto ? 'Crypto Market ' : 'Market '}
            <span className="text-[var(--color-success)]">is Open</span>
          </span>
          <span className="text-[var(--border-color)] px-1">•</span>
          <span className="text-[var(--text-secondary)]">{statusLabel}</span>
        </div>
      ) : (
        /* Market CLOSED */
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2 text-sm bg-[var(--bg-secondary)] w-max px-3 py-1.5 rounded-full border border-[var(--border-color)]">
            <Lock size={10} className="text-[var(--color-danger)]" />
            <span className="font-semibold text-[var(--text-color)]">
              Market <span className="text-[var(--color-danger)]">is Closed</span>
            </span>
            <span className="text-[var(--border-color)] px-1">•</span>
            <span className="text-[var(--text-secondary)]">{statusLabel}</span>
          </div>
          <span className="text-xs text-[var(--text-secondary)] italic">
            Showing last closing prices — live updates paused
          </span>
        </div>
      )}

      {/* ── Market Closed Banner ─────────────────────────────────────────────── */}
      {!isOpen && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/5 text-sm">
          <Lock size={16} className="text-[var(--color-danger)] flex-shrink-0" />
          <div>
            <span className="font-semibold text-[var(--color-danger)]">Market Closed</span>
            <span className="text-[var(--text-secondary)] ml-2">
              US stock markets are currently closed. Prices below reflect the last official closing values.
              Real-time updates will resume when the market opens (Mon–Fri, 9:30 AM – 4:00 PM ET).
            </span>
          </div>
        </div>
      )}

      {/* ── Top Row: Index Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map(index => (
          <IndexCard key={index.symbol} index={index} isMarketOpen={isOpen} />
        ))}
      </div>

      {/* ── Middle Row: Stock Lists ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="h-80">
          <StockList title="Top Gainers"  stocks={topGainers} isMarketOpen={isOpen} onViewAll={() => {}} />
        </div>
        <div className="h-80">
          <StockList title="Top Losers"   stocks={topLosers}  isMarketOpen={isOpen} onViewAll={() => {}} />
        </div>
        <div className="h-80">
          <StockList title={isCrypto ? "Trending Coins" : "Most Active"}  stocks={mostActive} isMarketOpen={isOpen} onViewAll={() => {}} />
        </div>
      </div>

      {/* ── Bottom Row: Charts ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px]">
        <div className="lg:col-span-2 h-full min-h-0 relative">
          <MarketOverviewChart data={sp500Data} isMarketOpen={isOpen} />
        </div>
        <div className="h-full min-h-0 relative">
          <SectorsChart data={sectors} />
        </div>
      </div>
    </div>
  );
};
