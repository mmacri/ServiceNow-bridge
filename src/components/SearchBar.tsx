
import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, X } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface SearchBarProps {
  onSearch: (query: string) => void;
  value: string;
  isLoading?: boolean;
  onClear?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  value, 
  isLoading = false,
  onClear
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value);
    }
  };

  const handleVoiceSearch = () => {
    // In a real implementation, this would use the Web Speech API
    setIsListening(true);
    
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      toast.info("Voice search is not implemented in this demo");
    }, 2000);
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div 
      className={`
        relative w-full max-w-2xl mx-auto transition-all duration-300 ease-in-out
        ${isFocused ? 'scale-[1.02]' : 'scale-100'}
      `}
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className={`
          relative flex items-center rounded-full border bg-white shadow-sm
          ${isFocused ? 'ring-2 ring-servicenow-blue ring-opacity-70' : ''}
          transition-all duration-300 ease-in-out
        `}>
          <div className="flex items-center justify-center h-12 w-12 text-gray-400">
            <Search size={20} className="text-gray-500" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Ask anything about ServiceNow..."
            className="flex-1 h-12 bg-transparent outline-none text-gray-900 placeholder-gray-400 text-base"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          
          {value && !isLoading && (
            <button 
              type="button"
              onClick={handleClear}
              className="h-12 w-12 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
          
          <button 
            type="button"
            onClick={handleVoiceSearch}
            className={`
              h-12 w-12 flex items-center justify-center rounded-r-full
              transition-colors duration-300 
              ${isListening ? 'text-red-500 animate-pulse-subtle' : 'text-gray-400 hover:text-servicenow-blue'}
            `}
            aria-label="Search by voice"
          >
            <Mic size={20} />
          </button>
        </div>
        
        {/* Search button for larger screens */}
        <button
          type="submit"
          className={`
            absolute right-0 hidden md:flex items-center justify-center h-12 px-6 m-[2px] rounded-full 
            bg-servicenow-blue text-white font-medium
            transition-all duration-300 ease-in-out
            hover:bg-servicenow-darkblue
            ${value.trim() ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
          disabled={!value.trim() || isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      <div className="mt-2 text-xs text-center text-gray-500">
        <p>Try: "ITSM best practices", "Integrate with Azure", "Flow Designer examples"</p>
      </div>
    </div>
  );
};

export default SearchBar;
