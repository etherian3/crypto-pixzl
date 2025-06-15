
import React, { useEffect, useState } from 'react';
import { X, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { CoinDetail, PriceHistory, fetchCoinDetail, fetchPriceHistory } from '@/services/cryptoService';
import PriceChart from './PriceChart';

interface CoinDetailModalProps {
  coinId: string;
  isOpen: boolean;
  onClose: () => void;
}

const CoinDetailModal: React.FC<CoinDetailModalProps> = ({ coinId, isOpen, onClose }) => {
  const [coinDetail, setCoinDetail] = useState<CoinDetail | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [rateLimitError, setRateLimitError] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);

  const handleRateLimitError = () => {
    setRateLimitError(true);
    setRetryCountdown(60); // Start with 60 seconds countdown
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setRateLimitError(false);
      
      const [detail, history] = await Promise.all([
        fetchCoinDetail(coinId),
        fetchPriceHistory(coinId, 7)
      ]);
      
      setCoinDetail(detail);
      setPriceHistory(history);
    } catch (error: any) {
      console.error('Error fetching coin details:', error);
      
      // Check if it's a rate limit error (status 429)
      if (error.message?.includes('429') || error.message?.includes('rate limit')) {
        handleRateLimitError();
      }
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (retryCountdown > 0) {
      const timer = setTimeout(() => {
        setRetryCountdown(retryCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (retryCountdown === 0 && rateLimitError) {
      // Retry fetching data when countdown reaches 0
      setRateLimitError(false);
      fetchData();
    }
  }, [retryCountdown, rateLimitError]);

  useEffect(() => {
    if (isOpen && coinId) {
      fetchData();
    }
  }, [coinId, isOpen]);

  if (!isOpen) return null;

  const isPositive = coinDetail?.market_data.price_change_percentage_24h > 0;
  const priceColor = isPositive ? 'text-pixel-green' : 'text-pixel-red';

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-2 md:p-4 z-50">
      <div className="pixel-card bg-card w-full max-w-6xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h2 className="font-pixel text-sm md:text-lg text-pixel-green">COIN DETAILS</h2>
          <button
            onClick={onClose}
            className="pixel-button text-pixel-red hover:bg-pixel-red hover:text-background"
          >
            <X size={16} />
          </button>
        </div>

        {loading || rateLimitError ? (
          <div className="text-center py-8">
            {rateLimitError ? (
              <div className="gradient-card p-4 md:p-8 max-w-md mx-auto border border-pixel-orange/30">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Clock size={16} className="text-pixel-orange" />
                  <div className="font-pixel text-pixel-orange text-sm md:text-lg">
                    API RATE LIMIT
                  </div>
                </div>
                <p className="font-pixel text-[10px] md:text-xs text-muted-foreground mb-4">
                  Too many requests. Retrying automatically in:
                </p>
                <div className="font-pixel text-2xl md:text-3xl text-pixel-blue mb-2">
                  {Math.floor(retryCountdown / 60)}:{(retryCountdown % 60).toString().padStart(2, '0')}
                </div>
                <p className="font-pixel text-[10px] md:text-xs text-muted-foreground">
                  Please wait while we retry your request
                </p>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="bg-pixel-orange h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${((60 - retryCountdown) / 60) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="font-pixel text-pixel-blue animate-pixel-pulse">
                LOADING...
              </div>
            )}
          </div>
        ) : coinDetail ? (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
              <img 
                src={coinDetail.image.large} 
                alt={coinDetail.name}
                className="w-12 h-12 md:w-16 md:h-16 pixelated"
              />
              <div>
                <h1 className="font-pixel text-lg md:text-xl text-foreground">{coinDetail.name}</h1>
                <p className="font-pixel text-xs md:text-sm text-muted-foreground uppercase">
                  {coinDetail.symbol}
                </p>
                <p className="font-pixel text-xs text-pixel-yellow">
                  RANK #{coinDetail.market_cap_rank}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-4 order-2 lg:order-1">
                <div className="pixel-card bg-accent">
                  <h3 className="font-pixel text-xs md:text-sm text-pixel-blue mb-2 md:mb-3">PRICE INFO</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-pixel text-[10px] md:text-xs text-muted-foreground">CURRENT</span>
                      <span className="font-pixel text-xs md:text-sm text-foreground break-all">
                        ${coinDetail.market_data.current_price.usd.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-pixel text-[10px] md:text-xs text-muted-foreground">24H CHANGE</span>
                      <div className={`flex items-center gap-1 ${priceColor}`}>
                        {isPositive ? <TrendingUp size={10} className="md:w-3 md:h-3" /> : <TrendingDown size={10} className="md:w-3 md:h-3" />}
                        <span className="font-pixel text-[10px] md:text-xs">
                          {coinDetail.market_data.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-pixel text-[10px] md:text-xs text-muted-foreground">24H HIGH</span>
                      <span className="font-pixel text-[10px] md:text-xs text-pixel-green break-all">
                        ${coinDetail.market_data.high_24h.usd.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-pixel text-[10px] md:text-xs text-muted-foreground">24H LOW</span>
                      <span className="font-pixel text-[10px] md:text-xs text-pixel-red break-all">
                        ${coinDetail.market_data.low_24h.usd.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pixel-card bg-accent">
                  <h3 className="font-pixel text-xs md:text-sm text-pixel-purple mb-2 md:mb-3">MARKET DATA</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-pixel text-[10px] md:text-xs text-muted-foreground">MARKET CAP</span>
                      <span className="font-pixel text-[10px] md:text-xs text-foreground break-all">
                        ${coinDetail.market_data.market_cap.usd.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-pixel text-[10px] md:text-xs text-muted-foreground">VOLUME 24H</span>
                      <span className="font-pixel text-[10px] md:text-xs text-foreground break-all">
                        ${coinDetail.market_data.total_volume.usd.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-pixel text-[10px] md:text-xs text-muted-foreground">SUPPLY</span>
                      <span className="font-pixel text-[10px] md:text-xs text-foreground break-all">
                        {coinDetail.market_data.circulating_supply?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-pixel text-[10px] md:text-xs text-muted-foreground">MAX SUPPLY</span>
                      <span className="font-pixel text-[10px] md:text-xs text-foreground break-all">
                        {coinDetail.market_data.max_supply?.toLocaleString() || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                {priceHistory && (
                  <PriceChart data={priceHistory} coinName={coinDetail.name} />
                )}
              </div>
            </div>

            {/* Description */}
            {coinDetail.description.en && (
              <div className="pixel-card bg-accent">
                <h3 className="font-pixel text-xs md:text-sm text-pixel-orange mb-2 md:mb-3">DESCRIPTION</h3>
                <div 
                  className="font-pixel text-[10px] md:text-xs text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ 
                    __html: coinDetail.description.en.split('.')[0] + '.' 
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="font-pixel text-pixel-red">
              ERROR LOADING COIN DATA
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinDetailModal;
