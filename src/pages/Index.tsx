
import React from 'react';
import SearchBar from '../components/SearchBar';
import SearchResults from '../components/SearchResults';
import useSearch from '../hooks/useSearch';

const Index = () => {
  const { 
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
  } = useSearch();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">ServiceNow Knowledge Assistant</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get instant answers to your ServiceNow questions from documentation, community, blogs, and more.
        </p>
      </div>
      
      <SearchBar 
        query={query} 
        onSearch={handleSearch} 
        onClear={clearSearch}
        isLoggedIn={isLoggedIn}
      />
      
      {error && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-lg max-w-3xl mx-auto">
          <p>{error}</p>
          <button 
            className="mt-2 text-sm underline"
            onClick={() => handleSearch(query)}
          >
            Try again
          </button>
        </div>
      )}
      
      <SearchResults 
        results={results} 
        isLoading={isLoading} 
        query={query}
        isLoggedIn={isLoggedIn}
        needsLogin={needsLogin}
        setNeedsLogin={setNeedsLogin}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default Index;
