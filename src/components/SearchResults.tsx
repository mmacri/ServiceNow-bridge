import React, { useState, useEffect } from 'react';
import { SearchResult } from '../types/search';
import ResultCard from './ResultCard';
import LoginModal from './LoginModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterIcon, LogIn, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
  isLoggedIn: boolean;
  needsLogin: boolean;
  setNeedsLogin: (needsLogin: boolean) => void;
  onLoginSuccess: () => void;
  onLogout: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ 
  results, 
  isLoading, 
  query, 
  isLoggedIn,
  needsLogin,
  setNeedsLogin,
  onLoginSuccess,
  onLogout
}) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  useEffect(() => {
    if (needsLogin) {
      setShowLoginModal(true);
    }
  }, [needsLogin]);
  
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-8 flex flex-col items-center justify-center h-40">
        <div className="h-8 w-8 rounded-full border-2 border-servicenow-blue border-t-transparent animate-spin"></div>
        <p className="mt-4 text-gray-500">Searching ServiceNow knowledge sources...</p>
        <p className="mt-2 text-sm text-gray-400">Querying documentation, community, developer resources, blogs and GitHub...</p>
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

  const predefinedResults = results.filter(result => result.isPredefined);
  const documentationResults = results.filter(result => !result.isPredefined && result.source === 'documentation');
  const communityResults = results.filter(result => !result.isPredefined && result.source === 'community');
  const developerResults = results.filter(result => !result.isPredefined && result.source === 'devsite');
  const blogResults = results.filter(result => !result.isPredefined && result.source === 'blog');
  const githubResults = results.filter(result => !result.isPredefined && result.source === 'github');
  const nowCreateResults = results.filter(result => !result.isPredefined && result.source === 'nowcreate');
  const youtubeResults = results.filter(result => !result.isPredefined && result.source === 'youtube');

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    setNeedsLogin(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {results.length} {results.length === 1 ? 'result' : 'results'} for "{query}"
        </h2>
        
        <div className="flex items-center space-x-2">
          {isLoggedIn ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <LogOut size={16} className="mr-1" />
              <span>Logout</span>
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowLoginModal(true)}
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              <LogIn size={16} className="mr-1" />
              <span>Login for More Results</span>
            </Button>
          )}
          
          <span className="text-sm text-gray-500 ml-2">Filter by:</span>
          <div className="relative inline-block">
            <button className="p-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 flex items-center">
              <FilterIcon size={16} className="mr-1" />
              <span>Filter</span>
            </button>
          </div>
        </div>
      </div>
      
      {predefinedResults.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-servicenow-blue text-white rounded-full text-xs mr-2">✓</span>
            Verified Answers
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {predefinedResults.map((result, index) => (
              <ResultCard 
                key={result.id} 
                result={result} 
                index={index} 
                isLoggedIn={isLoggedIn}
                onLoginRequired={() => setNeedsLogin(true)}
              />
            ))}
          </div>
        </div>
      )}
      
      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList className="bg-gray-100 p-1 rounded-full grid grid-cols-4 max-w-md mx-auto">
          <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-white">All</TabsTrigger>
          <TabsTrigger value="product" className="rounded-full data-[state=active]:bg-white">Products</TabsTrigger>
          <TabsTrigger value="persona" className="rounded-full data-[state=active]:bg-white">Personas</TabsTrigger>
          <TabsTrigger value="usecase" className="rounded-full data-[state=active]:bg-white">Use Cases</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {documentationResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-3">
                Official Documentation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documentationResults.map((result, index) => (
                  <ResultCard 
                    key={result.id} 
                    result={result} 
                    index={index} 
                    isLoggedIn={isLoggedIn}
                    onLoginRequired={() => setNeedsLogin(true)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {communityResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-3">
                Community Discussions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {communityResults.map((result, index) => (
                  <ResultCard 
                    key={result.id} 
                    result={result} 
                    index={index} 
                    isLoggedIn={isLoggedIn}
                    onLoginRequired={() => setNeedsLogin(true)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {developerResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-3">
                Developer Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {developerResults.map((result, index) => (
                  <ResultCard 
                    key={result.id} 
                    result={result} 
                    index={index} 
                    isLoggedIn={isLoggedIn}
                    onLoginRequired={() => setNeedsLogin(true)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {nowCreateResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-3">
                Now Create Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nowCreateResults.map((result, index) => (
                  <ResultCard 
                    key={result.id} 
                    result={result} 
                    index={index}
                    isLoggedIn={isLoggedIn} 
                    onLoginRequired={() => setNeedsLogin(true)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {youtubeResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-3">
                YouTube Videos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {youtubeResults.map((result, index) => (
                  <ResultCard 
                    key={result.id} 
                    result={result} 
                    index={index}
                    isLoggedIn={isLoggedIn} 
                    onLoginRequired={() => setNeedsLogin(true)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {blogResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-3">
                Blog Articles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogResults.map((result, index) => (
                  <ResultCard 
                    key={result.id} 
                    result={result} 
                    index={index}
                    isLoggedIn={isLoggedIn} 
                    onLoginRequired={() => setNeedsLogin(true)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {githubResults.length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-3">
                GitHub Repositories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {githubResults.map((result, index) => (
                  <ResultCard 
                    key={result.id} 
                    result={result} 
                    index={index}
                    isLoggedIn={isLoggedIn} 
                    onLoginRequired={() => setNeedsLogin(true)}
                  />
                ))}
              </div>
            </div>
          )}
          
          {results.filter(r => 
            !r.isPredefined && 
            r.source !== 'documentation' && 
            r.source !== 'community' && 
            r.source !== 'devsite' && 
            r.source !== 'blog' &&
            r.source !== 'github' &&
            r.source !== 'nowcreate' &&
            r.source !== 'youtube'
          ).length > 0 && (
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-700 mb-3">
                Other Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results
                  .filter(r => 
                    !r.isPredefined && 
                    r.source !== 'documentation' && 
                    r.source !== 'community' && 
                    r.source !== 'devsite' && 
                    r.source !== 'blog' &&
                    r.source !== 'github' &&
                    r.source !== 'nowcreate' &&
                    r.source !== 'youtube'
                  )
                  .map((result, index) => (
                    <ResultCard 
                      key={result.id} 
                      result={result} 
                      index={index}
                      isLoggedIn={isLoggedIn} 
                      onLoginRequired={() => setNeedsLogin(true)}
                    />
                  ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="product" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results
              .filter(result => result.categories.some(cat => cat.type === 'product'))
              .map((result, index) => (
                <ResultCard 
                  key={result.id} 
                  result={result} 
                  index={index}
                  isLoggedIn={isLoggedIn} 
                  onLoginRequired={() => setNeedsLogin(true)}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="persona" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results
              .filter(result => result.categories.some(cat => cat.type === 'persona'))
              .map((result, index) => (
                <ResultCard 
                  key={result.id} 
                  result={result} 
                  index={index}
                  isLoggedIn={isLoggedIn} 
                  onLoginRequired={() => setNeedsLogin(true)}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="usecase" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results
              .filter(result => result.categories.some(cat => cat.type === 'usecase'))
              .map((result, index) => (
                <ResultCard 
                  key={result.id} 
                  result={result} 
                  index={index}
                  isLoggedIn={isLoggedIn} 
                  onLoginRequired={() => setNeedsLogin(true)}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={handleCloseLoginModal} 
        onSuccess={onLoginSuccess} 
      />
    </div>
  );
};

export default SearchResults;
