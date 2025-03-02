
import { useState, useCallback, useEffect } from 'react';
import { SearchResult } from '../types/search';
import { performSearch } from '../utils/searchUtils';
import ServiceNowDataService from '../services/ServiceNowDataService';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce the search query to avoid excessive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // Perform the search when the debounced query changes
  useEffect(() => {
    const search = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Get predefined results from local data first
        const predefinedResults = await performSearch(debouncedQuery);
        
        // Then fetch from external sources using our service
        const dataService = ServiceNowDataService.getInstance();
        const externalResults = await dataService.searchAll(debouncedQuery);
        
        // Combine results, ensuring predefined ones come first
        const combinedResults = [
          ...predefinedResults,
          ...externalResults.filter(extResult => 
            !predefinedResults.some(preResult => 
              preResult.title.toLowerCase() === extResult.title.toLowerCase()
            )
          )
        ];
        
        setResults(combinedResults);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to perform search. Please try again.');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    search();
  }, [debouncedQuery]);

  const handleSearch = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return {
    query,
    results,
    isLoading,
    error,
    handleSearch,
    clearSearch
  };
}

export default useSearch;
