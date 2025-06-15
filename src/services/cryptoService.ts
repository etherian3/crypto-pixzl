
const BASE_URL = 'https://api.coingecko.com/api/v3';

export interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any;
  last_updated: string;
}

export interface CoinDetail {
  id: string;
  symbol: string;
  name: string;
  description: {
    en: string;
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  market_cap_rank: number;
  market_data: {
    current_price: {
      usd: number;
    };
    market_cap: {
      usd: number;
    };
    total_volume: {
      usd: number;
    };
    high_24h: {
      usd: number;
    };
    low_24h: {
      usd: number;
    };
    price_change_24h: number;
    price_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
  };
}

export interface PriceHistory {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export const fetchCryptoCoins = async (page = 1, perPage = 50): Promise<CryptoCoin[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false`
    );
    
    if (response.status === 429) {
      throw new Error('API rate limit reached - 429');
    }
    
    if (!response.ok) throw new Error('Failed to fetch crypto data');
    return await response.json();
  } catch (error) {
    console.error('Error fetching crypto coins:', error);
    throw error;
  }
};

export const fetchCoinDetail = async (coinId: string): Promise<CoinDetail> => {
  try {
    const response = await fetch(`${BASE_URL}/coins/${coinId}`);
    
    if (response.status === 429) {
      throw new Error('API rate limit reached - 429');
    }
    
    if (!response.ok) throw new Error('Failed to fetch coin detail');
    return await response.json();
  } catch (error) {
    console.error('Error fetching coin detail:', error);
    throw error;
  }
};

export const fetchPriceHistory = async (
  coinId: string, 
  days = 7
): Promise<PriceHistory> => {
  try {
    const response = await fetch(
      `${BASE_URL}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
    );
    
    if (response.status === 429) {
      throw new Error('API rate limit reached - 429');
    }
    
    if (!response.ok) throw new Error('Failed to fetch price history');
    return await response.json();
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw error;
  }
};
