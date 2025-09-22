import { wojakParts } from '../data/wojakParts';
import type { WojakCharacter } from '../types/wojak';

export const generateRandomWojak = (): WojakCharacter => {
  const getRandomOption = (category: string) => {
    const part = wojakParts.find((p) => p.category === category);
    if (!part) return null;

    const options = part.options;
    if (options.length === 0) return null;
    return options[Math.floor(Math.random() * options.length)];
  };

  const getRandomBackgroundColor = () => {
    const bgColors = ['#FFFFFF', '#F7E98E', '#FFB6C1', '#87CEEB', '#98FB98', '#DDA0DD'];
    return bgColors[Math.floor(Math.random() * bgColors.length)];
  };

  const getRandomPatternColor = () => {
    const patternColors = [
      '#000000',
      '#333333',
      '#666666',
      '#999999',
      '#CCCCCC',
      '#FFFFFF',
      '#FF0000',
      '#00FF00',
      '#0000FF',
      '#FFFF00',
      '#FF00FF',
      '#00FFFF',
    ];
    return patternColors[Math.floor(Math.random() * patternColors.length)];
  };

  const template = getRandomOption('template')?.value || 'Standard';
  const hat = getRandomOption('hats')?.value || 'none';
  const glasses = getRandomOption('glasses')?.value || 'none';
  const mask = getRandomOption('masks')?.value || 'none';
  const backgroundPattern = getRandomOption('background')?.value || 'solid';

  return {
    id: `wojak_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: generateRandomName(),
    template: template as string,
    hat: hat as string,
    glasses: glasses as string,
    mask: mask as string,
    background: {
      color: getRandomBackgroundColor(),
      pattern: backgroundPattern as WojakCharacter['background']['pattern'],
      patternColor:
        backgroundPattern !== 'solid' && backgroundPattern !== 'gradient'
          ? getRandomPatternColor()
          : undefined,
    },
    createdAt: new Date(),
  };
};

const generateRandomName = (): string => {
  const prefixes = [
    'Chad',
    'Virgin',
    'Wojak',
    'Pepe',
    'Doge',
    'Based',
    'Cringe',
    'Sigma',
    'Alpha',
    'Beta',
    'Giga',
    'Mega',
    'Ultra',
    'Super',
    'Hyper',
    'Turbo',
  ];

  const suffixes = [
    'Master',
    'Lord',
    'King',
    'God',
    'Legend',
    'Champ',
    'Boss',
    'Chief',
    'Warrior',
    'Knight',
    'Wizard',
    'Mage',
    'Hero',
    'Villain',
    'Beast',
    'Monster',
  ];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  return `${prefix} ${suffix}`;
};
