import { Calendar, Download, Eye, Share2, Trash2 } from 'lucide-react';
import type React from 'react';
import type { WojakCharacter } from '../types/wojak';
import { RarityBadge } from './RarityBadge';
import { WojakRenderer } from './WojakRenderer';

interface WojakCardProps {
  wojak: WojakCharacter;
  viewMode: 'grid' | 'list';
  isSelected?: boolean;
  onView?: (wojak: WojakCharacter) => void;
  onShare?: (wojak: WojakCharacter) => void;
  onDownload?: (wojak: WojakCharacter) => void;
  onDelete?: (wojak: WojakCharacter) => void;
}

export const WojakCard: React.FC<WojakCardProps> = ({
  wojak,
  viewMode,
  isSelected = false,
  onView,
  onShare,
  onDownload,
  onDelete,
}) => {
  const getRarity = () => {
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

    return rareTraits >= 3
      ? 'legendary'
      : rareTraits >= 2
        ? 'epic'
        : rareTraits >= 1
          ? 'rare'
          : 'common';
  };

  const rarity = getRarity();

  if (viewMode === 'list') {
    return (
      <button
        type="button"
        className={`wojak-card w-full cursor-pointer p-4 transition-all duration-200 hover:shadow-lg ${isSelected ? 'stonks-glow' : ''}`}
        onClick={() => onView?.(wojak)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onView?.(wojak);
          }
        }}
      >
        <div className="flex items-center space-x-4">
          {/* Wojak Preview */}
          <div className="flex-shrink-0">
            <div className="relative h-32 w-32 overflow-hidden rounded-lg bg-stonks-gray/50">
              <WojakRenderer wojak={wojak} />
            </div>
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center space-x-2">
              <h3 className="truncate font-bold text-lg text-stonks-light">
                {wojak.name.toUpperCase()}
              </h3>
              <span className="font-bold text-sm text-stonks-light/50">
                #{wojak.id.split('_')[1]}
              </span>
              <RarityBadge rarity={rarity} size="sm" />
            </div>
            <p className="mb-2 font-bold text-sm text-stonks-light/70">
              CREATED {new Date(wojak.createdAt).toLocaleDateString().toUpperCase()}
            </p>
            <div className="flex items-center space-x-4 font-bold text-stonks-light/60 text-xs">
              <span className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(wojak.createdAt).toLocaleTimeString()}</span>
              </span>
              <span className="uppercase">{rarity}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onView?.(wojak);
              }}
              className="rounded-lg p-2 transition-colors hover:bg-stonks-green/20"
              title="View Details"
            >
              <Eye className="h-4 w-4 text-stonks-light/70" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(wojak);
              }}
              className="rounded-lg p-2 transition-colors hover:bg-stonks-green/20"
              title="Share"
            >
              <Share2 className="h-4 w-4 text-stonks-light/70" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDownload?.(wojak);
              }}
              className="rounded-lg p-2 transition-colors hover:bg-stonks-green/20"
              title="Download"
            >
              <Download className="h-4 w-4 text-stonks-light/70" />
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(wojak);
                }}
                className="rounded-lg p-2 transition-colors hover:bg-stonks-red/20"
                title="Delete"
              >
                <Trash2 className="h-4 w-4 text-stonks-red" />
              </button>
            )}
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`wojak-card group w-full cursor-pointer p-4 transition-all duration-200 hover:shadow-lg ${isSelected ? 'stonks-glow' : ''}`}
      onClick={() => onView?.(wojak)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onView?.(wojak);
        }
      }}
    >
      {/* Wojak Preview */}
      <div className="mb-4 aspect-square overflow-hidden rounded-xl bg-stonks-gray/50">
        <WojakRenderer wojak={wojak} />
      </div>

      {/* Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="truncate font-bold text-stonks-light">{wojak.name.toUpperCase()}</h3>
          <RarityBadge rarity={rarity} size="sm" />
        </div>

        <div className="flex items-center justify-between font-bold text-sm text-stonks-light/70">
          <span>#{wojak.id.split('_')[1]}</span>
          <span className="uppercase">{rarity}</span>
        </div>

        <div className="flex items-center space-x-1 font-bold text-stonks-light/60 text-xs">
          <Calendar className="h-3 w-3" />
          <span>{new Date(wojak.createdAt).toLocaleDateString().toUpperCase()}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onView?.(wojak);
            }}
            className="flex items-center space-x-1 font-bold text-stonks-light/70 text-xs transition-colors hover:text-stonks-light"
          >
            <Eye className="h-3 w-3" />
            <span>VIEW</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(wojak);
              }}
              className="rounded p-1 transition-colors hover:bg-stonks-green/20"
              title="Share"
            >
              <Share2 className="h-3 w-3 text-stonks-light/70" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDownload?.(wojak);
              }}
              className="rounded p-1 transition-colors hover:bg-stonks-green/20"
              title="Download"
            >
              <Download className="h-3 w-3 text-stonks-light/70" />
            </button>
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(wojak);
                }}
                className="rounded p-1 transition-colors hover:bg-stonks-red/20"
                title="Delete"
              >
                <Trash2 className="h-3 w-3 text-stonks-red" />
              </button>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};
