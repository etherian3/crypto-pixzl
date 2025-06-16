import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { TrendingUp } from "lucide-react";
import { Github } from "lucide-react";

const Header = () => {
  const { theme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 gradient-card backdrop-blur-md">
      <div className="container mx-auto px-2 md:px-4 py-2 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 professional-gradient border border-pixel-green/30 flex items-center justify-center rounded-sm shadow-lg">
              <TrendingUp size={16} className="md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm md:text-xl font-pixel text-pixel-green animate-gradient-shift bg-gradient-to-r from-pixel-green to-pixel-blue bg-clip-text text-transparent">
                CRYPTO PIXZL
              </h1>
              <p className="text-[8px] md:text-xs font-pixel text-muted-foreground opacity-70 hidden md:block">
                Professional Market Tracker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-0.5 text-muted-foreground text-[8px] md:text-xs font-pixel opacity-60">
            <span className="whitespace-nowrap">
              <a
                href="https://github.com/etherian3"
                className="hover:text-pixel-green transition-colors"
              >
                Developed by @etherian3
              </a>
            </span>
            <a
              href="https://github.com/etherian3/crypto-pixzl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pixel-green transition-colors flex-shrink-0"
            >
              <Github size={12} className="md:w-4 md:h-4" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
