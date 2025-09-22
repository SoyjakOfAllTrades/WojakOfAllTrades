import {
  Award,
  BarChart3,
  Calendar,
  Copy,
  Crown,
  Download,
  ExternalLink,
  Eye,
  Hash,
  Image,
  Layers,
  MessageCircle,
  Share2,
  Smile,
  Sparkles,
  Users,
} from 'lucide-react';
import type React from 'react';
import { wojakParts } from '../data/wojakParts';
import { useWojakStorage } from '../hooks/useWojakStorage';
import type { WojakCharacter } from '../types/wojak';
import { RarityBadge } from './RarityBadge';
import { WojakRenderer } from './WojakRenderer';

interface WojakDetailProps {
  wojak: WojakCharacter;
  onBack: () => void;
  onShare?: (wojak: WojakCharacter) => void;
  onDownload?: (wojak: WojakCharacter) => void;
}

export const WojakDetail: React.FC<WojakDetailProps> = ({ wojak, onBack, onShare, onDownload }) => {
  const { getAllWojaks, getStats } = useWojakStorage();
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

  const getTraitRarity = (trait: string) => {
    const rareTraits = [
      'Chad',
      'Grug',
      'SoyjakWAOW',
      'SoyjakYelling',
      '318',
      '319',
      '320',
      '766',
      '767',
      '768',
      '751',
      '752',
    ];
    return rareTraits.includes(trait) ? 'rare' : 'common';
  };

  const getPersonalityAnalysis = () => {
    const _traits = [wojak.template, wojak.hat, wojak.glasses, wojak.mask];
    const analysis = [];

    // Template analysis
    if (wojak.template === 'Chad') analysis.push('Confident and assertive leader');
    else if (wojak.template === 'Grug') analysis.push('Simple but wise primitive');
    else if (wojak.template === 'SoyjakWAOW') analysis.push('Excitable and enthusiastic');
    else if (wojak.template === 'SoyjakYelling') analysis.push('Passionate and vocal');
    else analysis.push('Balanced and adaptable');

    // Accessory analysis
    if (wojak.hat !== 'none') analysis.push('Fashion-conscious and style-aware');
    if (wojak.glasses !== 'none') analysis.push('Intellectual and detail-oriented');
    if (wojak.mask !== 'none') analysis.push('Mysterious and enigmatic');

    return analysis;
  };

  const getRarityScore = () => {
    const traits = [wojak.template, wojak.hat, wojak.glasses, wojak.mask];
    const rareCount = traits.filter((trait) => getTraitRarity(trait) === 'rare').length;
    return (rareCount / traits.length) * 100;
  };

  const getTraitPreview = (category: string, value: string) => {
    const part = wojakParts.find((p) => p.category === category);
    if (!part) return null;

    const option = part.options.find((o) => o.value === value);
    return option?.preview || null;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'template':
        return <Users className="h-4 w-4 text-stonks-accent" />;
      case 'hats':
        return <Crown className="h-4 w-4 text-stonks-accent" />;
      case 'glasses':
        return <Eye className="h-4 w-4 text-stonks-accent" />;
      case 'masks':
        return <Smile className="h-4 w-4 text-stonks-accent" />;
      case 'background':
        return <Image className="h-4 w-4 text-stonks-accent" />;
      default:
        return <Layers className="h-4 w-4 text-stonks-accent" />;
    }
  };

  const getCollectionStats = () => {
    const allWojaks = getAllWojaks();
    const stats = getStats();

    // Helper function to calculate rarity for any wojak
    const calculateRarity = (w: WojakCharacter) => {
      const traits = [w.template, w.hat, w.glasses, w.mask];
      const rareCount = traits.filter((trait) => getTraitRarity(trait) === 'rare').length;
      return rareCount >= 3
        ? 'legendary'
        : rareCount >= 2
          ? 'epic'
          : rareCount >= 1
            ? 'rare'
            : 'common';
    };

    // Calculate rarity distribution
    const rarityDistribution = allWojaks.reduce(
      (acc, w) => {
        const r = calculateRarity(w);
        acc[r] = (acc[r] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    // Find this wojak's rarity rank
    const currentRarity = getRarity();
    const sameRarityWojaks = allWojaks.filter((w) => calculateRarity(w) === currentRarity);

    const rarityRank = sameRarityWojaks.length;
    const totalInRarity = rarityDistribution[currentRarity] || 0;

    return {
      totalWojaks: stats.total,
      rarityDistribution,
      rarityRank,
      totalInRarity,
      rarityPercentage:
        totalInRarity > 0 ? ((totalInRarity / stats.total) * 100).toFixed(1) : '0.0',
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const rarity = getRarity();
  const personalityTraits = getPersonalityAnalysis();
  const rarityScore = getRarityScore();
  const collectionStats = getCollectionStats();

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-6 flex flex-shrink-0 items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-stonks-green/40 bg-gradient-to-r from-stonks-green/20 to-stonks-accent/20 px-4 py-2 font-rajdhani font-semibold text-stonks-green transition-all duration-300 hover:scale-105 hover:border-stonks-green/60 hover:from-stonks-green/30 hover:to-stonks-accent/30 active:scale-95"
        >
          ← BACK TO GALLERY
        </button>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onShare?.(wojak)}
            className="rounded-lg p-2 transition-colors hover:bg-stonks-green/20"
            title="Share"
          >
            <Share2 className="h-4 w-4 text-stonks-light/70" />
          </button>
          <button
            type="button"
            onClick={() => onDownload?.(wojak)}
            className="rounded-lg p-2 transition-colors hover:bg-stonks-green/20"
            title="Download"
          >
            <Download className="h-4 w-4 text-stonks-light/70" />
          </button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Left Column - Wojak Display & Basic Info */}
        <div className="space-y-6 xl:col-span-1">
          {/* Wojak Display Card */}
          <div className="relative overflow-hidden rounded-2xl border border-stonks-green/40 bg-gradient-to-br from-stonks-darker/95 via-stonks-gray/90 to-stonks-darker/95 p-6 shadow-2xl backdrop-blur-sm">
            {/* Subtle pattern overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-stonks-green/5 via-transparent to-stonks-accent/5"></div>

            <div className="relative z-10">
              {/* Header */}
              <div className="mb-6 text-center">
                <div className="mb-3 flex items-center justify-center space-x-3">
                  <h1 className="stonks-text font-bold font-orbitron text-2xl">
                    {wojak.name.toUpperCase()}
                  </h1>
                  <RarityBadge rarity={rarity} size="md" />
                </div>
                <div className="flex items-center justify-center space-x-4 font-bold text-sm text-stonks-light/70">
                  <span className="flex items-center space-x-1">
                    <Hash className="h-4 w-4" />
                    <span>#{wojak.id.split('_')[1]}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(wojak.createdAt).toLocaleDateString().toUpperCase()}</span>
                  </span>
                </div>
              </div>

              {/* Wojak Image */}
              <div className="mb-6 flex justify-center">
                <div className="h-64 w-64 overflow-hidden rounded-2xl border border-stonks-green/30 bg-gradient-to-br from-stonks-darker/40 to-stonks-gray/20 shadow-inner">
                  <WojakRenderer wojak={wojak} />
                </div>
              </div>

              {/* Rarity Badge */}
              <div className="mb-6 text-center">
                <RarityBadge rarity={rarity} size="md" />
              </div>

              {/* Actions */}
              <div className="space-y-3">
                {/* Primary Actions */}
                <div className="flex justify-center space-x-3">
                  <button
                    type="button"
                    onClick={() => onShare?.(wojak)}
                    className="flex items-center space-x-2 rounded-xl border border-stonks-green/40 bg-gradient-to-r from-stonks-green/20 to-stonks-accent/20 px-4 py-2 font-rajdhani font-semibold text-stonks-green transition-all duration-300 hover:scale-105 hover:border-stonks-green/60 hover:from-stonks-green/30 hover:to-stonks-accent/30 active:scale-95"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>SHARE</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onDownload?.(wojak)}
                    className="flex items-center space-x-2 rounded-xl border border-stonks-accent/40 bg-gradient-to-r from-stonks-accent/20 to-stonks-green/20 px-4 py-2 font-rajdhani font-semibold text-stonks-accent transition-all duration-300 hover:scale-105 hover:border-stonks-accent/60 hover:from-stonks-accent/30 hover:to-stonks-green/30 active:scale-95"
                  >
                    <Download className="h-4 w-4" />
                    <span>DOWNLOAD</span>
                  </button>
                </div>

                {/* Social Media Actions */}
                <div className="flex justify-center space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      const text = `Check out my ${rarity} Wojak: ${wojak.name}! #WojakOfAllTrades #NFT #Memes`;
                      const url = window.location.href;
                      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
                      window.open(twitterUrl, '_blank');
                    }}
                    className="flex items-center space-x-1 rounded-lg border border-blue-500/40 bg-gradient-to-r from-blue-500/20 to-blue-600/20 px-3 py-1.5 font-rajdhani font-semibold text-blue-400 text-xs transition-all duration-300 hover:scale-105 hover:border-blue-500/60 hover:from-blue-500/30 hover:to-blue-600/30 active:scale-95"
                  >
                    <MessageCircle className="h-3 w-3" />
                    <span>TWEET</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const text = `Check out my ${rarity} Wojak: ${wojak.name}! #WojakOfAllTrades #NFT #Memes`;
                      const url = window.location.href;
                      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
                      window.open(facebookUrl, '_blank');
                    }}
                    className="flex items-center space-x-1 rounded-lg border border-blue-600/40 bg-gradient-to-r from-blue-600/20 to-blue-700/20 px-3 py-1.5 font-rajdhani font-semibold text-blue-500 text-xs transition-all duration-300 hover:scale-105 hover:border-blue-600/60 hover:from-blue-600/30 hover:to-blue-700/30 active:scale-95"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span>FACEBOOK</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const text = `Check out my ${rarity} Wojak: ${wojak.name}! #WojakOfAllTrades #NFT #Memes`;
                      navigator.clipboard.writeText(`${text}\n${window.location.href}`);
                      // You could add a toast notification here
                    }}
                    className="flex items-center space-x-1 rounded-lg border border-stonks-gray/40 bg-gradient-to-r from-stonks-gray/20 to-stonks-darker/20 px-3 py-1.5 font-rajdhani font-semibold text-stonks-light text-xs transition-all duration-300 hover:scale-105 hover:border-stonks-gray/60 hover:from-stonks-gray/30 hover:to-stonks-darker/30 active:scale-95"
                  >
                    <Copy className="h-3 w-3" />
                    <span>COPY LINK</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Info Card */}
          <div className="relative overflow-hidden rounded-2xl border border-stonks-green/40 bg-gradient-to-br from-stonks-darker/95 via-stonks-gray/90 to-stonks-darker/95 p-6 shadow-2xl backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-stonks-green/5 via-transparent to-stonks-accent/5"></div>

            <div className="relative z-10">
              <h3 className="stonks-text mb-4 flex items-center space-x-2 font-bold font-orbitron text-lg">
                <Hash className="h-5 w-5" />
                <span>IDENTITY CARD</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-stonks-light/70">ID:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm text-stonks-light">{wojak.id}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(wojak.id)}
                      className="rounded p-1 transition-colors hover:bg-stonks-green/20"
                    >
                      <Copy className="h-3 w-3 text-stonks-light/50" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-sm text-stonks-light/70">CREATED:</span>
                  <span className="font-bold text-sm text-stonks-light">
                    {new Date(wojak.createdAt).toLocaleString().toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-sm text-stonks-light/70">RARITY SCORE:</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-stonks-gray/30">
                      <div
                        className="h-full bg-gradient-to-r from-stonks-green to-stonks-accent transition-all duration-500"
                        style={{ width: `${rarityScore}%` }}
                      ></div>
                    </div>
                    <span className="font-bold text-sm text-stonks-light">
                      {Math.round(rarityScore)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Detailed Analysis */}
        <div className="space-y-6 xl:col-span-2">
          {/* Personality Analysis */}
          <div className="relative overflow-hidden rounded-2xl border border-stonks-green/40 bg-gradient-to-br from-stonks-darker/95 via-stonks-gray/90 to-stonks-darker/95 p-6 shadow-2xl backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-stonks-green/5 via-transparent to-stonks-accent/5"></div>

            <div className="relative z-10">
              <h3 className="stonks-text mb-4 flex items-center space-x-2 font-bold font-orbitron text-lg">
                <Sparkles className="h-5 w-5" />
                <span>PERSONALITY ANALYSIS</span>
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {personalityTraits.map((trait) => (
                  <div
                    key={trait}
                    className="flex items-center space-x-3 rounded-xl border border-stonks-green/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-3 shadow-sm backdrop-blur-sm"
                  >
                    <div className="h-2 w-2 rounded-full bg-stonks-green"></div>
                    <span className="font-medium text-sm text-stonks-light">{trait}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trait Showcase */}
          <div className="relative overflow-hidden rounded-2xl border border-stonks-green/40 bg-gradient-to-br from-stonks-darker/95 via-stonks-gray/90 to-stonks-darker/95 p-6 shadow-2xl backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-stonks-green/5 via-transparent to-stonks-accent/5"></div>

            <div className="relative z-10">
              <h3 className="stonks-text mb-4 flex items-center space-x-2 font-bold font-orbitron text-lg">
                <Layers className="h-5 w-5" />
                <span>TRAIT BREAKDOWN</span>
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Template */}
                <div className="rounded-xl border border-stonks-green/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-4 shadow-sm backdrop-blur-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon('template')}
                      <h4 className="font-bold text-sm text-stonks-light">TEMPLATE</h4>
                    </div>
                    <RarityBadge rarity={getTraitRarity(wojak.template)} size="sm" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 flex-shrink-0">
                      {(() => {
                        const preview = getTraitPreview('template', wojak.template);
                        return preview?.startsWith('/') ? (
                          <img
                            src={preview}
                            alt={wojak.template}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl">
                            {preview || '👤'}
                          </div>
                        );
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-stonks-light/80">
                        {wojak.template.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hat */}
                <div className="rounded-xl border border-stonks-green/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-4 shadow-sm backdrop-blur-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon('hats')}
                      <h4 className="font-bold text-sm text-stonks-light">HAT</h4>
                    </div>
                    <RarityBadge rarity={getTraitRarity(wojak.hat)} size="sm" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 flex-shrink-0">
                      {(() => {
                        const preview = getTraitPreview('hats', wojak.hat);
                        return preview?.startsWith('/') ? (
                          <img
                            src={preview}
                            alt={wojak.hat}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl">
                            {preview || '👤'}
                          </div>
                        );
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-stonks-light/80">
                        {wojak.hat === 'none' ? 'NONE' : wojak.hat.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Glasses */}
                <div className="rounded-xl border border-stonks-green/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-4 shadow-sm backdrop-blur-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon('glasses')}
                      <h4 className="font-bold text-sm text-stonks-light">GLASSES</h4>
                    </div>
                    <RarityBadge rarity={getTraitRarity(wojak.glasses)} size="sm" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 flex-shrink-0">
                      {(() => {
                        const preview = getTraitPreview('glasses', wojak.glasses);
                        return preview?.startsWith('/') ? (
                          <img
                            src={preview}
                            alt={wojak.glasses}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl">
                            {preview || '👤'}
                          </div>
                        );
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-stonks-light/80">
                        {wojak.glasses === 'none' ? 'NONE' : wojak.glasses.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mask */}
                <div className="rounded-xl border border-stonks-green/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-4 shadow-sm backdrop-blur-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon('masks')}
                      <h4 className="font-bold text-sm text-stonks-light">MASK</h4>
                    </div>
                    <RarityBadge rarity={getTraitRarity(wojak.mask)} size="sm" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 flex-shrink-0">
                      {(() => {
                        const preview = getTraitPreview('masks', wojak.mask);
                        return preview?.startsWith('/') ? (
                          <img
                            src={preview}
                            alt={wojak.mask}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl">
                            {preview || '👤'}
                          </div>
                        );
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-stonks-light/80">
                        {wojak.mask === 'none' ? 'NONE' : wojak.mask.toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Details */}
              <div className="mt-4 rounded-xl border border-stonks-green/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-4 shadow-sm backdrop-blur-sm">
                <h4 className="mb-3 font-bold text-sm text-stonks-light">BACKGROUND</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <span className="font-bold text-stonks-light/70 text-xs">TYPE:</span>
                    <div className="font-medium text-sm text-stonks-light/80">
                      {wojak.background.pattern === 'stonks'
                        ? 'STONKS IMAGE'
                        : wojak.background.pattern === 'not-stonks'
                          ? 'NOT STONKS IMAGE'
                          : wojak.background.pattern.toUpperCase()}
                    </div>
                  </div>
                  {wojak.background.pattern === 'solid' && (
                    <div>
                      <span className="font-bold text-stonks-light/70 text-xs">COLOR:</span>
                      <div className="flex items-center space-x-2">
                        <div
                          className="h-4 w-4 rounded border border-stonks-light/30"
                          style={{ backgroundColor: wojak.background.color }}
                        ></div>
                        <span className="font-medium font-mono text-sm text-stonks-light/80">
                          {wojak.background.color}
                        </span>
                      </div>
                    </div>
                  )}
                  {wojak.background.pattern === 'gradient' && (
                    <>
                      <div>
                        <span className="font-bold text-stonks-light/70 text-xs">FROM:</span>
                        <div className="flex items-center space-x-2">
                          <div
                            className="h-4 w-4 rounded border border-stonks-light/30"
                            style={{ backgroundColor: wojak.background.color }}
                          ></div>
                          <span className="font-medium font-mono text-sm text-stonks-light/80">
                            {wojak.background.color}
                          </span>
                        </div>
                      </div>
                      <div>
                        <span className="font-bold text-stonks-light/70 text-xs">TO:</span>
                        <div className="flex items-center space-x-2">
                          <div
                            className="h-4 w-4 rounded border border-stonks-light/30"
                            style={{ backgroundColor: wojak.background.gradientTo || '#FFFFFF' }}
                          ></div>
                          <span className="font-medium font-mono text-sm text-stonks-light/80">
                            {wojak.background.gradientTo || '#FFFFFF'}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Collection Statistics */}
          <div className="relative overflow-hidden rounded-2xl border border-stonks-green/40 bg-gradient-to-br from-stonks-darker/95 via-stonks-gray/90 to-stonks-darker/95 p-6 shadow-2xl backdrop-blur-sm">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-stonks-green/5 via-transparent to-stonks-accent/5"></div>

            <div className="relative z-10">
              <h3 className="stonks-text mb-4 flex items-center space-x-2 font-bold font-orbitron text-lg">
                <BarChart3 className="h-5 w-5" />
                <span>COLLECTION STATISTICS</span>
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Rarity Ranking */}
                <div className="rounded-xl border border-stonks-green/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-4 shadow-sm backdrop-blur-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-bold text-sm text-stonks-light">RARITY RANKING</h4>
                    <Award className="h-4 w-4 text-stonks-accent" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-stonks-light/70 text-xs">RANK:</span>
                      <span className="font-bold text-sm text-stonks-light">
                        #{collectionStats.rarityRank} OF {collectionStats.totalInRarity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-stonks-light/70 text-xs">RARITY %:</span>
                      <span className="font-bold text-sm text-stonks-light">
                        {collectionStats.rarityPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Collection Overview */}
                <div className="rounded-xl border border-stonks-green/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-4 shadow-sm backdrop-blur-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-bold text-sm text-stonks-light">COLLECTION</h4>
                    <Users className="h-4 w-4 text-stonks-green" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-bold text-stonks-light/70 text-xs">TOTAL WOJAKS:</span>
                      <span className="font-bold text-sm text-stonks-light">
                        {collectionStats.totalWojaks}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-stonks-light/70 text-xs">SAME RARITY:</span>
                      <span className="font-bold text-sm text-stonks-light">
                        {collectionStats.totalInRarity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rarity Distribution */}
              <div className="mt-4 rounded-xl border border-stonks-green/20 bg-gradient-to-br from-stonks-darker/60 to-stonks-gray/30 p-4 shadow-sm backdrop-blur-sm">
                <h4 className="mb-3 font-bold text-sm text-stonks-light">RARITY DISTRIBUTION</h4>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {Object.entries(collectionStats.rarityDistribution).map(([rarityType, count]) => (
                    <div key={rarityType} className="text-center">
                      <div className="mb-1 flex justify-center">
                        <RarityBadge rarity={rarityType} size="sm" showIcon={true} />
                      </div>
                      <div className="font-bold text-lg text-stonks-light">{count}</div>
                      <div className="text-stonks-light/50 text-xs">
                        {((count / collectionStats.totalWojaks) * 100).toFixed(1)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
