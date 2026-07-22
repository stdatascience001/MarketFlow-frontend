import type { Stock, PortfolioItem, NewsItem, MarketIndex, SectorData } from '../types';

// Deterministic "seeded" sparkline points so charts don't flicker on re-render
const SP500_CHART = [5402,5415,5408,5421,5430,5418,5427,5435,5422,5440,5438,5429,5445,5451,5443,5448,5455,5460,5458,5434].map((price,i)=>({time:i.toString(),price}));
const NASDAQ_CHART = [17620,17640,17615,17660,17680,17655,17672,17695,17670,17710,17698,17685,17715,17730,17720,17725,17740,17755,17748,17690].map((price,i)=>({time:i.toString(),price}));
const DOW_CHART   = [39320,39295,39310,39280,39260,39275,39255,39240,39265,39230,39245,39260,39235,39220,39240,39225,39210,39235,39220,39247].map((price,i)=>({time:i.toString(),price}));
const VIX_CHART   = [13.0,12.95,12.88,12.80,12.75,12.82,12.70,12.65,12.72,12.60,12.55,12.62,12.50,12.48,12.52,12.45,12.42,12.47,12.44,12.45].map((price,i)=>({time:i.toString(),price}));

export const mockIndices: MarketIndex[] = [
  { symbol: '^GSPC', name: 'S&P 500',   price: 5434.25,  change: 29.47,   changePercent: 0.53,  chartData: SP500_CHART },
  { symbol: '^IXIC', name: 'NASDAQ',    price: 17689.66, change: 98.35,   changePercent: 0.56,  chartData: NASDAQ_CHART },
  { symbol: '^DJI',  name: 'DOW JONES', price: 39247.01, change: -123.45, changePercent: -0.31, chartData: DOW_CHART },
  { symbol: '^VIX',  name: 'VIX',       price: 12.45,    change: -0.67,   changePercent: -5.11, chartData: VIX_CHART },
];

export const mockStocks: Stock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 173.5,
    change: 2.1,
    changePercent: 1.2,
    volume: 52000000,
    marketCap: 2700000000000,
    peRatio: 28.5,
    dayHigh: 174.1,
    dayLow: 170.5,
    yearHigh: 198.23,
    yearLow: 165.67,
    chartData: Array.from({ length: 30 }).map((_, i) => ({
      time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: 170 + Math.random() * 10 - 5,
    })),
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 415.5,
    change: 5.2,
    changePercent: 1.27,
    volume: 24000000,
    marketCap: 3100000000000,
    peRatio: 35.2,
    dayHigh: 416.2,
    dayLow: 410.0,
    yearHigh: 420.82,
    yearLow: 311.55,
    chartData: Array.from({ length: 30 }).map((_, i) => ({
      time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: 410 + Math.random() * 20 - 10,
    })),
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 875.28,
    change: 35.1,
    changePercent: 4.18,
    volume: 45000000,
    marketCap: 2150000000000,
    peRatio: 72.1,
    dayHigh: 880.0,
    dayLow: 850.5,
    yearHigh: 974.0,
    yearLow: 262.2,
    chartData: Array.from({ length: 30 }).map((_, i) => ({
      time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: 850 + Math.random() * 60 - 30,
    })),
  },
];

export const mockPortfolio: PortfolioItem[] = [
  {
    id: '1',
    symbol: 'AAPL',
    shares: 50,
    avgPrice: 150.0,
    currentPrice: 173.5,
    totalValue: 8675.0,
    totalReturn: 1175.0,
    totalReturnPercent: 15.67,
  },
  {
    id: '2',
    symbol: 'MSFT',
    shares: 20,
    avgPrice: 350.0,
    currentPrice: 415.5,
    totalValue: 8310.0,
    totalReturn: 1310.0,
    totalReturnPercent: 18.71,
  },
];

export const mockNews: NewsItem[] = [
  {
    id: '1',
    headline: 'Tech Stocks Surge on AI Optimism',
    source: 'Financial Times',
    url: '#',
    time: '2 hours ago',
    summary: 'Major technology companies saw significant gains today as investors continue to bet heavily on artificial intelligence advancements.',
    relatedStocks: ['MSFT', 'NVDA', 'GOOGL'],
  },
  {
    id: '2',
    headline: 'Federal Reserve Maintains Interest Rates',
    source: 'Wall Street Journal',
    url: '#',
    time: '4 hours ago',
    summary: 'The central bank decided to keep benchmark interest rates steady, citing sticky inflation and a robust labor market.',
    relatedStocks: ['^GSPC', '^DJI'],
  },
];

export const mockSectors: SectorData[] = [
  { name: 'Technology', value: 28.5, color: '#3b82f6' },
  { name: 'Healthcare', value: 15.2, color: '#10b981' },
  { name: 'Financials', value: 12.8, color: '#f59e0b' },
  { name: 'Consumer Cyclical', value: 11.5, color: '#ef4444' },
  { name: 'Industrials', value: 8.7, color: '#8b5cf6' },
  { name: 'Others', value: 23.3, color: '#6b7280' },
];

export const mockCryptoIndices: MarketIndex[] = [
  { symbol: 'TOTAL', name: 'Total Market Cap', price: 2430000000000, valueText: '$2.43T', change: 2.35, changePercent: 2.35, chartData: SP500_CHART },
  { symbol: 'VOL', name: '24h Trading Volume', price: 98450000000, valueText: '$98.45B', change: 6.72, changePercent: 6.72, chartData: NASDAQ_CHART },
  { symbol: 'BTCD', name: 'BTC Dominance', price: 58.62, valueText: '58.62%', change: 0.48, changePercent: 0.48, chartData: DOW_CHART },
  { symbol: 'FGI', name: 'Fear & Greed Index', price: 74, valueText: '74 Greed', change: 1, changePercent: 1.37, chartData: VIX_CHART },
];

export const mockCryptoStocks: Stock[] = [
  {
    symbol: 'BTC', name: 'Bitcoin', price: 118543.45, change: 2450.12, changePercent: 2.12,
    volume: 45210000000, marketCap: 2340000000000, peRatio: 0, dayHigh: 119000, dayLow: 115000, yearHigh: 119500, yearLow: 30000,
    chartData: Array.from({ length: 30 }).map((_, i) => ({ time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], price: 110000 + Math.random() * 9000 }))
  },
  {
    symbol: 'ETH', name: 'Ethereum', price: 3852.47, change: 48.15, changePercent: 1.25,
    volume: 22180000000, marketCap: 463210000000, peRatio: 0, dayHigh: 3900, dayLow: 3750, yearHigh: 4000, yearLow: 1500,
    chartData: Array.from({ length: 30 }).map((_, i) => ({ time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], price: 3500 + Math.random() * 400 }))
  },
  {
    symbol: 'SOL', name: 'Solana', price: 189.71, change: 10.42, changePercent: 5.81,
    volume: 8240000000, marketCap: 87320000000, peRatio: 0, dayHigh: 195, dayLow: 180, yearHigh: 210, yearLow: 20,
    chartData: Array.from({ length: 30 }).map((_, i) => ({ time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], price: 170 + Math.random() * 25 }))
  },
  {
    symbol: 'BNB', name: 'BNB', price: 710.32, change: 6.74, changePercent: 0.95,
    volume: 1980000000, marketCap: 103150000000, peRatio: 0, dayHigh: 715, dayLow: 700, yearHigh: 720, yearLow: 200,
    chartData: Array.from({ length: 30 }).map((_, i) => ({ time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], price: 680 + Math.random() * 40 }))
  },
  {
    symbol: 'XRP', name: 'Ripple', price: 0.6215, change: 0.004, changePercent: 0.65,
    volume: 1120000000, marketCap: 34670000000, peRatio: 0, dayHigh: 0.63, dayLow: 0.61, yearHigh: 0.8, yearLow: 0.4,
    chartData: Array.from({ length: 30 }).map((_, i) => ({ time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], price: 0.55 + Math.random() * 0.1 }))
  },
  {
    symbol: 'DOGE', name: 'Dogecoin', price: 0.1523, change: 0.005, changePercent: 3.38,
    volume: 1010000000, marketCap: 22120000000, peRatio: 0, dayHigh: 0.16, dayLow: 0.14, yearHigh: 0.2, yearLow: 0.05,
    chartData: Array.from({ length: 30 }).map((_, i) => ({ time: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], price: 0.13 + Math.random() * 0.03 }))
  },
];

export const mockCryptoNews: NewsItem[] = [
  {
    id: '1', headline: 'Bitcoin Hits New All-Time High Above $118,000', source: 'CoinDesk', url: '#', time: '2 hours ago',
    summary: 'The flagship cryptocurrency continues its massive rally as institutional adoption accelerates.', relatedStocks: ['BTC', 'ETH']
  },
  {
    id: '2', headline: 'Ethereum ETF Inflows Reach Record High', source: 'The Block', url: '#', time: '3 hours ago',
    summary: 'Investors are piling into spot ETH products following regulatory clarity.', relatedStocks: ['ETH']
  },
  {
    id: '3', headline: 'Solana Ecosystem Continues To Grow Rapidly', source: 'CoinTelegraph', url: '#', time: '5 hours ago',
    summary: 'The high-throughput blockchain is seeing unprecedented volume on its decentralized exchanges.', relatedStocks: ['SOL']
  }
];

export const mockCryptoSectors: SectorData[] = [
  { name: 'Layer 1', value: 65.5, color: '#f59e0b' },
  { name: 'DeFi', value: 12.2, color: '#3b82f6' },
  { name: 'Stablecoins', value: 10.8, color: '#10b981' },
  { name: 'Memes', value: 6.5, color: '#ef4444' },
  { name: 'Gaming', value: 5.0, color: '#8b5cf6' },
];
