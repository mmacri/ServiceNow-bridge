
import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import useSearch from '@/hooks/useSearch';
import { ArrowDownIcon } from 'lucide-react';

const Index = () => {
  const { query, results, isLoading, handleSearch, clearSearch } = useSearch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(true);
  
  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Hide search bar when scrolling down on results page
      if (results.length > 0) {
        if (window.scrollY > 300) {
          setShowSearchBar(false);
        } else {
          setShowSearchBar(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [results.length]);
  
  // Determine layout based on results
  const isHomeLayout = results.length === 0;
  
  return (
    <div className="min-h-screen flex flex-col bg-snow-100">
      <Header isScrolled={isScrolled} />
      
      <main className="flex-1 pt-20">
        {isHomeLayout ? (
          <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-2xl mx-auto text-center mb-8 animate-slide-up">
              <div className="inline-flex items-center mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mr-2">
                  ServiceNow
                </h1>
                <div className="text-lg font-medium px-3 py-1 rounded-full bg-servicenow-blue text-white">
                  Knowledge
                </div>
              </div>
              
              <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
                Your intelligent assistant for all ServiceNow knowledge.
              </p>
              
              <div className="mb-12">
                <SearchBar 
                  onSearch={handleSearch}
                  value={query}
                  isLoading={isLoading}
                  onClear={clearSearch}
                />
              </div>
              
              <div className="absolute bottom-20 left-0 right-0 flex justify-center animate-bounce-subtle">
                <ArrowDownIcon size={24} className="text-gray-400" />
              </div>
            </div>
            
            <div className="w-full max-w-4xl mx-auto mt-8 px-4">
              <h2 className="text-xl font-semibold text-center text-gray-800 mb-6">
                Popular Topics
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 staggered-list">
                {[
                  { name: 'ITSM', description: 'Service Management' },
                  { name: 'Integration', description: 'Connect systems' },
                  { name: 'Development', description: 'Build on Platform' },
                  { name: 'CMDB', description: 'Asset Management' },
                  { name: 'Flow Designer', description: 'No-code workflows' },
                  { name: 'Performance', description: 'Optimization tips' },
                  { name: 'Mobile', description: 'On-the-go access' },
                  { name: 'Security', description: 'Best practices' },
                ].map((topic, index) => (
                  <div 
                    key={topic.name}
                    className="p-4 bg-white rounded-lg border border-gray-200 hover:border-servicenow-blue hover:shadow-md transition-all cursor-pointer hover-lift"
                    onClick={() => handleSearch(topic.name)}
                  >
                    <h3 className="font-medium text-gray-900">{topic.name}</h3>
                    <p className="text-sm text-gray-500">{topic.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 pt-4 md:pt-10">
            <div 
              className={`
                transition-all duration-500 ease-in-out overflow-hidden
                ${showSearchBar ? 'max-h-24 opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}
              `}
            >
              <SearchBar 
                onSearch={handleSearch}
                value={query}
                isLoading={isLoading}
                onClear={clearSearch}
              />
            </div>
            
            <SearchResults 
              results={results}
              isLoading={isLoading}
              query={query}
            />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
