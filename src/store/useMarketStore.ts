import { create } from 'zustand';
import type { Stock, MarketIndex, NewsItem } from '../types';
import { api } from '../services/api';

interface MarketState {
  indices: MarketIndex[];
  topGainers: Stock[];
  topLosers: Stock[];
  news: NewsItem[];
  isLoading: boolean;
  error: string | null;
  fetchMarketData: () => Promise<void>;
}

export const useMarketStore = create<MarketState>((set) => ({
  indices: [],
  topGainers: [],
  topLosers: [],
  news: [],
  isLoading: false,
  error: null,
  fetchMarketData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [indices, topGainers, topLosers, news] = await Promise.all([
        api.market.getIndices(),
        api.market.getTopGainers(),
        api.market.getTopLosers(),
        api.news.getLatestNews(),
      ]);
      set({ indices, topGainers, topLosers, news, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch market data', isLoading: false });
    }
  },
}));
