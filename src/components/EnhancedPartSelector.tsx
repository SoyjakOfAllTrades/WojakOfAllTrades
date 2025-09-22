import { RotateCcw } from 'lucide-react';
import PerfectScrollbar from 'perfect-scrollbar';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { wojakParts } from '../data/wojakParts';
import type { WojakCharacter } from '../types/wojak';
import { RarityBadge } from './RarityBadge';
import { ReactColorfulPicker } from './ReactColorfulPicker';

interface EnhancedPartSelectorProps {
  wojak: WojakCharacter;
  category: string;
  onWojakUpdate: (updates: Partial<WojakCharacter>) => void;
  onRandomize?: () => void;
  onClearAll?: () => void;
}

export const EnhancedPartSelector: React.FC<EnhancedPartSelectorProps> = ({
  wojak,
  category,
  onWojakUpdate,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const psRef = useRef<PerfectScrollbar | null>(null);
  const [isScrollbarReady, setIsScrollbarReady] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<string | null>(null);
  const currentPart = wojakParts.find((part) => part.category === category);

  // Initialize perfect scrollbar
  useEffect(() => {
    setIsScrollbarReady(false);

    // Small delay to ensure DOM has updated
    const timer = setTimeout(() => {
      if (scrollContainerRef.current) {
        // Clean up existing instance
        if (psRef.current) {
          psRef.current.destroy();
        }

        // Initialize new instance
        psRef.current = new PerfectScrollbar(scrollContainerRef.current, {
          wheelSpeed: 2,
          wheelPropagation: false,
          minScrollbarLength: 20,
          suppressScrollX: true,
        });

        // Mark as ready
        setIsScrollbarReady(true);
      }
    }, 10);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      if (psRef.current) {
        psRef.current.destroy();
        psRef.current = null;
      }
    };
  }, []); // Re-initialize when category changes

  if (!currentPart) {
    return (
      <div className="py-8 text-center text-black/60">
        <p>Select a category to customize</p>
      </div>
    );
  }

  console.log('Current part:', currentPart);
  console.log('Category:', category);
  console.log('Options:', currentPart.options);

  const handleOptionSelect = (optionId: string) => {
    const option = currentPart.options.find((opt) => opt.id === optionId);
    if (!option) return;

    const updates: Partial<WojakCharacter> = {};

    switch (category) {
      case 'template':
        updates.template = option.value;
        break;
      case 'hats':
        updates.hat = option.value;
        break;
      case 'glasses':
        updates.glasses = option.value;
        break;
      case 'masks':
        updates.mask = option.value;
        break;
      case 'background':
        if (option.name.includes('color')) {
          updates.background = { ...wojak.background, color: option.value };
        } else if (option.name.includes('pattern')) {
          updates.background = {
            ...wojak.background,
            pattern: option.value as WojakCharacter['background']['pattern'],
          };
        }
        break;
    }

    onWojakUpdate(updates);
  };

  const getCurrentValue = () => {
    switch (category) {
      case 'template':
        return wojak.template;
      case 'hats':
        return wojak.hat;
      case 'glasses':
        return wojak.glasses;
      case 'masks':
        return wojak.mask;
      case 'background':
        return wojak.background.pattern;
      default:
        return '';
    }
  };

  const getRarityClasses = (rarity: string, isSelected: boolean, isHovered: boolean = false) => {
    if (isSelected) {
      // Selected state (ON)
      switch (rarity) {
        case 'exotic':
          return 'border-stonks-diamond bg-stonks-diamond/20 shadow-lg stonks-glow';
        case 'mythic':
          return 'border-stonks-golden bg-stonks-golden/20 shadow-lg stonks-glow';
        case 'legendary':
          return 'border-stonks-orange bg-stonks-orange/20 shadow-lg stonks-glow';
        case 'epic':
          return 'border-stonks-purple bg-stonks-purple/20 shadow-lg stonks-glow';
        case 'rare':
          return 'border-stonks-blue bg-stonks-blue/20 shadow-lg stonks-glow';
        case 'uncommon':
          return 'border-stonks-green bg-stonks-green/20 shadow-lg stonks-glow';
        case 'common':
          return 'border-stonks-light bg-stonks-light/20 shadow-lg stonks-glow';
        default:
          return 'border-stonks-gray bg-stonks-gray/20 shadow-lg stonks-glow';
      }
    } else if (isHovered) {
      // Hover state (IN-BETWEEN)
      switch (rarity) {
        case 'exotic':
          return 'border-stonks-diamond/40 bg-stonks-diamond/10 shadow-md';
        case 'mythic':
          return 'border-stonks-golden/40 bg-stonks-golden/10 shadow-md';
        case 'legendary':
          return 'border-stonks-orange/40 bg-stonks-orange/10 shadow-md';
        case 'epic':
          return 'border-stonks-purple/40 bg-stonks-purple/10 shadow-md';
        case 'rare':
          return 'border-stonks-blue/40 bg-stonks-blue/10 shadow-md';
        case 'uncommon':
          return 'border-stonks-green/40 bg-stonks-green/10 shadow-md';
        case 'common':
          return 'border-stonks-light/40 bg-stonks-light/10 shadow-md';
        default:
          return 'border-stonks-gray/40 bg-stonks-gray/10 shadow-md';
      }
    } else {
      // Default state (OFF)
      switch (rarity) {
        case 'exotic':
          return 'border-stonks-diamond/20 bg-stonks-diamond/5';
        case 'mythic':
          return 'border-stonks-golden/20 bg-stonks-golden/5';
        case 'legendary':
          return 'border-stonks-orange/20 bg-stonks-orange/5';
        case 'epic':
          return 'border-stonks-purple/20 bg-stonks-purple/5';
        case 'rare':
          return 'border-stonks-blue/20 bg-stonks-blue/5';
        case 'uncommon':
          return 'border-stonks-green/20 bg-stonks-green/5';
        case 'common':
          return 'border-stonks-light/20 bg-stonks-light/5';
        default:
          return 'border-stonks-gray/20 bg-stonks-gray/5';
      }
    }
  };

  const handleClearCategory = () => {
    const updates: Partial<WojakCharacter> = {};

    switch (category) {
      case 'template':
        updates.template = 'Standard';
        break;
      case 'hats':
        updates.hat = 'none';
        break;
      case 'glasses':
        updates.glasses = 'none';
        break;
      case 'masks':
        updates.mask = 'none';
        break;
      case 'background':
        updates.background = { ...wojak.background, pattern: 'solid' };
        break;
    }

    onWojakUpdate(updates);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex flex-shrink-0 items-center justify-between">
        <h4 className="stonks-text font-bold text-lg">{currentPart.name.toUpperCase()}</h4>
        <button
          type="button"
          onClick={handleClearCategory}
          className="flex items-center space-x-1 rounded-lg border border-stonks-red/40 bg-stonks-red/8 px-3 py-1.5 font-medium font-rajdhani text-sm text-white transition-colors duration-200 hover:border-stonks-red/60 hover:bg-stonks-red/15 hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          <span>RESET TRAIT</span>
        </button>
      </div>

      {/* Option Grids - Fill remaining space */}
      <div className="flex min-h-0 flex-1 flex-col">
        {category === 'background' ? (
          // Background-specific layout with pattern selection, color picker, and buttons
          <div className="flex h-full flex-col">
            {/* Single scrollable container for all background sections */}
            <div
              ref={scrollContainerRef}
              className={`relative min-h-0 flex-1 overflow-hidden ${!isScrollbarReady ? 'opacity-0' : 'opacity-100'} transition-opacity duration-100`}
            >
              <div className="space-y-4">
                {/* Background Image Selection */}
                <div>
                  <h4 className="stonks-text mb-2 flex items-center space-x-2 font-bold text-sm">
                    <span>BACKGROUND IMAGE</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-stonks-green/50 to-transparent"></div>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 pr-4 pl-2">
                    {[
                      {
                        id: 'stonks',
                        name: 'Stonks',
                        value: 'stonks',
                        preview: '📈',
                        rarity: 'uncommon',
                      },
                      {
                        id: 'not-stonks',
                        name: 'Not Stonks',
                        value: 'not-stonks',
                        preview: '📉',
                        rarity: 'uncommon',
                      },
                    ].map((pattern) => (
                      <button
                        type="button"
                        key={pattern.id}
                        onClick={() =>
                          onWojakUpdate({
                            background: {
                              ...wojak.background,
                              pattern: pattern.value as WojakCharacter['background']['pattern'],
                            },
                          })
                        }
                        onMouseEnter={() => setHoveredOption(pattern.id)}
                        onMouseLeave={() => setHoveredOption(null)}
                        className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 ${getRarityClasses(pattern.rarity, pattern.value === wojak.background.pattern, hoveredOption === pattern.id)} hover:scale-105 active:scale-95`}
                      >
                        {/* Rarity Badge - Top Right */}
                        <div className="absolute top-2 right-2">
                          <RarityBadge
                            rarity={pattern.rarity}
                            size="sm"
                            className={
                              pattern.value === wojak.background.pattern
                                ? 'opacity-100'
                                : 'opacity-80'
                            }
                          />
                        </div>

                        {/* Content Row - Image and Name */}
                        <div className="flex items-center space-x-3 pr-16">
                          {/* Image - Larger */}
                          <div className="flex-shrink-0">
                            <div className="text-4xl">{pattern.preview}</div>
                          </div>

                          {/* Name */}
                          <div className="min-w-0 flex-1">
                            <div
                              className={`font-bold font-rajdhani text-sm ${pattern.value === wojak.background.pattern ? 'text-stonks-light' : 'text-stonks-light/70'}`}
                            >
                              {pattern.name.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pattern Selection */}
                <div>
                  <h4 className="stonks-text mb-2 flex items-center space-x-2 font-bold text-sm">
                    <span>BACKGROUND PATTERN</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-stonks-green/50 to-transparent"></div>
                  </h4>
                  <div className="grid grid-cols-2 gap-3 pr-4 pl-2">
                    {currentPart.options
                      .filter(
                        (option) => option.value !== 'stonks' && option.value !== 'not-stonks'
                      )
                      .sort((a, b) => {
                        const rarityOrder = {
                          exotic: 0,
                          mythic: 1,
                          legendary: 2,
                          epic: 3,
                          rare: 4,
                          uncommon: 5,
                          common: 6,
                        };
                        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
                      })
                      .map((pattern) => (
                        <button
                          type="button"
                          key={pattern.id}
                          onClick={() =>
                            onWojakUpdate({
                              background: {
                                ...wojak.background,
                                pattern: pattern.value as WojakCharacter['background']['pattern'],
                              },
                            })
                          }
                          onMouseEnter={() => setHoveredOption(pattern.id)}
                          onMouseLeave={() => setHoveredOption(null)}
                          className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 ${getRarityClasses(pattern.rarity, pattern.value === wojak.background.pattern, hoveredOption === pattern.id)} hover:scale-105 active:scale-95`}
                        >
                          {/* Rarity Badge - Top Right */}
                          <div className="absolute top-2 right-2">
                            <RarityBadge
                              rarity={pattern.rarity}
                              size="sm"
                              className={
                                pattern.value === wojak.background.pattern
                                  ? 'opacity-100'
                                  : 'opacity-80'
                              }
                            />
                          </div>

                          {/* Content Row - Image and Name */}
                          <div className="flex items-center space-x-3 pr-16">
                            {/* Image - Larger */}
                            <div className="flex-shrink-0">
                              {pattern.preview.startsWith('/') ? (
                                <img
                                  src={pattern.preview}
                                  alt={pattern.name}
                                  className="h-12 w-12 object-contain"
                                />
                              ) : (
                                <div className="text-4xl">{pattern.preview}</div>
                              )}
                            </div>

                            {/* Name */}
                            <div className="min-w-0 flex-1">
                              <div
                                className={`font-bold font-rajdhani text-sm ${pattern.value === wojak.background.pattern ? 'text-stonks-light' : 'text-stonks-light/70'}`}
                              >
                                {pattern.name.toUpperCase()}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="my-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-stonks-gray/50 to-transparent"></div>
                </div>

                {/* Color Picker Section */}
                <div className="space-y-4 pr-2">
                  {/* Color Selection - show for solid pattern */}
                  {wojak.background.pattern === 'solid' && (
                    <div className="space-y-4">
                      <h4 className="stonks-text flex items-center space-x-2 font-bold text-sm">
                        <span>SOLID COLOR</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-stonks-light/50 to-transparent"></div>
                      </h4>
                      <div className="rounded-lg border border-stonks-gray/30 bg-stonks-gray/20 p-4">
                        <ReactColorfulPicker
                          label=""
                          value={wojak.background.color}
                          onChange={(color) =>
                            onWojakUpdate({ background: { ...wojak.background, color } })
                          }
                          presetColors={[
                            '#FFFFFF',
                            '#F7E98E',
                            '#FFB6C1',
                            '#87CEEB',
                            '#98FB98',
                            '#DDA0DD',
                          ]}
                        />
                      </div>
                    </div>
                  )}

                  {/* Background and Pattern Colors - show for patterns that need colors */}
                  {wojak.background.pattern !== 'solid' &&
                    wojak.background.pattern !== 'gradient' &&
                    wojak.background.pattern !== 'stonks' &&
                    wojak.background.pattern !== 'not-stonks' && (
                      <div className="space-y-4">
                        <h4 className="stonks-text flex items-center space-x-2 font-bold text-sm">
                          <span>BACKGROUND & PATTERN COLORS</span>
                          <div className="h-px flex-1 bg-gradient-to-r from-stonks-light/50 to-transparent"></div>
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <div className="mb-2 block flex items-center space-x-2 font-bold text-stonks-light/70 text-xs">
                              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-stonks-light to-stonks-accent"></div>
                              <span>BACKGROUND</span>
                            </div>
                            <div className="rounded-lg border border-stonks-gray/30 bg-stonks-gray/20 p-3">
                              <ReactColorfulPicker
                                label=""
                                value={wojak.background.color}
                                onChange={(color) =>
                                  onWojakUpdate({ background: { ...wojak.background, color } })
                                }
                                presetColors={[
                                  '#FFFFFF',
                                  '#F7E98E',
                                  '#FFB6C1',
                                  '#87CEEB',
                                  '#98FB98',
                                  '#DDA0DD',
                                ]}
                              />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="mb-2 block flex items-center space-x-2 font-bold text-stonks-light/70 text-xs">
                              <div className="h-3 w-3 rounded-full bg-gradient-to-r from-stonks-accent to-stonks-green"></div>
                              <span>PATTERN</span>
                            </div>
                            <div className="rounded-lg border border-stonks-gray/30 bg-stonks-gray/20 p-3">
                              <ReactColorfulPicker
                                label=""
                                value={wojak.background.patternColor || '#000000'}
                                onChange={(patternColor) =>
                                  onWojakUpdate({
                                    background: { ...wojak.background, patternColor },
                                  })
                                }
                                presetColors={[
                                  '#000000',
                                  '#333333',
                                  '#666666',
                                  '#999999',
                                  '#CCCCCC',
                                  '#FFFFFF',
                                ]}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Gradient Colors - only show for gradient pattern */}
                  {wojak.background.pattern === 'gradient' && (
                    <div className="space-y-4">
                      <h4 className="stonks-text flex items-center space-x-2 font-bold text-sm">
                        <span>GRADIENT COLORS</span>
                        <div className="h-px flex-1 bg-gradient-to-r from-stonks-warning/50 to-transparent"></div>
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="mb-2 block flex items-center space-x-2 font-bold text-stonks-light/70 text-xs">
                            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-stonks-warning to-stonks-accent"></div>
                            <span>FROM COLOR</span>
                          </div>
                          <div className="rounded-lg border border-stonks-gray/30 bg-stonks-gray/20 p-3">
                            <ReactColorfulPicker
                              label=""
                              value={wojak.background.color}
                              onChange={(color) =>
                                onWojakUpdate({ background: { ...wojak.background, color } })
                              }
                              presetColors={[
                                '#FF6B6B',
                                '#4ECDC4',
                                '#45B7D1',
                                '#96CEB4',
                                '#FFEAA7',
                                '#DDA0DD',
                              ]}
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="mb-2 block flex items-center space-x-2 font-bold text-stonks-light/70 text-xs">
                            <div className="h-3 w-3 rounded-full bg-gradient-to-r from-stonks-accent to-stonks-green"></div>
                            <span>TO COLOR</span>
                          </div>
                          <div className="rounded-lg border border-stonks-gray/30 bg-stonks-gray/20 p-3">
                            <ReactColorfulPicker
                              label=""
                              value={wojak.background.gradientTo || '#FFFFFF'}
                              onChange={(gradientTo) =>
                                onWojakUpdate({ background: { ...wojak.background, gradientTo } })
                              }
                              presetColors={[
                                '#FFFFFF',
                                '#F7E98E',
                                '#FFB6C1',
                                '#87CEEB',
                                '#98FB98',
                                '#DDA0DD',
                              ]}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Standard option grid for other categories
          <div
            ref={scrollContainerRef}
            className={`relative min-h-0 flex-1 overflow-hidden ${!isScrollbarReady ? 'opacity-0' : 'opacity-100'} transition-opacity duration-100`}
          >
            {/* Default/None Option - Show separately at top */}
            <div className="mb-4">
              <h5 className="mb-2 font-bold font-mono text-stonks-light/60 text-xs uppercase tracking-wider">
                DEFAULT
              </h5>
              <div className="grid grid-cols-2 gap-3 pr-4 pl-2">
                {currentPart.options
                  .filter(
                    (option) =>
                      option.value === 'none' ||
                      option.name.toLowerCase().includes('none') ||
                      option.name.toLowerCase().includes('standard')
                  )
                  .map((option) => (
                    <button
                      type="button"
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      onMouseEnter={() => setHoveredOption(option.id)}
                      onMouseLeave={() => setHoveredOption(null)}
                      className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 ${getRarityClasses(option.rarity, option.value === getCurrentValue(), hoveredOption === option.id)} hover:scale-105 active:scale-95`}
                    >
                      {/* Rarity Badge - Top Right */}
                      <div className="absolute top-2 right-2">
                        <RarityBadge
                          rarity={option.rarity}
                          size="sm"
                          className={
                            option.value === getCurrentValue() ? 'opacity-100' : 'opacity-80'
                          }
                        />
                      </div>

                      {/* Content Row - Image and Name */}
                      <div className="flex items-center space-x-3 pr-16">
                        {/* Image - Larger */}
                        <div className="flex-shrink-0">
                          {option.preview.startsWith('/') ? (
                            <img
                              src={option.preview}
                              alt={option.name}
                              className="h-12 w-12 object-contain"
                            />
                          ) : (
                            <div className="text-4xl">{option.preview}</div>
                          )}
                        </div>

                        {/* Name */}
                        <div className="min-w-0 flex-1">
                          <div
                            className={`font-bold font-rajdhani text-sm ${option.value === getCurrentValue() ? 'text-stonks-light' : 'text-stonks-light/70'}`}
                          >
                            {option.name.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Other Options */}
            <div>
              <h5 className="mb-2 font-bold font-mono text-stonks-light/60 text-xs uppercase tracking-wider">
                OPTIONS
              </h5>
              <div className="grid grid-cols-2 gap-3 pr-4 pl-2">
                {currentPart.options
                  .filter(
                    (option) =>
                      option.value !== 'none' &&
                      !option.name.toLowerCase().includes('none') &&
                      !option.name.toLowerCase().includes('standard')
                  )
                  .sort((a, b) => {
                    const rarityOrder = {
                      exotic: 0,
                      mythic: 1,
                      legendary: 2,
                      epic: 3,
                      rare: 4,
                      uncommon: 5,
                      common: 6,
                    };
                    return rarityOrder[a.rarity] - rarityOrder[b.rarity];
                  })
                  .map((option) => (
                    <button
                      type="button"
                      key={option.id}
                      onClick={() => handleOptionSelect(option.id)}
                      onMouseEnter={() => setHoveredOption(option.id)}
                      onMouseLeave={() => setHoveredOption(null)}
                      className={`relative rounded-xl border-2 p-4 text-left transition-all duration-200 ${getRarityClasses(option.rarity, option.value === getCurrentValue(), hoveredOption === option.id)} hover:scale-105 active:scale-95`}
                    >
                      {/* Rarity Badge - Top Right */}
                      <div className="absolute top-2 right-2">
                        <RarityBadge
                          rarity={option.rarity}
                          size="sm"
                          className={
                            option.value === getCurrentValue() ? 'opacity-100' : 'opacity-80'
                          }
                        />
                      </div>

                      {/* Content Row - Image and Name */}
                      <div className="flex items-center space-x-3 pr-16">
                        {/* Image - Larger */}
                        <div className="flex-shrink-0">
                          {option.preview.startsWith('/') ? (
                            <img
                              src={option.preview}
                              alt={option.name}
                              className="h-12 w-12 object-contain"
                            />
                          ) : (
                            <div className="text-4xl">{option.preview}</div>
                          )}
                        </div>

                        {/* Name */}
                        <div className="min-w-0 flex-1">
                          <div
                            className={`font-bold font-rajdhani text-sm ${option.value === getCurrentValue() ? 'text-stonks-light' : 'text-stonks-light/70'}`}
                          >
                            {option.name.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
