export interface WojakCharacter {
  id: string;
  name: string;
  template: string;
  hat: string;
  glasses: string;
  mask: string;
  background: {
    color: string;
    pattern:
      | 'solid'
      | 'gradient'
      | 'stonks'
      | 'not-stonks'
      | 'stars'
      | 'matrix'
      | 'synthwave'
      | 'moon'
      | 'cyberpunk';
    gradientTo?: string;
    patternColor?: string;
  };
  createdAt: Date;
}

export interface WojakPart {
  id: string;
  name: string;
  category: 'template' | 'hats' | 'glasses' | 'masks' | 'background';
  options: WojakOption[];
}

export interface WojakOption {
  id: string;
  name: string;
  value: string;
  preview: string; // SVG path or emoji
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'exotic';
}
