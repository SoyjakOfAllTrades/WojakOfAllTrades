import { Eye, Glasses, HardHat, Sparkles, User, Zap } from 'lucide-react';
import type React from 'react';
import type { WojakCharacter } from '../types/wojak';
import { RarityBadge } from './RarityBadge';

interface WojakPreviewProps {
  wojak: WojakCharacter;
  onMint: () => void;
  isMinting: boolean;
}

export const WojakPreview: React.FC<WojakPreviewProps> = ({ wojak, onMint, isMinting }) => {
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
          : 'uncommon';
  };

  const rarity = getRarity();

  return (
    <div className="wojak-card flex h-full flex-col p-3">
      {/* Digital TCG Card Design */}
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-2xl border border-stonks-green/40 bg-gradient-to-br from-stonks-darker/95 via-stonks-gray/90 to-stonks-darker/95 p-6 shadow-2xl backdrop-blur-sm">
        {/* Subtle pattern overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-stonks-green/5 via-transparent to-stonks-accent/5"></div>

        {/* Card Header */}
        <div className="relative z-10 mb-4 flex items-center justify-between">
          <div className="font-medium font-mono text-stonks-light/70 text-xs uppercase tracking-widest">
            DIID CARD
          </div>
          <RarityBadge rarity={rarity} size="sm" />
        </div>

        {/* Card Title */}
        <div className="relative z-10 mb-6 text-center">
          <h3 className="stonks-text mb-2 font-bold font-orbitron text-xl">
            {wojak.name || 'UNNAMED WOJAK'}
          </h3>
          <div className="font-medium font-mono text-stonks-light/60 text-xs uppercase tracking-widest">
            DIGITAL IDENTITY
          </div>
        </div>

        {/* Card Content - Traits Grid */}
        <div className="relative z-10 mb-6 flex-1">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-stonks-green/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-3 shadow-sm backdrop-blur-sm">
              <div className="mb-2 flex items-center space-x-2">
                <User className="h-4 w-4 text-stonks-green" />
                <span className="font-medium font-mono text-stonks-light/70 text-xs">TEMPLATE</span>
              </div>
              <div className="font-rajdhani font-semibold text-stonks-light text-xs uppercase">
                {wojak.template}
              </div>
            </div>

            <div className="rounded-xl border border-stonks-accent/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-3 shadow-sm backdrop-blur-sm">
              <div className="mb-2 flex items-center space-x-2">
                <HardHat className="h-4 w-4 text-stonks-accent" />
                <span className="font-medium font-mono text-stonks-light/70 text-xs">HEADGEAR</span>
              </div>
              <div className="font-rajdhani font-semibold text-stonks-light text-xs uppercase">
                {wojak.hat === 'none' ? 'NONE' : `HAT ${wojak.hat}`}
              </div>
            </div>

            <div className="rounded-xl border border-stonks-warning/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-3 shadow-sm backdrop-blur-sm">
              <div className="mb-2 flex items-center space-x-2">
                <Glasses className="h-4 w-4 text-stonks-warning" />
                <span className="font-medium font-mono text-stonks-light/70 text-xs">VISION</span>
              </div>
              <div className="font-rajdhani font-semibold text-stonks-light text-xs uppercase">
                {wojak.glasses === 'none' ? 'NONE' : `GLASSES ${wojak.glasses}`}
              </div>
            </div>

            <div className="rounded-xl border border-stonks-light/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-3 shadow-sm backdrop-blur-sm">
              <div className="mb-2 flex items-center space-x-2">
                <Eye className="h-4 w-4 text-stonks-light" />
                <span className="font-medium font-mono text-stonks-light/70 text-xs">FACE</span>
              </div>
              <div className="font-rajdhani font-semibold text-stonks-light text-xs uppercase">
                {wojak.mask === 'none' ? 'NONE' : `MASK ${wojak.mask}`}
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer - Mint Button */}
        <div className="relative z-10 mt-auto">
          <button
            type="button"
            onClick={onMint}
            disabled={isMinting || !wojak.name?.trim()}
            className={`flex w-full transform items-center justify-center space-x-3 rounded-2xl px-6 py-4 font-rajdhani font-semibold shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
              isMinting
                ? 'cursor-not-allowed bg-stonks-gray/60 text-stonks-light/50'
                : !wojak.name?.trim()
                  ? 'cursor-not-allowed bg-stonks-gray/60 text-stonks-light/50'
                  : 'bg-gradient-to-r from-stonks-green to-stonks-accent text-stonks-dark shadow-stonks-green/20 hover:from-stonks-accent hover:to-stonks-green hover:shadow-stonks-green/40'
            }`}
          >
            {isMinting ? (
              <>
                <Sparkles className="h-5 w-5 animate-spin" />
                <span>MINTING...</span>
              </>
            ) : (
              <>
                <Zap className="h-5 w-5" />
                <span>MINT DIID</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
