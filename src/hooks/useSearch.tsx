
import { useState, useCallback, useEffect } from 'react';
import { SearchResult } from '../types/search';
import { performSearch } from '../utils/searchUtils';
import ServiceNowDataService from '../services/ServiceNowDataService';
import { toast } from 'sonner';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount
  useEffect(() => {
    const dataService = ServiceNowDataService.getInstance();
    setIsLoggedIn(dataService.isLoggedIn());
  }, []);

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
        
        try {
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
        } catch (err: any) {
          // Check if error is due to login required
          if (err.message && err.message.includes('login required')) {
            setNeedsLogin(true);
            toast.error('Some results require ServiceNow login for access', {
              action: {
                label: 'Login',
                onClick: () => setNeedsLogin(true)
              }
            });
          } else {
            throw err; // Re-throw for general error handling
          }
          
          // Still display predefined results even if external search fails
          setResults(predefinedResults);
        }
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

  // Handle login status changes
  useEffect(() => {
    const dataService = ServiceNowDataService.getInstance();
    setIsLoggedIn(dataService.isLoggedIn());
    
    // If user just logged in and had an active search, refresh results
    if (isLoggedIn && debouncedQuery) {
      handleSearch(debouncedQuery);
    }
  }, [isLoggedIn, debouncedQuery]);

  const handleSearch = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  const handleLoginSuccess = useCallback(() => {
    setIsLoggedIn(true);
    setNeedsLogin(false);
    
    // Refresh search with current query to get authenticated results
    if (debouncedQuery) {
      // Slightly delay the search to allow login state to propagate
      setTimeout(() => handleSearch(debouncedQuery), 100);
    }
  }, [debouncedQuery, handleSearch]);

  const handleLogout = useCallback(() => {
    const dataService = ServiceNowDataService.getInstance();
    dataService.logout();
    setIsLoggedIn(false);
    toast.info('Logged out from ServiceNow');
    
    // Refresh search with current query to adjust results for non-authenticated state
    if (debouncedQuery) {
      handleSearch(debouncedQuery);
    }
  }, [debouncedQuery, handleSearch]);

  return {
    query,
    results,
    isLoading,
    error,
    handleSearch,
    clearSearch,
    needsLogin,
    setNeedsLogin,
    isLoggedIn,
    handleLoginSuccess,
    handleLogout
  };
}

export default useSearch;
