import { create } from 'zustand';
import type { Stock, MarketIndex, NewsItem, SectorData } from '../types';
import { api } from '../services/api';

interface MarketState {
  indices: MarketIndex[];
  topGainers: Stock[];
  topLosers: Stock[];
  mostActive: Stock[];
  sectors: SectorData[];
  news: NewsItem[];
  isLoading: boolean;
  error: string | null;
  fetchMarketData: () => Promise<void>;
  updateStockPrice: (symbol: string, newPrice: number) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  indices: [],
  topGainers: [],
  topLosers: [],
  mostActive: [],
  sectors: [],
  news: [],
  isLoading: false,
  error: null,
  fetchMarketData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [indices, topGainers, topLosers, mostActive, sectors, news] = await Promise.all([
        api.market.getIndices(),
        api.market.getTopGainers(),
        api.market.getTopLosers(),
        api.market.getMostActive(),
        api.market.getSectors(),
        api.news.getLatestNews(),
      ]);
      set({ indices, topGainers, topLosers, mostActive, sectors, news, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch market data', isLoading: false });
    }
  },
  updateStockPrice: (symbol, newPrice) => {
    set((state) => {
      // Update topGainers if the stock is there
      const topGainers = state.topGainers.map((stock) =>
        stock.symbol === symbol ? { ...stock, price: newPrice } : stock
      );
      
      // Update topLosers if the stock is there
      const topLosers = state.topLosers.map((stock) =>
        stock.symbol === symbol ? { ...stock, price: newPrice } : stock
      );

      // Update indices if the symbol matches an index
      const indices = state.indices.map((index) => 
        index.symbol === symbol ? { ...index, price: newPrice } : index
      );

      // Update mostActive if the stock is there
      const mostActive = state.mostActive.map((stock) =>
        stock.symbol === symbol ? { ...stock, price: newPrice } : stock
      );

      return { topGainers, topLosers, mostActive, indices };
    });
  },
}));
