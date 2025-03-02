
import React from 'react';
import { BookmarkIcon, User2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  isScrolled: boolean;
}

const Header: React.FC<HeaderProps> = ({ isScrolled }) => {
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 md:px-8",
      isScrolled 
        ? "bg-white/80 backdrop-blur-lg shadow-sm py-3" 
        : "bg-transparent py-5"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-servicenow-blue mr-1">
            ServiceNow
          </div>
          <div className={cn(
            "text-sm font-medium px-2 py-0.5 rounded-full transition-all duration-300",
            isScrolled ? "bg-servicenow-blue text-white" : "bg-white/90 text-servicenow-blue"
          )}>
            Knowledge
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Bookmarks">
            <BookmarkIcon size={20} className="text-gray-700" />
          </button>
          
          <button className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Account">
            <User2Icon size={20} className="text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
