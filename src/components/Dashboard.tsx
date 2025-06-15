import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CryptoCoin, fetchCryptoCoins } from '@/services/cryptoService';
import CryptoCard from './CryptoCard';
import CoinDetailModal from './CoinDetailModal';
import LoadingSpinner from './LoadingSpinner';
import SortControls, { SortOption, SortOrder } from './SortControls';
import { useFavorites } from '@/hooks/useFavorites';
import { Search, TrendingUp, Star, Heart, ChevronDown, ChevronUp } from 'lucide-react';

const Dashboard = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('market_cap');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showFavorites, setShowFavorites] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();

  const { data: coins, isLoading, error, refetch } = useQuery({
    queryKey: ['crypto-coins'],
    queryFn: () => fetchCryptoCoins(1, 50),
    refetchInterval: 120000,
    staleTime: 60000,
  });

  const getSortedCoins = (coins: CryptoCoin[]) => {
    return [...coins].sort((a, b) => {
      let valueA: number;
      let valueB: number;

      switch (sortBy) {
        case 'market_cap':
          valueA = a.market_cap_rank;
          valueB = b.market_cap_rank;
          break;
        case 'price':
          valueA = a.current_price;
          valueB = b.current_price;
          break;
        case 'change_24h':
          valueA = a.price_change_percentage_24h;
          valueB = b.price_change_percentage_24h;
          break;
        case 'name':
          return sortOrder === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        default:
          valueA = a.market_cap_rank;
          valueB = b.market_cap_rank;
      }

      if (sortBy === 'market_cap') {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }
      
      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    });
  };

  const filteredCoins = coins?.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedAndFilteredCoins = getSortedCoins(filteredCoins);

  const handleCoinClick = (coinId: string) => {
    setSelectedCoin(coinId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoin('');
  };

  const handleSortChange = (newSortBy: SortOption, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const favoriteCoins = coins?.filter(coin => favorites.includes(coin.id)) || [];
  const favoriteCount = favorites.length;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-8">
          {/* Hero Section */}
          <div className="gradient-card p-4 md:p-8 mb-4 md:mb-8 border border-pixel-green/20 shadow-2xl">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <TrendingUp size={18} className="md:w-6 md:h-6 text-pixel-green" />
                <h1 className="font-pixel text-xl md:text-3xl bg-gradient-to-r from-pixel-green to-pixel-blue bg-clip-text text-transparent">
                  CRYPTO MARKET
                </h1>
              </div>
              <p className="font-pixel text-xs md:text-sm text-muted-foreground">
                Live prices updated every 2 minutes • Professional trading insights
              </p>
              <div className="mt-1 md:mt-2 text-[10px] md:text-xs font-pixel text-muted-foreground/70 flex items-center gap-4">
                <span>{coins?.length} coins tracked</span>
                {favoriteCount > 0 && (
                  <span className="flex items-center gap-1 text-pixel-orange">
                    <Star size={10} className="md:w-3 md:h-3 fill-current" />
                    {favoriteCount} favorites
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Favorite Coins */}
          {favoriteCoins.length > 0 && (
            <div className="mb-4 md:mb-8">
              <div className="flex items-center justify-between mb-3 md:mb-6">
                <h2 className="font-pixel text-sm md:text-xl text-pixel-orange flex items-center gap-2">
                  <Heart size={16} className="md:w-5 md:h-5 fill-current" />
                  FAVORITE COINS ({favoriteCount})
                </h2>
                <button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className="pixel-button text-pixel-orange hover:bg-pixel-orange hover:text-white"
                >
                  {showFavorites ? (
                    <ChevronUp size={12} className="md:w-4 md:h-4" />
                  ) : (
                    <ChevronDown size={12} className="md:w-4 md:h-4" />
                  )}
                  <span className="ml-1 text-[10px] md:text-xs">
                    {showFavorites ? 'HIDE' : 'SHOW'}
                  </span>
                </button>
              </div>
              
              {showFavorites && (
                <div className="space-y-2 md:space-y-3">
                  {favoriteCoins.map((coin, index) => (
                    <CryptoCard
                      key={coin.id}
                      coin={coin}
                      onClick={handleCoinClick}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={true}
                      isListView={true}
                      showHeaders={index === 0}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sort Controls for Main List */}
          <SortControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {isLoading ? (
            <LoadingSpinner />
          ) : error ? (
            <div className="text-center py-12">
              <div className="gradient-card p-4 md:p-8 max-w-md mx-auto border border-pixel-red/30">
                <div className="font-pixel text-pixel-red mb-2 md:mb-4 text-sm md:text-lg">
                  API RATE LIMIT REACHED
                </div>
                <p className="font-pixel text-[10px] md:text-xs text-muted-foreground mb-3 md:mb-6">
                  Please wait a moment before refreshing
                </p>
                <button
                  onClick={() => refetch()}
                  className="pixel-button text-pixel-blue hover:bg-pixel-blue hover:text-white"
                >
                  TRY AGAIN
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {sortedAndFilteredCoins.map((coin, index) => (
                <CryptoCard
                  key={coin.id}
                  coin={coin}
                  onClick={handleCoinClick}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={favorites.includes(coin.id)}
                  isListView={true}
                  showHeaders={index === 0}
                />
              ))}
            </div>
          )}
        </div>

        <CoinDetailModal
          coinId={selectedCoin}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Dashboard;
