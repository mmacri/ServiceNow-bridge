import { SearchResult, Source, Category } from '../types/search';

/**
 * ServiceNowDataService handles fetching and processing data from various ServiceNow knowledge sources
 */
export class ServiceNowDataService {
  private static instance: ServiceNowDataService;
  private cache: Map<string, { results: SearchResult[], timestamp: number }> = new Map();
  private cacheDuration = 1000 * 60 * 30; // 30 minutes cache
  private userLoggedIn: boolean = false;
  private sessionToken: string | null = null;

  private constructor() {}

  public static getInstance(): ServiceNowDataService {
    if (!ServiceNowDataService.instance) {
      ServiceNowDataService.instance = new ServiceNowDataService();
    }
    return ServiceNowDataService.instance;
  }

  /**
   * Set user login status and session token for authenticated requests
   */
  public setAuth(loggedIn: boolean, token: string | null = null): void {
    this.userLoggedIn = loggedIn;
    this.sessionToken = token;
    console.log(`Auth status updated: ${loggedIn ? 'Logged in' : 'Logged out'}`);
  }

  /**
   * Check if user is logged in
   */
  public isLoggedIn(): boolean {
    return this.userLoggedIn;
  }

  /**
   * Search across all ServiceNow knowledge sources
   */
  public async searchAll(query: string): Promise<SearchResult[]> {
    if (!query.trim()) {
      return [];
    }

    // Check cache first
    const cacheKey = query.toLowerCase().trim();
    const cachedResults = this.getCachedResults(cacheKey);
    if (cachedResults) {
      console.log('Returning cached results for:', query);
      return cachedResults;
    }

    console.log('Fetching fresh results for:', query);

    try {
      // Fetch from all sources in parallel
      const results = await Promise.all([
        this.searchDocumentation(query),
        this.searchCommunity(query),
        this.searchDeveloperSite(query),
        this.searchBlog(query),
        this.searchYouTube(query),
        this.searchGitHub(query),
        this.searchNowCreate(query)
      ]);

      // Flatten and sort results
      const allResults = results.flat().sort((a, b) => {
        // First, sort by predefined solutions (they should come first)
        if (a.isPredefined && !b.isPredefined) return -1;
        if (!a.isPredefined && b.isPredefined) return 1;
        
        // Then sort by relevance score (if available)
        return 0;
      });

      // Cache the results
      this.cacheResults(cacheKey, allResults);
      
      return allResults;
    } catch (error) {
      console.error('Error searching all sources:', error);
      throw new Error('Failed to search ServiceNow knowledge sources');
    }
  }

  /**
   * Search ServiceNow documentation
   */
  private async searchDocumentation(query: string): Promise<SearchResult[]> {
    try {
      // In a real implementation, we need to use a proxy or a service that handles CORS
      // For docs.servicenow.com, construct a search URL
      const searchUrl = `https://cors-anywhere.herokuapp.com/https://docs.servicenow.com/search?q=${encodeURIComponent(query)}`;
      
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Origin': window.location.origin
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching documentation: ${response.status}`);
      }

      // Parse the HTML response to extract search results
      const html = await response.text();
      
      // This is a simplified example - in a real implementation, we would need
      // proper HTML parsing to extract search results
      const results: SearchResult[] = [];
      
      // Extract search results from HTML using regex or DOM parsing
      // This is a placeholder for the actual implementation
      const resultItems = this.extractDocumentationResults(html);
      
      return resultItems.map((item, index) => ({
        id: `docs-${Date.now()}-${index}`,
        title: item.title,
        snippet: item.snippet,
        url: item.url,
        source: Source.Documentation,
        categories: this.extractCategories(item.title, item.snippet),
        isPredefined: false
      }));
    } catch (error) {
      console.error('Error searching documentation:', error);
      return [];
    }
  }

  /**
   * Search ServiceNow community
   */
  private async searchCommunity(query: string): Promise<SearchResult[]> {
    try {
      // Similar to documentation search, but for community.servicenow.com
      const searchUrl = `https://cors-anywhere.herokuapp.com/https://community.servicenow.com/community?id=community_search&q=${encodeURIComponent(query)}`;
      
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Origin': window.location.origin
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching community: ${response.status}`);
      }

      const html = await response.text();
      const resultItems = this.extractCommunityResults(html);
      
      return resultItems.map((item, index) => ({
        id: `community-${Date.now()}-${index}`,
        title: item.title,
        snippet: item.snippet,
        url: item.url,
        source: Source.Community,
        categories: this.extractCategories(item.title, item.snippet),
        isPredefined: false
      }));
    } catch (error) {
      console.error('Error searching community:', error);
      return [];
    }
  }

  /**
   * Search ServiceNow developer site
   */
  private async searchDeveloperSite(query: string): Promise<SearchResult[]> {
    try {
      // For developer.servicenow.com
      const searchUrl = `https://cors-anywhere.herokuapp.com/https://developer.servicenow.com/dev.do#!/search?q=${encodeURIComponent(query)}`;
      
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Origin': window.location.origin
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching developer site: ${response.status}`);
      }

      const html = await response.text();
      const resultItems = this.extractDeveloperResults(html);
      
      return resultItems.map((item, index) => ({
        id: `dev-${Date.now()}-${index}`,
        title: item.title,
        snippet: item.snippet,
        url: item.url,
        source: Source.DevSite,
        categories: this.extractCategories(item.title, item.snippet, true),
        isPredefined: false
      }));
    } catch (error) {
      console.error('Error searching developer site:', error);
      return [];
    }
  }

  /**
   * Search ServiceNow blog
   */
  private async searchBlog(query: string): Promise<SearchResult[]> {
    try {
      // For blogs.servicenow.com
      // Some blog platforms offer RSS feeds which could be used
      const searchUrl = `https://cors-anywhere.herokuapp.com/https://blogs.servicenow.com/?s=${encodeURIComponent(query)}`;
      
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Origin': window.location.origin
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching blog: ${response.status}`);
      }

      const html = await response.text();
      const resultItems = this.extractBlogResults(html);
      
      return resultItems.map((item, index) => ({
        id: `blog-${Date.now()}-${index}`,
        title: item.title,
        snippet: item.snippet,
        url: item.url,
        source: Source.Blog,
        categories: this.extractCategories(item.title, item.snippet),
        isPredefined: false
      }));
    } catch (error) {
      console.error('Error searching blog:', error);
      return [];
    }
  }

  /**
   * Search YouTube for ServiceNow related videos
   */
  private async searchYouTube(query: string): Promise<SearchResult[]> {
    try {
      // Use YouTube Data API
      // Note: In a real implementation, you would need a YouTube API key
      const apiKey = 'YOUR_YOUTUBE_API_KEY'; // This should be stored securely
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=ServiceNow+${encodeURIComponent(query)}&type=video&key=${apiKey}`;
      
      // For demonstration, we'll use a placeholder response
      // In a real implementation, you would make the actual API call
      return []; // Return empty for now since we don't have an actual API key
    } catch (error) {
      console.error('Error searching YouTube:', error);
      return [];
    }
  }

  /**
   * Search GitHub for ServiceNow repositories
   */
  private async searchGitHub(query: string): Promise<SearchResult[]> {
    try {
      // Use GitHub's API with authentication for higher rate limits
      const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+servicenow`;
      
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          // Add authorization if needed for higher rate limits
          // 'Authorization': `token ${githubToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error fetching GitHub: ${response.status}`);
      }

      const data = await response.json();
      
      return data.items.slice(0, 5).map((item: any, index: number) => ({
        id: `github-${Date.now()}-${index}`,
        title: item.name,
        snippet: item.description || 'No description available',
        url: item.html_url,
        source: Source.GitHub,
        categories: [
          { type: Category.Persona, name: 'Developer' },
          { type: Category.UseCase, name: 'Integration' }
        ],
        isPredefined: false
      }));
    } catch (error) {
      console.error('Error searching GitHub:', error);
      return [];
    }
  }

  /**
   * Search ServiceNow Now Create site (requires login)
   */
  private async searchNowCreate(query: string): Promise<SearchResult[]> {
    // Now Create typically requires login
    if (!this.userLoggedIn) {
      console.log('User not logged in, skipping Now Create search');
      return [];
    }

    try {
      // This would need the actual login session token
      const searchUrl = `https://cors-anywhere.herokuapp.com/https://create.servicenow.com/search?q=${encodeURIComponent(query)}`;
      
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Origin': window.location.origin,
          'Authorization': `Bearer ${this.sessionToken}` // Use the session token
        }
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Token might be expired or invalid
          this.setAuth(false, null);
          return [];
        }
        throw new Error(`Error fetching Now Create: ${response.status}`);
      }

      const html = await response.text();
      const resultItems = this.extractNowCreateResults(html);
      
      return resultItems.map((item, index) => ({
        id: `nowcreate-${Date.now()}-${index}`,
        title: item.title,
        snippet: item.snippet,
        url: item.url,
        source: Source.NowCreate,
        categories: this.extractCategories(item.title, item.snippet),
        isPredefined: false
      }));
    } catch (error) {
      console.error('Error searching Now Create:', error);
      return [];
    }
  }

  /**
   * Handle ServiceNow login
   */
  public async login(username: string, password: string): Promise<boolean> {
    try {
      // In a real implementation, this would make an OAuth request to ServiceNow
      // For now, we'll simulate a successful login
      console.log('Logging in with credentials:', username);
      
      // Simulate successful login
      this.setAuth(true, 'fake-session-token');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  /**
   * Logout from ServiceNow
   */
  public logout(): void {
    this.setAuth(false, null);
  }

  /**
   * Parse HTML to extract documentation search results
   * This is a placeholder - real implementation would properly parse the HTML
   */
  private extractDocumentationResults(html: string): any[] {
    // In a real implementation, we would use DOM parsing or regex
    // to extract search results from the HTML
    // For demonstration, return empty results
    return [];
  }

  /**
   * Parse HTML to extract community search results
   */
  private extractCommunityResults(html: string): any[] {
    // Similar to documentation results extraction
    return [];
  }

  /**
   * Parse HTML to extract developer site search results
   */
  private extractDeveloperResults(html: string): any[] {
    // Similar to documentation results extraction
    return [];
  }

  /**
   * Parse HTML to extract blog search results
   */
  private extractBlogResults(html: string): any[] {
    // Similar to documentation results extraction
    return [];
  }

  /**
   * Parse HTML to extract Now Create search results
   */
  private extractNowCreateResults(html: string): any[] {
    // Similar to documentation results extraction
    return [];
  }

  /**
   * Extract categories from content using keyword matching
   */
  private extractCategories(title: string, snippet: string, isDeveloper = false): { type: Category, name: string }[] {
    const text = (title + ' ' + snippet).toLowerCase();
    const categories: { type: Category, name: string }[] = [];
    
    // Product categorization
    if (text.includes('itsm') || text.includes('incident') || text.includes('problem') || text.includes('change')) {
      categories.push({ type: Category.Product, name: 'ITSM' });
    }
    if (text.includes('hrsd') || text.includes('hr service') || text.includes('human resources')) {
      categories.push({ type: Category.Product, name: 'HRSD' });
    }
    if (text.includes('csm') || text.includes('customer service')) {
      categories.push({ type: Category.Product, name: 'CSM' });
    }
    if (text.includes('itom') || text.includes('operations management')) {
      categories.push({ type: Category.Product, name: 'ITOM' });
    }
    if (text.includes('cmdb') || text.includes('configuration management')) {
      categories.push({ type: Category.Product, name: 'CMDB' });
    }
    if (text.includes('flow') || text.includes('integration hub')) {
      categories.push({ type: Category.Product, name: 'IntegrationHub' });
    }
    if (text.includes('security') || text.includes('iam') || text.includes('governance')) {
      categories.push({ type: Category.Product, name: 'Security' });
    }
    
    // If no specific product was identified
    if (categories.length === 0 || categories.every(c => c.type !== Category.Product)) {
      categories.push({ type: Category.Product, name: 'Platform' });
    }
    
    // Persona categorization
    if (isDeveloper || text.includes('script') || text.includes('code') || text.includes('api') || text.includes('developer')) {
      categories.push({ type: Category.Persona, name: 'Developer' });
    } else if (text.includes('admin') || text.includes('configure')) {
      categories.push({ type: Category.Persona, name: 'Administrator' });
    } else if (text.includes('process') || text.includes('workflow')) {
      categories.push({ type: Category.Persona, name: 'Process Owner' });
    } else {
      categories.push({ type: Category.Persona, name: 'All' });
    }
    
    // Use case categorization
    if (text.includes('integration') || text.includes('connect')) {
      categories.push({ type: Category.UseCase, name: 'Integration' });
    } else if (text.includes('report') || text.includes('dashboard')) {
      categories.push({ type: Category.UseCase, name: 'Reporting' });
    } else if (text.includes('workflow') || text.includes('automation')) {
      categories.push({ type: Category.UseCase, name: 'Workflow Automation' });
    }
    
    return categories;
  }

  /**
   * Utility to get cached results
   */
  private getCachedResults(key: string): SearchResult[] | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.results;
    }
    return null;
  }

  /**
   * Utility to cache results
   */
  private cacheResults(key: string, results: SearchResult[]): void {
    this.cache.set(key, {
      results,
      timestamp: Date.now()
    });
  }

  /**
   * Utility to capitalize the first letter of a string
   */
  private capitalizeFirstLetter(string: string): string {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

export default ServiceNowDataService;
