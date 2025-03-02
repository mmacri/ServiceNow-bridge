
import React from 'react';
import { CategoryTag, Category } from '../types/search';
import { getCategoryInfo } from '../utils/searchUtils';
import { cn } from '@/lib/utils';

interface CategoryChipProps {
  category: CategoryTag;
  className?: string;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ category, className }) => {
  const { icon, color } = getCategoryInfo(category);

  return (
    <div 
      className={cn(
        `inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`,
        'transition-all duration-300 ease-in-out hover:shadow-md',
        className
      )}
    >
      <span className="mr-1">{category.name}</span>
    </div>
  );
};

export default CategoryChip;
