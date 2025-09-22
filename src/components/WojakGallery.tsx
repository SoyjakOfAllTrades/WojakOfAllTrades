import { Grid, List, Search, Trophy } from 'lucide-react';
import PerfectScrollbar from 'perfect-scrollbar';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useWojakStorage } from '../hooks/useWojakStorage';
import type { WojakCharacter } from '../types/wojak';
import { WojakCard } from './WojakCard';
import { WojakStats } from './WojakStats';

type ViewMode = 'grid' | 'list';
type SortBy = 'newest' | 'oldest' | 'name' | 'rarity';
type FilterRarity = 'all' | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

interface WojakGalleryProps {
  onViewWojak?: (wojak: WojakCharacter) => void;
  onShareWojak?: (wojak: WojakCharacter) => void;
  onDownloadWojak?: (wojak: WojakCharacter) => void;
  onDeleteWojak?: (wojak: WojakCharacter) => void;
  onCreateWojak?: () => void;
}

export const WojakGallery: React.FC<WojakGalleryProps> = ({
  onViewWojak,
  onShareWojak,
  onDownloadWojak,
  onDeleteWojak,
  onCreateWojak,
}) => {
  const { getAllWojaks, searchWojaks, getStats } = useWojakStorage();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [filterRarity, setFilterRarity] = useState<FilterRarity>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStats, setShowStats] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const psRef = useRef<PerfectScrollbar | null>(null);

  const stats = getStats();

  const getFilteredWojaks = () => {
    let wojaks = searchQuery ? searchWojaks(searchQuery) : getAllWojaks();

    if (filterRarity !== 'all') {
      wojaks = wojaks.filter((wojak) => {
        const traits = [wojak.template, wojak.hat, wojak.glasses, wojak.mask];

        const rareTraits = traits.filter(
          (trait) =>
            trait === 'Chad' ||
            trait === 'Grug' ||
            trait === 'SoyjakWAOW' ||
            trait === 'SoyjakYelling' ||
            trait === '318' ||
            trait === '319' ||
            trait === '320' ||
            trait === '766' ||
            trait === '767' ||
            trait === '768' ||
            trait === '751' ||
            trait === '752'
        ).length;

        const overallRarity =
          rareTraits >= 3
            ? 'legendary'
            : rareTraits >= 2
              ? 'epic'
              : rareTraits >= 1
                ? 'rare'
                : 'common';

        return overallRarity === filterRarity;
      });
    }

    // Sort wojaks
    switch (sortBy) {
      case 'newest':
        return wojaks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      case 'oldest':
        return wojaks.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      case 'name':
        return wojaks.sort((a, b) => a.name.localeCompare(b.name));
      case 'rarity':
        return wojaks.sort((a, b) => {
          const getRarityScore = (wojak: WojakCharacter) => {
            const traits = [wojak.template, wojak.hat, wojak.glasses, wojak.mask];

            const rareTraits = traits.filter(
              (trait) =>
                trait === 'Chad' ||
                trait === 'Grug' ||
                trait === 'SoyjakWAOW' ||
                trait === 'SoyjakYelling' ||
                trait === '318' ||
                trait === '319' ||
                trait === '320' ||
                trait === '766' ||
                trait === '767' ||
                trait === '768' ||
                trait === '751' ||
                trait === '752'
            ).length;

            return rareTraits >= 3 ? 5 : rareTraits >= 2 ? 4 : rareTraits >= 1 ? 3 : 1;
          };
          return getRarityScore(b) - getRarityScore(a);
        });
      default:
        return wojaks;
    }
  };

  const filteredWojaks = getFilteredWojaks();

  // Initialize perfect scrollbar
  useEffect(() => {
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
    }

    // Cleanup on unmount
    return () => {
      if (psRef.current) {
        psRef.current.destroy();
        psRef.current = null;
      }
    };
  }, []); // Re-initialize when wojaks or stats visibility change

  return (
    <div className="flex h-full flex-col">
      <div className="container mx-auto flex h-full flex-col px-4 py-4">
        {/* Header */}
        <div className="mb-6 flex-shrink-0 text-center">
          <h1 className="stonks-text font-bold font-orbitron text-3xl">WOJAK GALLERY</h1>
        </div>

        {/* Main Gallery Container */}
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-stonks-green/40 bg-gradient-to-br from-stonks-darker/95 via-stonks-gray/90 to-stonks-darker/95 p-6 shadow-2xl backdrop-blur-sm">
          {/* Subtle pattern overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-stonks-green/5 via-transparent to-stonks-accent/5"></div>

          {/* Controls */}
          <div className="relative z-10 mb-6 flex-shrink-0">
            <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
              {/* Search */}
              <div className="relative max-w-md flex-1">
                <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-stonks-light/50" />
                <input
                  type="text"
                  placeholder="SEARCH WOJAKS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="wojak-input w-full pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                {/* Rarity Filter */}
                <select
                  value={filterRarity}
                  onChange={(e) => setFilterRarity(e.target.value as FilterRarity)}
                  className="wojak-input font-bold"
                >
                  <option value="all">ALL RARITIES</option>
                  <option value="common">COMMON</option>
                  <option value="uncommon">UNCOMMON</option>
                  <option value="rare">RARE</option>
                  <option value="epic">EPIC</option>
                  <option value="legendary">LEGENDARY</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortBy)}
                  className="wojak-input font-bold"
                >
                  <option value="newest">NEWEST FIRST</option>
                  <option value="oldest">OLDEST FIRST</option>
                  <option value="name">NAME A-Z</option>
                  <option value="rarity">RARITY</option>
                </select>

                {/* View Mode */}
                <div className="flex rounded-lg bg-stonks-gray/50 p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`rounded p-2 font-bold ${viewMode === 'grid' ? 'stonks-glow bg-stonks-green text-stonks-dark' : 'text-stonks-light/70'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`rounded p-2 font-bold ${viewMode === 'list' ? 'stonks-glow bg-stonks-green text-stonks-dark' : 'text-stonks-light/70'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Stats Toggle */}
                <button
                  type="button"
                  onClick={() => setShowStats(!showStats)}
                  className="wojak-button flex items-center space-x-2"
                >
                  <Trophy className="h-4 w-4" />
                  <span>STATS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          {showStats && (
            <div className="relative z-10 mb-4 flex-shrink-0">
              <WojakStats stats={stats} />
            </div>
          )}

          {/* Results Count */}
          <div className="relative z-10 mb-3 flex-shrink-0">
            <p className="font-bold text-stonks-light/70">
              SHOWING {filteredWojaks.length} OF {stats.total} WOJAKS
              {searchQuery && ` MATCHING "${searchQuery.toUpperCase()}"`}
              {filterRarity !== 'all' && ` WITH ${filterRarity.toUpperCase()} RARITY`}
            </p>
          </div>

          {/* Scrollable Wojak Container */}
          <div ref={scrollContainerRef} className="relative z-10 min-h-0 flex-1 overflow-hidden">
            {/* Wojak Grid/List */}
            {filteredWojaks.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mb-4 text-6xl">😢</div>
                <h3 className="stonks-red mb-2 font-bold text-2xl">NO WOJAKS FOUND</h3>
                <p className="mb-6 font-bold text-stonks-light/70">
                  {searchQuery || filterRarity !== 'all'
                    ? 'TRY ADJUSTING YOUR SEARCH OR FILTERS'
                    : 'START BY CREATING YOUR FIRST WOJAK!'}
                </p>
                {!searchQuery && filterRarity === 'all' && (
                  <button type="button" onClick={onCreateWojak} className="wojak-button">
                    CREATE WOJAK
                  </button>
                )}
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    : 'space-y-4'
                }
              >
                {filteredWojaks.map((wojak) => (
                  <WojakCard
                    key={wojak.id}
                    wojak={wojak}
                    viewMode={viewMode}
                    onView={onViewWojak}
                    onShare={onShareWojak}
                    onDownload={onDownloadWojak}
                    onDelete={onDeleteWojak}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
