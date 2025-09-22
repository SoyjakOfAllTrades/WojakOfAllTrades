import { Shuffle, X } from 'lucide-react';
import type React from 'react';
import type { WojakCharacter } from '../types/wojak';
import { CategoryTabs } from './CategoryTabs';
import { EnhancedPartSelector } from './EnhancedPartSelector';

interface WojakControlsProps {
  wojak: WojakCharacter;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onWojakUpdate: (updates: Partial<WojakCharacter>) => void;
  onRandomize: () => void;
  onClearAll: () => void;
}

export const WojakControls: React.FC<WojakControlsProps> = ({
  wojak,
  selectedCategory,
  onCategoryChange,
  onWojakUpdate,
  onRandomize,
  onClearAll,
}) => {
  return (
    <div className="wojak-card flex h-full flex-col p-4">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-stonks-green/40 bg-gradient-to-br from-stonks-darker/95 via-stonks-gray/90 to-stonks-darker/95 p-6 shadow-2xl backdrop-blur-sm">
        {/* Subtle pattern overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-stonks-green/5 via-transparent to-stonks-accent/5"></div>

        <h3 className="stonks-text relative z-10 mb-4 flex-shrink-0 font-bold font-orbitron text-xl">
          CUSTOMIZE YOUR WOJAK
        </h3>

        <div className="relative z-10 flex-shrink-0">
          <CategoryTabs selectedCategory={selectedCategory} onCategoryChange={onCategoryChange} />
        </div>

        <div className="relative z-10 mt-4 min-h-0 flex-1">
          <EnhancedPartSelector
            wojak={wojak}
            category={selectedCategory}
            onWojakUpdate={onWojakUpdate}
          />
        </div>

        {/* Randomize and Clear All buttons */}
        <div className="relative z-10 mt-6 flex-shrink-0 border-stonks-green/20 border-t pt-4">
          <div className="space-y-3">
            <button
              type="button"
              onClick={onRandomize}
              className="flex w-full items-center justify-center space-x-2 rounded-xl border border-stonks-green/40 bg-gradient-to-r from-stonks-green/20 to-stonks-accent/20 px-4 py-3 font-rajdhani font-semibold text-sm uppercase shadow-lg transition-all duration-300 hover:scale-105 hover:border-stonks-green/60 hover:from-stonks-green/30 hover:to-stonks-accent/30 hover:shadow-xl active:scale-95"
            >
              <Shuffle className="h-4 w-4" />
              <span>RANDOMIZE</span>
            </button>

            <button
              type="button"
              onClick={onClearAll}
              className="flex w-full items-center justify-center space-x-2 rounded-xl border border-stonks-red/40 bg-gradient-to-r from-stonks-red/20 to-stonks-orange/20 px-4 py-3 font-rajdhani font-semibold text-sm uppercase shadow-lg transition-all duration-300 hover:scale-105 hover:border-stonks-red/60 hover:from-stonks-red/30 hover:to-stonks-orange/30 hover:shadow-xl active:scale-95"
            >
              <X className="h-4 w-4" />
              <span>CLEAR ALL</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
