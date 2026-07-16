import type { Stock, PortfolioItem, NewsItem, MarketIndex, SectorData } from '../types';

export const mockIndices: MarketIndex[] = [
  { 
    symbol: '^GSPC', name: 'S&P 500', price: 5434.25, change: 29.47, changePercent: 0.53,
    chartData: Array.from({ length: 20 }).map((_, i) => ({ time: i.toString(), price: 5400 + Math.random() * 50 + i * 2 }))
  },
  { 
    symbol: '^IXIC', name: 'NASDAQ', price: 17689.66, change: 98.35, changePercent: 0.56,
    chartData: Array.from({ length: 20 }).map((_, i) => ({ time: i.toString(), price: 17600 + Math.random() * 100 + i * 5 }))
  },
  { 
    symbol: '^DJI', name: 'DOW JONES', price: 39247.01, change: -123.45, changePercent: -0.31,
    chartData: Array.from({ length: 20 }).map((_, i) => ({ time: i.toString(), price: 39300 - Math.random() * 100 - i * 5 }))
  },
  { 
    symbol: '^VIX', name: 'VIX', price: 12.45, change: -0.67, changePercent: -5.11,
    chartData: Array.from({ length: 20 }).map((_, i) => ({ time: i.toString(), price: 13 - Math.random() * 1 - i * 0.05 }))
  },
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
