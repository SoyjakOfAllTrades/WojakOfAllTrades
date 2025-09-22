import { Crown, Eye, Image, Smile, Users } from 'lucide-react';
import type React from 'react';

interface CategoryTabsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: 'template', name: 'Template', icon: Users },
  { id: 'hats', name: 'Hats', icon: Crown },
  { id: 'glasses', name: 'Glasses', icon: Eye },
  { id: 'masks', name: 'Masks', icon: Smile },
  { id: 'background', name: 'Background', icon: Image },
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div>
      <div className="grid grid-cols-5 gap-2">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;

          return (
            <button
              type="button"
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex transform flex-col items-center rounded-xl p-4 transition-all duration-200 ${
                isSelected
                  ? 'stonks-glow scale-105 border-2 border-stonks-accent bg-stonks-accent/20 text-stonks-accent shadow-lg'
                  : 'border-2 border-stonks-gray/20 bg-stonks-gray/10 text-stonks-light/60 hover:scale-105 hover:border-stonks-accent/30 hover:bg-stonks-accent/10 hover:text-stonks-accent/80'
              }
              `}
            >
              <Icon className="mb-2 h-6 w-6" />
              <span className="font-medium text-sm">{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="mt-4">
        <div className="h-px bg-gradient-to-r from-transparent via-stonks-green/30 to-transparent"></div>
      </div>
    </div>
  );
};
