import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { CandlestickChart } from '../components/stock/CandlestickChart';
import type { Time } from 'lightweight-charts';

interface ProfileData {
  symbol: string;
  name: string;
  sector: string;
  exchange: string;
}

interface AlpacaBar {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

// Timeframe config ─ each maps to an Alpaca interval + a start date offset in days
type TfKey = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y' | '3Y';

const TIMEFRAMES: { label: TfKey; interval: string; daysBack: number; limit: number }[] = [
  { label: '1D',  interval: '1Min',  daysBack: 1,    limit: 1000 },
  { label: '1W',  interval: '15Min', daysBack: 7,    limit: 1000 },
  { label: '1M',  interval: '1Hour', daysBack: 30,   limit: 720  },
  { label: '3M',  interval: '1Day',  daysBack: 90,   limit: 90   },
  { label: '6M',  interval: '1Day',  daysBack: 180,  limit: 180  },
  { label: '1Y',  interval: '1Day',  daysBack: 365,  limit: 365  },
  { label: '3Y',  interval: '1Week', daysBack: 1095, limit: 156  },
];

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const WS_URL   = BASE_URL.replace(/^http/, 'ws') + '/api/ws';

function subtractDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

export const StockDetails: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [profile,      setProfile]      = useState<ProfileData | null>(null);
  const [history,      setHistory]      = useState<any[]>([]);
  const [latestBar,    setLatestBar]    = useState<any>(null);
  const [loading,      setLoading]      = useState(true);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [activeTf,    setActiveTf]     = useState<TfKey>('1D');
  const wsRef = useRef<WebSocket | null>(null);

  // ─── Fetch history whenever symbol or timeframe changes ───────────────────
  useEffect(() => {
    if (!symbol) return;

    const tf = TIMEFRAMES.find(t => t.label === activeTf) ?? TIMEFRAMES[0];

    const fetchHistory = async () => {
      setLoading(true);
      setHistory([]);
      try {
        const start = subtractDays(tf.daysBack);
        const url =
          `${BASE_URL}/api/stocks/${symbol}/history` +
          `?interval=${tf.interval}&start=${encodeURIComponent(start)}&limit=${tf.limit}`;

        const res = await fetch(url);
        if (!res.ok) return;

        const raw = await res.json();
        const barsData: AlpacaBar[] | undefined =
          raw.bars ? raw.bars[symbol] : raw[symbol];

        if (barsData && Array.isArray(barsData)) {
          const formatted = barsData.map(bar => ({
            time:  (new Date(bar.t).getTime() / 1000) as Time,
            open:  bar.o,
            high:  bar.h,
            low:   bar.l,
            close: bar.c,
          }));
          setHistory(formatted);
          if (formatted.length > 0) {
            setCurrentPrice(formatted[formatted.length - 1].close);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [symbol, activeTf]);

  // ─── Profile + WebSocket (symbol-scoped, not tf-scoped) ────────────────────
  useEffect(() => {
    if (!symbol) return;

    // Fetch profile once
    fetch(`${BASE_URL}/api/stocks/${symbol}/profile`)
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setProfile(d))
      .catch(console.error);

    // WebSocket live stream
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        action: 'subscribe',
        quotes: [symbol],
        trades: [symbol],
        bars:   [symbol],
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.T === 'b' && data.S === symbol) {
        const newBar = {
          time:  (new Date(data.t).getTime() / 1000) as Time,
          open:  data.o,
          high:  data.h,
          low:   data.l,
          close: data.c,
        };
        setLatestBar(newBar);
        setCurrentPrice(data.c);
      } else if (data.T === 't' && data.S === symbol) {
        setCurrentPrice(data.p);
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
          action: 'unsubscribe',
          quotes: [symbol],
          trades: [symbol],
          bars:   [symbol],
        }));
      }
      ws.close();
    };
  }, [symbol]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-light mb-1">
            {profile?.name || symbol}
          </h1>
          <p className="text-[var(--text-secondary)] text-base">
            {symbol} &nbsp;•&nbsp; {profile?.exchange} &nbsp;•&nbsp; {profile?.sector}
          </p>
        </div>

        <div className="mt-4 md:mt-0 text-right">
          <div className="text-3xl font-bold text-[var(--text-color)]">
            {currentPrice ? `$${currentPrice.toFixed(2)}` : '---'}
          </div>
          <div className="text-sm font-medium text-[var(--color-success)] flex items-center justify-end mt-1">
            <span className="relative flex h-2.5 w-2.5 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-success)]" />
            </span>
            Live Data
          </div>
        </div>
      </div>

      {/* ── Chart card ────────────────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        {/* Chart area */}
        <div className="h-[420px] relative">
          {loading ? (
            <div className="flex items-center justify-center h-full text-[var(--text-secondary)] text-sm animate-pulse">
              Loading chart data…
            </div>
          ) : history.length > 0 ? (
            <CandlestickChart data={history} latestData={latestBar} />
          ) : (
            <div className="flex items-center justify-center h-full text-[var(--text-secondary)]">
              No historical data available for {symbol}.
            </div>
          )}
        </div>

        {/* ── Timeframe selector ─────────────────────────────────────────── */}
        <div className="flex items-center justify-center gap-1 px-4 py-3 border-t border-[var(--border-color)]">
          {TIMEFRAMES.map(tf => (
            <button
              key={tf.label}
              onClick={() => setActiveTf(tf.label)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150
                ${activeTf === tf.label
                  ? 'bg-primary text-white shadow-md shadow-primary/30'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--border-color)] hover:text-[var(--text-color)]'
                }
              `}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </Card>

      {/* ── Company Info ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4">Company Info</h3>
          <div className="space-y-3 text-sm">
            {[
              ['Name',     profile?.name     ?? '—'],
              ['Symbol',   symbol            ?? '—'],
              ['Sector',   profile?.sector   ?? '—'],
              ['Exchange', profile?.exchange ?? '—'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-[var(--border-color)] pb-2 last:border-0">
                <span className="text-[var(--text-secondary)]">{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
