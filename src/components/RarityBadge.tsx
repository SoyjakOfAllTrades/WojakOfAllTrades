import { Crown, Gem, Star, Trophy, Zap } from 'lucide-react';
import type React from 'react';

interface RarityBadgeProps {
  rarity: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RarityBadge: React.FC<RarityBadgeProps> = ({
  rarity,
  showIcon = true,
  size = 'md',
  className = '',
}) => {
  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return <Crown className="h-3 w-3" />;
      case 'epic':
        return <Gem className="h-3 w-3" />;
      case 'rare':
        return <Zap className="h-3 w-3" />;
      case 'uncommon':
        return <Star className="h-3 w-3" />;
      default:
        return <Trophy className="h-3 w-3" />;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const getRarityClasses = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'bg-stonks-orange/20 text-white border-stonks-orange/40';
      case 'epic':
        return 'bg-stonks-purple/20 text-white border-stonks-purple/40';
      case 'rare':
        return 'bg-stonks-blue/20 text-white border-stonks-blue/40';
      case 'uncommon':
        return 'bg-stonks-green/20 text-white border-stonks-green/40';
      default:
        return 'bg-stonks-light/20 text-white border-stonks-light/40';
    }
  };

  const baseClasses = `inline-flex items-center space-x-1 rounded font-bold border transition-all duration-200 ${getSizeClasses()} ${getRarityClasses(rarity)} ${className}`;

  return (
    <div className={baseClasses}>
      {showIcon && getRarityIcon(rarity)}
      <span>{rarity.toUpperCase()}</span>
    </div>
  );
};
