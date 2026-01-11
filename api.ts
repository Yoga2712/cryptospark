import axios from 'axios';
import { CoinMarket, CoinDetail, MarketChartData } from '../types';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';
const CACHE_PREFIX = 'cryptospark_cache_v1_';
const CACHE_TTL = 120 * 1000; // 2 minutes valid cache

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache Helpers
const getCacheKey = (endpoint: string, params: any) => {
  // Create a unique key based on endpoint and sorted params
  const paramsKey = params ? JSON.stringify(Object.keys(params).sort().reduce((obj: any, key) => {
    obj[key] = params[key];
    return obj;
  }, {})) : '';
  return `${CACHE_PREFIX}${endpoint}_${paramsKey}`;
};

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const getFromCache = <T>(key: string): T | null => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;
  
  try {
    const item: CacheEntry<T> = JSON.parse(itemStr);
    const now = Date.now();
    // Check if cache is still valid
    if (now - item.timestamp < CACHE_TTL) {
      return item.data;
    }
    return null; // Expired
  } catch (e) {
    localStorage.removeItem(key);
    return null;
  }
};

const getStaleFromCache = <T>(key: string): T | null => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;
  try {
    const item: CacheEntry<T> = JSON.parse(itemStr);
    return item.data;
  } catch {
    return null;
  }
}

const setToCache = <T>(key: string, data: T) => {
  try {
    const item: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (e) {
    // If quota exceeded, clear old cache
    console.warn('Storage quota exceeded, clearing cache...');
    localStorage.clear();
  }
};

// Generic Fetcher with Caching and Error Handling
const fetchData = async <T>(endpoint: string, params: any = {}): Promise<T> => {
  const cacheKey = getCacheKey(endpoint, params);
  
  // 1. Try to get valid cache first
  const cachedData = getFromCache<T>(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // 2. Fetch from API
    const response = await apiClient.get<T>(endpoint, { params });
    setToCache(cacheKey, response.data);
    return response.data;
  } catch (error: any) {
    // 3. If API fails (Rate Limit or Network), try to return STALE cache
    const staleData = getStaleFromCache<T>(cacheKey);
    if (staleData) {
      console.warn(`[API] Serving stale data for ${endpoint} due to error:`, error.message);
      return staleData;
    }

    // 4. If no cache, throw meaningful error
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error("API Rate Limit Exceeded. Please wait a minute before retrying.");
      }
      if (error.code === 'ERR_NETWORK') {
        throw new Error("Network Error. Please check your internet connection.");
      }
    }
    
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

// Exported API Methods
export const getCoinsMarkets = () => fetchData<CoinMarket[]>('/coins/markets', {
  vs_currency: 'usd',
  order: 'market_cap_desc',
  per_page: 50,
  page: 1,
  sparkline: false,
});

export const getCoinDetails = (id: string) => fetchData<CoinDetail>(`/coins/${id}`, {
  localization: false,
  tickers: false,
  market_data: true,
  community_data: false,
  developer_data: false,
  sparkline: false,
});

export const getCoinMarketChart = (id: string, days: number) => fetchData<MarketChartData>(`/coins/${id}/market_chart`, {
  vs_currency: 'usd',
  days: days,
});
