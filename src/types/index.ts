export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
  dayHigh: number;
  dayLow: number;
  yearHigh: number;
  yearLow: number;
  chartData?: ChartDataPoint[];
}

export interface ChartDataPoint {
  time: string;
  price: number;
}

export interface PortfolioItem {
  id: string;
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  totalValue: number;
  totalReturn: number;
  totalReturnPercent: number;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  url: string;
  time: string;
  summary: string;
  relatedStocks: string[];
}

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  chartData?: ChartDataPoint[];
}

export interface SectorData {
  name: string;
  value: number;
  color: string;
}
