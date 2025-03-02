
import React, { useState, useRef } from 'react';
import { Search, Mic, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  query: string;
  onSearch: (query: string) => void;
  onClear: () => void;
  isLoggedIn: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onSearch, onClear, isLoggedIn }) => {
  const [localQuery, setLocalQuery] = useState(query);
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localQuery.trim()) {
      onSearch(localQuery);
    }
  };
  
  const handleClear = () => {
    setLocalQuery('');
    onClear();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleVoiceSearch = () => {
    // Check if Speech Recognition is available
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice search is not supported in your browser');
      return;
    }
    
    // This is a simple implementation, in a real app we'd use proper types
    // and possibly a library to handle browser compatibility
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      setIsListening(true);
      
      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setLocalQuery(speechResult);
        onSearch(speechResult);
        setIsListening(false);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        toast.error('Voice recognition failed, please try again');
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    } catch (error) {
      console.error('Speech recognition error', error);
      toast.error('Failed to start voice recognition');
      setIsListening(false);
    }
  };

  return (
    <div className={`w-full max-w-3xl mx-auto transition-all ${isFocused ? 'scale-105' : ''}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-gray-500">
            <Search size={20} />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            className="w-full h-14 pl-12 pr-28 text-lg rounded-full border border-gray-300 focus:border-servicenow-blue focus:ring-2 focus:ring-servicenow-blue/30 focus:outline-none shadow-sm"
            placeholder="Ask me anything about ServiceNow..."
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          
          <div className="absolute right-4 flex items-center space-x-2">
            {localQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
            
            <button
              type="button"
              onClick={handleVoiceSearch}
              className={`p-2 rounded-full ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-gray-500 hover:text-gray-700'}`}
              aria-label="Voice search"
              disabled={isListening}
            >
              <Mic size={20} />
            </button>
            
            <Button 
              type="submit"
              className="bg-servicenow-blue hover:bg-servicenow-darkblue"
              disabled={!localQuery.trim()}
            >
              Search
            </Button>
          </div>
        </div>
      </form>
      
      {isLoggedIn && (
        <div className="mt-2 text-xs text-right text-green-600 font-medium">
          Logged in • Additional premium content available
        </div>
      )}
    </div>
  );
};

export default SearchBar;
