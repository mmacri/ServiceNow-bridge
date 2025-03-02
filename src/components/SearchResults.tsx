
import React, { useState } from 'react';
import { SearchResult } from '../types/search';
import ResultCard from './ResultCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterIcon } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading, query }) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 flex flex-col items-center justify-center h-40">
        <div className="h-8 w-8 rounded-full border-2 border-servicenow-blue border-t-transparent animate-spin"></div>
        <p className="mt-4 text-gray-500">Searching ServiceNow knowledge...</p>
      </div>
    );
  }
  
  if (results.length === 0 && query) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 p-8 text-center">
        <h3 className="text-xl font-medium text-gray-700 mb-2">No results found</h3>
        <p className="text-gray-500 mb-6">Try a different search term or browse categories below</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {['ITSM', 'HRSD', 'CSM', 'ITOM', 'Platform', 'Security', 'Integration', 'Development'].map((category) => (
            <div 
              key={category}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-servicenow-blue hover:shadow-md transition-all cursor-pointer"
            >
              {category}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null; // Don't show anything if no search has been performed yet
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
        </h2>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Filter by:</span>
          <div className="relative inline-block">
            <button className="p-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 flex items-center">
              <FilterIcon size={16} className="mr-1" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList className="bg-gray-100 p-1 rounded-full grid grid-cols-4 max-w-md mx-auto">
          <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-white">All</TabsTrigger>
          <TabsTrigger value="product" className="rounded-full data-[state=active]:bg-white">Products</TabsTrigger>
          <TabsTrigger value="persona" className="rounded-full data-[state=active]:bg-white">Personas</TabsTrigger>
          <TabsTrigger value="usecase" className="rounded-full data-[state=active]:bg-white">Use Cases</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((result, index) => (
              <ResultCard key={result.id} result={result} index={index} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="product" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results
              .filter(result => result.categories.some(cat => cat.type === 'product'))
              .map((result, index) => (
                <ResultCard key={result.id} result={result} index={index} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="persona" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results
              .filter(result => result.categories.some(cat => cat.type === 'persona'))
              .map((result, index) => (
                <ResultCard key={result.id} result={result} index={index} />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="usecase" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results
              .filter(result => result.categories.some(cat => cat.type === 'usecase'))
              .map((result, index) => (
                <ResultCard key={result.id} result={result} index={index} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchResults;
