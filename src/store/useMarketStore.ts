import { create } from 'zustand';
import type { Stock, MarketIndex, NewsItem, SectorData } from '../types';
import { api } from '../services/api';
import type { MarketType } from '../services/api';
import { getMarketStatus } from '../utils/marketHours';
import type { MarketStatus } from '../utils/marketHours';

interface MarketState {
  marketType: MarketType;
  setMarketType: (type: MarketType) => void;
  indices: MarketIndex[];
  topGainers: Stock[];
  topLosers: Stock[];
  mostActive: Stock[];
  sectors: SectorData[];
  news: NewsItem[];
  isLoading: boolean;
  error: string | null;
  marketStatus: MarketStatus;
  fetchMarketData: () => Promise<void>;
  updateStockPrice: (symbol: string, newPrice: number) => void;
  refreshMarketStatus: () => void;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  marketType: 'stocks',
  setMarketType: (type) => {
    set({ marketType: type });
    get().fetchMarketData();
  },
  indices: [],
  topGainers: [],
  topLosers: [],
  mostActive: [],
  sectors: [],
  news: [],
  isLoading: false,
  error: null,
  marketStatus: getMarketStatus(),
  fetchMarketData: async () => {
    set({ isLoading: true, error: null });
    const currentMarketType = get().marketType;
    try {
      const [indices, topGainers, topLosers, mostActive, sectors, news] = await Promise.all([
        api.market.getIndices(currentMarketType),
        api.market.getTopGainers(currentMarketType),
        api.market.getTopLosers(currentMarketType),
        api.market.getMostActive(currentMarketType),
        api.market.getSectors(currentMarketType),
        api.news.getLatestNews(currentMarketType),
      ]);
      set({ indices, topGainers, topLosers, mostActive, sectors, news, isLoading: false, marketStatus: getMarketStatus() });
    } catch (error) {
      set({ error: 'Failed to fetch market data', isLoading: false });
    }
  },
  refreshMarketStatus: () => {
    set({ marketStatus: getMarketStatus() });
  },
  updateStockPrice: (symbol, newPrice) => {
    set((state) => {
      // Only update prices when market is open or if it's crypto (always open)
      if (state.marketType === 'stocks' && !state.marketStatus.isOpen) return {};

      const updateStock = (stock: Stock): Stock =>
        stock.symbol === symbol ? { ...stock, price: newPrice } : stock;

      const updateIndex = (index: MarketIndex): MarketIndex =>
        index.symbol === symbol ? { ...index, price: newPrice } : index;

      return {
        topGainers: state.topGainers.map(updateStock),
        topLosers:  state.topLosers.map(updateStock),
        mostActive: state.mostActive.map(updateStock),
        indices:    state.indices.map(updateIndex),
      };
    });
  },
}));
