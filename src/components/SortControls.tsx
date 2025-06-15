import React from "react";
import { ArrowUp, ArrowDown, Search } from "lucide-react";

export type SortOption = "market_cap" | "price" | "change_24h" | "name";
export type SortOrder = "asc" | "desc";

interface SortControlsProps {
  sortBy: SortOption;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortOption, sortOrder: SortOrder) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SortControls: React.FC<SortControlsProps> = ({
  sortBy,
  sortOrder,
  onSortChange,
  searchTerm,
  onSearchChange,
}) => {
  const sortOptions = [
    { value: "market_cap" as SortOption, label: "MARKET CAP" },
    { value: "price" as SortOption, label: "PRICE" },
    { value: "change_24h" as SortOption, label: "24H CHANGE" },
    { value: "name" as SortOption, label: "NAME" },
  ];

  const handleSortClick = (option: SortOption) => {
    if (sortBy === option) {
      onSortChange(option, sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortChange(option, "desc");
    }
  };

  return (
    <div className="gradient-card p-3 md:p-4 mb-4 md:mb-6 border border-pixel-blue/20 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-6 mb-3 md:mb-4">
        <h3 className="font-pixel text-xs md:text-sm text-pixel-blue">
          SORT BY
        </h3>

        <div className="relative md:w-80">
          <Search
            size={14}
            className="md:w-4.5 md:h-4.5 absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full font-pixel text-xs md:text-sm pl-10 md:pl-12 pr-3 md:pr-4 py-2 md:py-3 gradient-card border border-border/50 bg-transparent focus:outline-none focus:border-pixel-green/50 focus:ring-2 focus:ring-pixel-green/20 shadow-lg"
          />
        </div>
      </div>

      <div className="flex gap-1 md:gap-3 md:grid md:grid-cols-4">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSortClick(option.value)}
            className={`pixel-button flex items-center justify-center gap-1 text-center px-1 py-2 md:px-3 md:py-2 min-h-[2.5rem] md:min-h-[2.75rem] flex-1 md:flex-none ${
              sortBy === option.value
                ? "text-white bg-pixel-blue border-pixel-blue"
                : "text-pixel-blue border-pixel-blue hover:bg-pixel-blue hover:text-white"
            }`}
          >
            <span className="text-[8px] md:text-xs font-pixel leading-tight text-center flex-1">
              {option.label}
            </span>
            {sortBy === option.value && (
              <div className="flex-shrink-0">
                {sortOrder === "asc" ? (
                  <ArrowUp size={8} className="md:w-3 md:h-3" />
                ) : (
                  <ArrowDown size={8} className="md:w-3 md:h-3" />
                )}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SortControls;
