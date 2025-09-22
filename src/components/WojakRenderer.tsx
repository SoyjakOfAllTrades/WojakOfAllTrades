import type React from 'react';
import type { WojakCharacter } from '../types/wojak';

interface WojakRendererProps {
  wojak: WojakCharacter;
}

export const WojakRenderer: React.FC<WojakRendererProps> = ({ wojak }) => {
  const getTemplateImage = () => {
    // Handle special case for NPC which has .PNG extension
    if (wojak.template === 'NPC') {
      return `/wojak-parts/template/NPC.PNG`;
    }
    return `/wojak-parts/template/${wojak.template}.png`;
  };

  const getHatImage = () => {
    return wojak.hat !== 'none'
      ? `/wojak-parts/accessories and clothing/hats/${wojak.hat}.png`
      : null;
  };

  const getGlassesImage = () => {
    return wojak.glasses !== 'none'
      ? `/wojak-parts/accessories and clothing/glasses/${wojak.glasses}.png`
      : null;
  };

  const getMaskImage = () => {
    return wojak.mask !== 'none'
      ? `/wojak-parts/accessories and clothing/masks/${wojak.mask}.png`
      : null;
  };

  const getBackgroundStyle = () => {
    const baseStyle = {
      backgroundColor: wojak.background.color,
    };

    switch (wojak.background.pattern) {
      case 'gradient':
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${wojak.background.color} 0%, ${wojak.background.gradientTo || '#FFFFFF'} 50%, ${wojak.background.color} 100%)`,
          boxShadow: `inset 0 0 50px ${wojak.background.color}20, 0 0 30px ${wojak.background.gradientTo || '#FFFFFF'}10`,
        };
      case 'stonks':
        return {
          backgroundImage: `url('/wojak-parts/backgrounds/stonks.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
      case 'not-stonks':
        return {
          backgroundImage: `url('/wojak-parts/backgrounds/not stonks.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
      case 'stars':
        return {
          ...baseStyle,
          backgroundImage: `
            radial-gradient(4px 4px at 15px 25px, ${wojak.background.patternColor || '#fff'}, transparent),
            radial-gradient(4px 4px at 35px 60px, ${wojak.background.patternColor || '#fff'}, transparent),
            radial-gradient(3px 3px at 75px 35px, ${wojak.background.patternColor || '#fff'}, transparent),
            radial-gradient(3px 3px at 110px 70px, ${wojak.background.patternColor || '#fff'}, transparent),
            radial-gradient(4px 4px at 140px 25px, ${wojak.background.patternColor || '#fff'}, transparent),
            radial-gradient(3px 3px at 170px 50px, ${wojak.background.patternColor || '#fff'}, transparent),
            radial-gradient(2px 2px at 50px 10px, ${wojak.background.patternColor || '#fff'}, transparent),
            radial-gradient(2px 2px at 90px 80px, ${wojak.background.patternColor || '#fff'}, transparent)
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '120px 60px',
          boxShadow: `inset 0 0 30px ${wojak.background.patternColor || '#fff'}20`,
        };
      case 'matrix':
        return {
          ...baseStyle,
          backgroundImage: `
            linear-gradient(90deg, ${wojak.background.patternColor || '#00ff00'} 1px, transparent 1px),
            linear-gradient(0deg, ${wojak.background.patternColor || '#00ff00'} 1px, transparent 1px),
            radial-gradient(circle at 20px 20px, ${wojak.background.patternColor || '#00ff00'} 2px, transparent 2px)
          `,
          backgroundSize: '20px 20px, 20px 20px, 20px 20px',
          boxShadow: `inset 0 0 25px ${wojak.background.patternColor || '#00ff00'}60, 0 0 15px ${wojak.background.patternColor || '#00ff00'}40`,
        };
      case 'synthwave':
        return {
          ...baseStyle,
          background: `linear-gradient(135deg, ${wojak.background.color} 0%, ${wojak.background.patternColor || '#ff0080'} 25%, ${wojak.background.patternColor || '#00ffff'} 50%, ${wojak.background.patternColor || '#ff0080'} 75%, ${wojak.background.color} 100%)`,
          boxShadow: `inset 0 0 40px ${wojak.background.patternColor || '#ff0080'}30, 0 0 30px ${wojak.background.patternColor || '#00ffff'}20`,
        };
      case 'moon':
        return {
          ...baseStyle,
          backgroundImage: `
            radial-gradient(circle at 30% 30%, ${wojak.background.patternColor || '#c0c0c0'} 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, ${wojak.background.patternColor || '#e6e6e6'} 0%, transparent 30%),
            radial-gradient(circle at 50% 50%, ${wojak.background.patternColor || '#f0f0f0'} 0%, transparent 20%)
          `,
          backgroundSize: '100px 100px, 80px 80px, 60px 60px',
          backgroundPosition: '0 0, 20px 20px, 40px 40px',
          boxShadow: `inset 0 0 30px ${wojak.background.patternColor || '#c0c0c0'}40`,
        };
      case 'cyberpunk':
        return {
          ...baseStyle,
          backgroundImage: `
            linear-gradient(90deg, ${wojak.background.patternColor || '#ff0080'} 3px, transparent 3px),
            linear-gradient(0deg, ${wojak.background.patternColor || '#ff0080'} 3px, transparent 3px),
            radial-gradient(circle at 20px 20px, ${wojak.background.patternColor || '#ff0080'} 4px, transparent 4px),
            radial-gradient(circle at 40px 40px, ${wojak.background.patternColor || '#00ffff'} 4px, transparent 4px),
            linear-gradient(45deg, ${wojak.background.patternColor || '#ff0080'} 2px, transparent 2px),
            linear-gradient(-45deg, ${wojak.background.patternColor || '#00ffff'} 2px, transparent 2px),
            radial-gradient(circle at 10px 10px, ${wojak.background.patternColor || '#ff0080'} 2px, transparent 2px),
            radial-gradient(circle at 30px 30px, ${wojak.background.patternColor || '#00ffff'} 2px, transparent 2px)
          `,
          backgroundSize:
            '35px 35px, 35px 35px, 35px 35px, 35px 35px, 17px 17px, 17px 17px, 8px 8px, 8px 8px',
          backgroundPosition: '0 0, 0 0, 0 0, 0 0, 8px 8px, 8px 8px, 4px 4px, 12px 12px',
          boxShadow: `inset 0 0 40px ${wojak.background.patternColor || '#ff0080'}60, 0 0 25px ${wojak.background.patternColor || '#00ffff'}40, 0 0 50px ${wojak.background.patternColor || '#ff0080'}20`,
        };
      default: // solid
        return baseStyle;
    }
  };

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border-4 border-black/20"
      style={getBackgroundStyle()}
    >
      {/* Wojak Character Container - Scaled down to show more background, anchored to bottom */}
      <div className="-translate-x-1/2 absolute bottom-0 left-1/2 z-10 h-3/4 w-3/4 transform">
        {/* Base Template */}
        <img
          src={getTemplateImage()}
          alt={`${wojak.template} wojak`}
          className="absolute h-full w-full object-contain"
        />

        {/* Hat Layer */}
        {getHatImage() && (
          <img
            src={getHatImage()}
            alt="hat"
            className="absolute z-20 h-full w-full object-contain"
          />
        )}

        {/* Glasses Layer */}
        {getGlassesImage() && (
          <img
            src={getGlassesImage()}
            alt="glasses"
            className="absolute z-30 h-full w-full object-contain"
          />
        )}

        {/* Mask Layer */}
        {getMaskImage() && (
          <img
            src={getMaskImage()}
            alt="mask"
            className="absolute z-40 h-full w-full object-contain"
          />
        )}
      </div>
    </div>
  );
};
