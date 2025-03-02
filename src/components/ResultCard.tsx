
import React, { useState } from 'react';
import { SearchResult } from '../types/search';
import { getSourceInfo } from '../utils/searchUtils';
import CategoryChip from './CategoryChip';
import { BookmarkIcon, ShareIcon, ExternalLinkIcon, LockIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  result: SearchResult;
  index: number;
  isLoggedIn: boolean;
  onLoginRequired: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, index, isLoggedIn, onLoginRequired }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const sourceInfo = getSourceInfo(result.source);
  const isLoginRequired = result.source === 'nowcreate' && !isLoggedIn;
  
  // Calculate animation delay based on index
  const delay = `${0.1 + index * 0.05}s`;

  const handleViewClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isLoginRequired) {
      event.preventDefault();
      onLoginRequired();
    }
  };

  return (
    <div 
      className={cn(
        "relative bg-white rounded-lg border overflow-hidden hover-lift group",
        "opacity-0 animate-staggered-enter",
        isLoginRequired ? "border-yellow-300" : ""
      )}
      style={{ '--animation-delay': delay } as React.CSSProperties}
    >
      {result.isPredefined && (
        <div className="absolute top-0 right-0 bg-servicenow-blue text-white px-2 py-1 text-xs font-medium rounded-bl">
          Verified Answer
        </div>
      )}
      
      {isLoginRequired && (
        <div className="absolute top-0 right-0 bg-yellow-500 text-white px-2 py-1 text-xs font-medium rounded-bl flex items-center">
          <LockIcon size={12} className="mr-1" />
          Login Required
        </div>
      )}
      
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sourceInfo.color} mb-2`}>
              {sourceInfo.name}
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-900 leading-tight">{result.title}</h3>
          </div>
          
          <button 
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label={isBookmarked ? "Remove bookmark" : "Bookmark this result"}
          >
            <BookmarkIcon 
              size={18} 
              className={cn(
                "transition-colors",
                isBookmarked ? "fill-servicenow-blue text-servicenow-blue" : "text-gray-400"
              )}
            />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {isLoginRequired 
            ? `${result.snippet.substring(0, 100)}... (Login required to view full content)`
            : result.snippet
          }
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {result.categories.map((category, idx) => (
            <CategoryChip key={idx} category={category} />
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-2 border-t">
          {isLoginRequired ? (
            <button
              onClick={onLoginRequired}
              className="text-servicenow-blue hover:text-servicenow-darkblue text-sm font-medium inline-flex items-center transition-colors"
            >
              Login to View <LockIcon size={14} className="ml-1" />
            </button>
          ) : (
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-servicenow-blue hover:text-servicenow-darkblue text-sm font-medium inline-flex items-center transition-colors"
              onClick={handleViewClick}
            >
              View Full Article <ExternalLinkIcon size={14} className="ml-1" />
            </a>
          )}
          
          <button 
            className="p-2 text-gray-500 hover:text-servicenow-blue rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Share this result"
          >
            <ShareIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
