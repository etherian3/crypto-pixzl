import React from 'react';
import { CryptoCoin } from '@/services/cryptoService';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';

interface CryptoCardProps {
  coin: CryptoCoin;
  onClick: (coinId: string) => void;
  onToggleFavorite: (coinId: string) => void;
  isFavorite: boolean;
  isListView?: boolean;
  showHeaders?: boolean;
}

const CryptoCard: React.FC<CryptoCardProps> = ({ coin, onClick, onToggleFavorite, isFavorite, isListView = false, showHeaders = false }) => {
  const isPositive = coin.price_change_percentage_24h > 0;
  const priceColor = isPositive ? 'text-pixel-green' : 'text-pixel-red';
  
  if (isListView) {
    return (
      <>
        {/* Headers - only shown for the first card and only on desktop */}
        {showHeaders && (
          <div className="hidden md:block mb-2">
            <div className="grid grid-cols-12 gap-2 md:gap-4 items-center px-2 sm:px-3 md:px-4 py-2">
              {/* Rank Header */}
              <div className="col-span-1 text-center">
                <span className="font-pixel text-[8px] md:text-xs text-muted-foreground uppercase">#</span>
              </div>

              {/* Name Header */}
              <div className="col-span-3">
                <span className="font-pixel text-[8px] md:text-xs text-muted-foreground uppercase">NAME</span>
              </div>
              
              {/* Price Header */}
              <div className="col-span-2 text-left">
                <span className="font-pixel text-[8px] md:text-xs text-muted-foreground uppercase">PRICE</span>
              </div>
              
              {/* 24H Change Header - moved further to the right */}
              <div className="col-span-2 text-right">
                <span className="font-pixel text-[8px] md:text-xs text-muted-foreground uppercase">24H %</span>
              </div>
              
              {/* Market Cap Header - moved further right */}
              <div className="col-span-3 text-right">
                <span className="font-pixel text-[8px] md:text-xs text-muted-foreground uppercase">MARKET CAP</span>
              </div>

              {/* Favorite Header - empty space */}
              <div className="col-span-1">
              </div>
            </div>
          </div>
        )}

        <div 
          className="gradient-card hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:border-pixel-green/50 group border border-border/30 shadow-lg p-3 md:p-4 relative"
          onClick={() => onClick(coin.id)}
        >
          {/* Mobile Layout (< 768px) */}
          <div className="block md:hidden">
            <div className="flex items-center justify-between mb-3">
              {/* Left side - Coin info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative flex-shrink-0">
                  <img 
                    src={coin.image} 
                    alt={coin.name}
                    className="w-8 h-8 rounded-full shadow-md"
                  />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-pixel-green/20 rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-pixel text-xs text-foreground group-hover:text-pixel-green transition-colors duration-200 truncate mb-1">
                    {coin.name}
                  </h3>
                  <p className="font-pixel text-[10px] text-muted-foreground uppercase">
                    {coin.symbol}
                  </p>
                </div>
              </div>
              
              {/* Right side - Rank and Favorite */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="font-pixel text-[8px] text-pixel-purple bg-pixel-purple/10 px-2 py-1 rounded-sm">
                  #{coin.market_cap_rank}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(coin.id);
                  }}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isFavorite 
                      ? 'text-pixel-orange bg-pixel-orange/10' 
                      : 'text-muted-foreground hover:text-pixel-orange hover:bg-pixel-orange/10'
                  }`}
                >
                  <Star size={12} className={`${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
            
            {/* Price and Change Row */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-pixel text-xs text-foreground font-bold mb-1">
                  ${coin.current_price.toLocaleString()}
                </div>
                <div className="font-pixel text-[9px] text-muted-foreground">
                  ${(coin.market_cap / 1000000000).toFixed(2)}B cap
                </div>
              </div>
              
              <div className={`flex items-center gap-1 ${priceColor}`}>
                {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span className="font-pixel text-xs font-bold">
                  {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className={`w-full h-1 rounded-full ${
              isPositive ? 'bg-gradient-to-r from-transparent to-pixel-green' : 
              'bg-gradient-to-r from-transparent to-pixel-red'
            }`}></div>
          </div>

          {/* Tablet and Desktop Layout (>= 768px) */}
          <div className="hidden md:block">
            <div className="grid grid-cols-12 gap-4 md:gap-6 items-center">
              {/* Rank */}
              <div className="col-span-1 text-center">
                <div className="font-pixel text-[8px] md:text-xs text-pixel-purple bg-pixel-purple/10 px-1 md:px-2 py-0.5 md:py-1 rounded-sm">
                  #{coin.market_cap_rank}
                </div>
              </div>

              {/* Coin Info */}
              <div className="col-span-3 flex items-center gap-2 md:gap-3">
                <div className="relative">
                  <img 
                    src={coin.image} 
                    alt={coin.name}
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full shadow-md"
                  />
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 md:w-2 md:h-2 bg-pixel-green/20 rounded-full animate-pulse"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-pixel text-[10px] md:text-sm text-foreground group-hover:text-pixel-green transition-colors duration-200 truncate">
                    {coin.name}
                  </h3>
                  <p className="font-pixel text-[8px] md:text-xs text-muted-foreground uppercase">
                    {coin.symbol}
                  </p>
                </div>
              </div>
              
              {/* Price */}
              <div className="col-span-2 text-left">
                <span className="font-pixel text-[10px] md:text-sm text-foreground font-bold">
                  ${coin.current_price.toLocaleString()}
                </span>
              </div>
              
              {/* 24H Change - moved further to the right with right alignment */}
              <div className="col-span-2 text-right">
                <div className={`flex items-center justify-end gap-1 ${priceColor}`}>
                  {isPositive ? <TrendingUp size={8} className="md:w-3 md:h-3" /> : <TrendingDown size={8} className="md:w-3 md:h-3" />}
                  <span className="font-pixel text-[10px] md:text-sm font-bold">
                    {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                  </span>
                </div>
              </div>
              
              {/* Market Cap - moved further right and right-aligned */}
              <div className="col-span-3 text-right">
                <span className="font-pixel text-[8px] md:text-xs text-foreground">
                  ${(coin.market_cap / 1000000000).toFixed(2)}B
                </span>
              </div>

              {/* Favorite Button - moved to the right */}
              <div className="col-span-1 flex justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(coin.id);
                  }}
                  className={`p-1 rounded-full transition-all duration-200 z-10 ${
                    isFavorite 
                      ? 'text-pixel-orange bg-pixel-orange/10' 
                      : 'text-muted-foreground hover:text-pixel-orange hover:bg-pixel-orange/10'
                  }`}
                >
                  <Star size={10} className={`md:w-4 md:h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Grid view (original card design) - keep existing code
  return (
    <div 
      className="gradient-card hover:shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:border-pixel-green/50 group border border-border/30 shadow-lg p-3 md:p-6 relative"
      onClick={() => onClick(coin.id)}
    >
      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(coin.id);
        }}
        className={`absolute top-2 right-2 md:top-3 md:right-3 p-1 rounded-full transition-all duration-200 ${
          isFavorite 
            ? 'text-pixel-orange bg-pixel-orange/10' 
            : 'text-muted-foreground hover:text-pixel-orange hover:bg-pixel-orange/10'
        }`}
      >
        <Star size={12} className={`md:w-4 md:h-4 ${isFavorite ? 'fill-current' : ''}`} />
      </button>

      <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-6">
        <div className="relative">
          <img 
            src={coin.image} 
            alt={coin.name}
            className="w-8 h-8 md:w-12 md:h-12 rounded-full shadow-md"
          />
          <div className="absolute -top-1 -right-1 w-2 h-2 md:w-4 md:h-4 bg-pixel-green/20 rounded-full animate-pulse"></div>
        </div>
        <div className="flex-1">
          <h3 className="font-pixel text-xs md:text-sm text-foreground group-hover:text-pixel-green transition-colors duration-200 mb-1">
            {coin.name}
          </h3>
          <p className="font-pixel text-[10px] md:text-xs text-muted-foreground uppercase">
            {coin.symbol}
          </p>
        </div>
        <div className="text-right">
          <div className="font-pixel text-[8px] md:text-xs text-pixel-purple bg-pixel-purple/10 px-1 md:px-2 py-0.5 md:py-1 rounded-sm">
            #{coin.market_cap_rank}
          </div>
        </div>
      </div>
      
      <div className="space-y-2 md:space-y-4">
        <div className="flex justify-between items-center py-1 md:py-2">
          <span className="font-pixel text-[10px] md:text-xs text-muted-foreground">PRICE</span>
          <span className="font-pixel text-xs md:text-sm text-foreground font-bold">
            ${coin.current_price.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center py-1 md:py-2">
          <span className="font-pixel text-[10px] md:text-xs text-muted-foreground">24H CHANGE</span>
          <div className={`flex items-center gap-1 md:gap-2 ${priceColor}`}>
            {isPositive ? <TrendingUp size={10} className="md:w-3.5 md:h-3.5" /> : <TrendingDown size={10} className="md:w-3.5 md:h-3.5" />}
            <span className="font-pixel text-xs md:text-sm font-bold">
              {isPositive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center py-1 md:py-2">
          <span className="font-pixel text-[10px] md:text-xs text-muted-foreground">MARKET CAP</span>
          <span className="font-pixel text-[10px] md:text-xs text-foreground">
            ${(coin.market_cap / 1000000000).toFixed(2)}B
          </span>
        </div>

        <div className="pt-2 md:pt-3 border-t border-border/30">
          <div className={`w-full h-1 md:h-2 rounded-full bg-muted ${
            isPositive ? 'bg-gradient-to-r from-transparent to-pixel-green' : 
            'bg-gradient-to-r from-transparent to-pixel-red'
          }`}></div>
        </div>
      </div>
    </div>
  );
};

export default CryptoCard;
