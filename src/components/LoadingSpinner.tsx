
import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-pixel-green border-t-transparent animate-spin mb-4 mx-auto pixel-border"></div>
        <p className="font-pixel text-sm text-pixel-green animate-pixel-pulse">
          LOADING CRYPTO DATA...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
