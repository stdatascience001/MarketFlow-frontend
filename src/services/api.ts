import { mockStocks, mockIndices, mockNews, mockPortfolio, mockSectors } from './mockData';
import type { Stock, MarketIndex, NewsItem, PortfolioItem, SectorData } from '../types';

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  market: {
    getIndices: async (): Promise<MarketIndex[]> => {
      await delay(500);
      return mockIndices;
    },
    getTopGainers: async (): Promise<Stock[]> => {
      await delay(600);
      return [...mockStocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
    },
    getTopLosers: async (): Promise<Stock[]> => {
      await delay(600);
      return [...mockStocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
    },
    getMostActive: async (): Promise<Stock[]> => {
      await delay(400);
      return [...mockStocks].sort((a, b) => b.volume - a.volume).slice(0, 5);
    },
    getSectors: async (): Promise<SectorData[]> => {
      await delay(400);
      return mockSectors;
    },
    getStockBySymbol: async (symbol: string): Promise<Stock | undefined> => {
      await delay(400);
      return mockStocks.find((s) => s.symbol.toUpperCase() === symbol.toUpperCase());
    },
    searchStocks: async (query: string): Promise<Stock[]> => {
      await delay(300);
      if (!query) return [];
      const lowerQuery = query.toLowerCase();
      return mockStocks.filter(
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
    getLatestNews: async (): Promise<NewsItem[]> => {
      await delay(500);
      return mockNews;
    }
  }
};
