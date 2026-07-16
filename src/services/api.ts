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
      await delay(700);
      return mockPortfolio;
    }
  },
  news: {
    getLatestNews: async (): Promise<NewsItem[]> => {
      await delay(500);
      return mockNews;
    }
  }
};
