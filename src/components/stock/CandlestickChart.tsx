import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts';

export interface CandlestickData {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  data: CandlestickData[];
  latestData: CandlestickData | null;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, latestData }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const [ohlcv, setOhlcv] = useState<{ open: number; high: number; low: number; close: number } | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: 'rgba(51, 65, 85, 0.3)' },
        horzLines: { color: 'rgba(51, 65, 85, 0.3)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight || 380,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(51, 65, 85, 0.5)',
      },
      rightPriceScale: {
        borderColor: 'rgba(51, 65, 85, 0.5)',
      },
      crosshair: {
        mode: 1,
      },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#2ECA6A',
      downColor: '#E04040',
      borderVisible: false,
      wickUpColor: '#2ECA6A',
      wickDownColor: '#E04040',
    });

    series.setData(data);
    chart.timeScale().fitContent();

    // Crosshair move → update OHLCV overlay
    chart.subscribeCrosshairMove((param) => {
      if (!param || !param.seriesData || !param.seriesData.size) {
        setOhlcv(null);
        return;
      }
      const bar = param.seriesData.get(series) as any;
      if (bar && bar.open !== undefined) {
        setOhlcv({ open: bar.open, high: bar.high, low: bar.low, close: bar.close });
      } else {
        setOhlcv(null);
      }
    });

    chartRef.current = chart;
    seriesRef.current = series;

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight || 380,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  // Live bar updates
  useEffect(() => {
    if (seriesRef.current && latestData) {
      seriesRef.current.update(latestData);
    }
  }, [latestData]);

  const fmt = (n: number) => n.toFixed(2);

  return (
    <div className="relative w-full h-full">
      {/* OHLCV Overlay — top-left, shown only on hover */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        {ohlcv ? (
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono bg-[var(--bg-secondary)] bg-opacity-90 backdrop-blur px-3 py-1.5 rounded-lg border border-[var(--border-color)]">
            <span className="text-[var(--text-secondary)]">
              O <span className="text-[var(--text-color)] font-semibold">{fmt(ohlcv.open)}</span>
            </span>
            <span className="text-[var(--text-secondary)]">
              H <span className="text-[var(--color-success)] font-semibold">{fmt(ohlcv.high)}</span>
            </span>
            <span className="text-[var(--text-secondary)]">
              L <span className="text-[var(--color-danger)] font-semibold">{fmt(ohlcv.low)}</span>
            </span>
            <span className="text-[var(--text-secondary)]">
              C <span className="text-[var(--text-color)] font-semibold">{fmt(ohlcv.close)}</span>
            </span>
          </div>
        ) : (
          <div className="text-xs text-[var(--text-secondary)] opacity-50 px-3 py-1.5">
            Hover over a candle
          </div>
        )}
      </div>

      <div ref={chartContainerRef} className="w-full h-full" />
    </div>
  );
};
