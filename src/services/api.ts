import { mockStocks, mockIndices, mockNews, mockPortfolio, mockSectors, mockCryptoIndices, mockCryptoStocks, mockCryptoNews, mockCryptoSectors } from './mockData';
import type { Stock, MarketIndex, NewsItem, PortfolioItem, SectorData } from '../types';

export type MarketType = 'stocks' | 'crypto';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  market: {
    getIndices: async (marketType: MarketType = 'stocks'): Promise<MarketIndex[]> => {
      await delay(500);
      return marketType === 'crypto' ? mockCryptoIndices : mockIndices;
    },
    getTopGainers: async (marketType: MarketType = 'stocks'): Promise<Stock[]> => {
      await delay(600);
      const stocks = marketType === 'crypto' ? mockCryptoStocks : mockStocks;
      return [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
    },
    getTopLosers: async (marketType: MarketType = 'stocks'): Promise<Stock[]> => {
      await delay(600);
      const stocks = marketType === 'crypto' ? mockCryptoStocks : mockStocks;
      return [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
    },
    getMostActive: async (marketType: MarketType = 'stocks'): Promise<Stock[]> => {
      await delay(400);
      const stocks = marketType === 'crypto' ? mockCryptoStocks : mockStocks;
      return [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 5);
    },
    getSectors: async (marketType: MarketType = 'stocks'): Promise<SectorData[]> => {
      await delay(400);
      return marketType === 'crypto' ? mockCryptoSectors : mockSectors;
    },
    getStockBySymbol: async (symbol: string, marketType: MarketType = 'stocks'): Promise<Stock | undefined> => {
      await delay(400);
      const stocks = marketType === 'crypto' ? mockCryptoStocks : mockStocks;
      return stocks.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase());
    },
    searchStocks: async (query: string, marketType: MarketType = 'stocks'): Promise<Stock[]> => {
      await delay(300);
      if (!query) return [];
      const lowerQuery = query.toLowerCase();
      const stocks = marketType === 'crypto' ? mockCryptoStocks : mockStocks;
      return stocks.filter(
        (s) => s.symbol.toLowerCase().includes(lowerQuery) || s.name.toLowerCase().includes(lowerQuery)
      );
    }
  },
  portfolio: {
    getPortfolio: async (): Promise<PortfolioItem[]> => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/portfolio/`);
      if (!res.ok) throw new Error('Failed to fetch portfolio');
      return res.json();
    },
    addPosition: async (symbol: string, quantity: number, avg_price: number): Promise<any> => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/portfolio/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, quantity, avg_price })
      });
      if (!res.ok) throw new Error('Failed to add position');
      return res.json();
    },
    removePosition: async (symbol: string): Promise<any> => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/portfolio/${symbol}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to remove position');
      return res.json();
    }
  },
  watchlist: {
    getWatchlist: async (): Promise<any[]> => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/watchlist/`);
      if (!res.ok) throw new Error('Failed to fetch watchlist');
      return res.json();
    },
    addWatchlistItem: async (symbol: string): Promise<any> => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/watchlist/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol })
      });
      if (!res.ok) throw new Error('Failed to add watchlist item');
      return res.json();
    },
    removeWatchlistItem: async (symbol: string): Promise<any> => {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/watchlist/${symbol}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to remove watchlist item');
      return res.json();
    }
  },
  news: {
    getLatestNews: async (marketType: MarketType = 'stocks'): Promise<NewsItem[]> => {
      await delay(500);
      return marketType === 'crypto' ? mockCryptoNews : mockNews;
    }
  }
};
