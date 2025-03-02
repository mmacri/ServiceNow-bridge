
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
  
  // Track all search sources
  private searchSources = [
    {
      name: "ServiceNow Documentation",
      description: "Official ServiceNow product documentation, including detailed guides, release notes, and how-to articles.",
      url: "https://docs.servicenow.com",
      requiresLogin: false,
      resourceCount: 25000
    },
    {
      name: "ServiceNow Community",
      description: "User forums where ServiceNow practitioners ask and answer questions about implementation, development, and best practices.",
      url: "https://community.servicenow.com",
      requiresLogin: false,
      resourceCount: 150000
    },
    {
      name: "ServiceNow Developer Portal",
      description: "Resources for developers including API documentation, code samples, and platform capabilities.",
      url: "https://developer.servicenow.com",
      requiresLogin: false,
      resourceCount: 10000
    },
    {
      name: "ServiceNow Blog",
      description: "Official blog with product announcements, use cases, best practices, and thought leadership.",
      url: "https://blogs.servicenow.com",
      requiresLogin: false,
      resourceCount: 5000
    },
    {
      name: "Now Create",
      description: "Guided implementation methodologies and best practices for ServiceNow projects.",
      url: "https://create.servicenow.com",
      requiresLogin: true,
      resourceCount: 3000
    },
    {
      name: "ServiceNow GitHub",
      description: "Open-source repositories, utilities, and code samples related to ServiceNow.",
      url: "https://github.com/topics/servicenow",
      requiresLogin: false,
      resourceCount: 1200
    },
    {
      name: "ServiceNow YouTube",
      description: "Tutorial videos, webinars, and demonstrations of ServiceNow features and capabilities.",
      url: "https://www.youtube.com/c/servicenow",
      requiresLogin: false,
      resourceCount: 2500
    },
    {
      name: "ServiceNow TechNotes",
      description: "Technical articles and knowledge base content about specific ServiceNow features and implementations.",
      url: "https://support.servicenow.com",
      requiresLogin: true,
      resourceCount: 30000
    }
  ];

  private constructor() {}

  public static getInstance(): ServiceNowDataService {
    if (!ServiceNowDataService.instance) {
      ServiceNowDataService.instance = new ServiceNowDataService();
    }
    return ServiceNowDataService.instance;
  }

  /**
   * Get list of all search sources
   */
  public getSearchSources() {
    return this.searchSources;
  }

  /**
   * Set user login status and session token for authenticated requests
   */
  public setAuth(loggedIn: boolean, token: string | null = null): void {
    this.userLoggedIn = loggedIn;
    this.sessionToken = token;
    
    if (!loggedIn) {
      this.sessionToken = null;
      // Clear any cached results that might contain authenticated content
      this.cache.clear();
    }
    
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
    const cacheKey = `${query.toLowerCase().trim()}-${this.userLoggedIn ? 'auth' : 'noauth'}`;
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
        this.searchNowCreate(query),
        this.searchTechNotes(query)
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
      // In a real implementation we would use a proper API or CORS proxy
      // For now, let's create some sample results based on the query
      console.log('Searching ServiceNow documentation for:', query);
      
      // Simulate some delay for realistic network request timing
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 500));
      
      // Generate some sample results based on the query
      const results: SearchResult[] = [];
      
      // Add sample documentation results
      if (query.toLowerCase().includes('itsm') || query.toLowerCase().includes('incident')) {
        results.push({
          id: `docs-${Date.now()}-1`,
          title: `IT Service Management (ITSM) - ${query}`,
          snippet: `Comprehensive documentation about ServiceNow ITSM including incident, problem, and change management. Learn how to configure and use ITSM features to streamline your IT operations.`,
          url: `https://docs.servicenow.com/bundle/utah-it-service-management/page/product/incident-management/concept/c_IncidentManagement.html`,
          source: Source.Documentation,
          categories: [
            { type: Category.Product, name: 'ITSM' },
            { type: Category.Persona, name: 'Administrator' },
            { type: Category.UseCase, name: 'Service Desk' }
          ],
          isPredefined: false
        });
      }
      
      if (query.toLowerCase().includes('hrsd') || query.toLowerCase().includes('hr')) {
        results.push({
          id: `docs-${Date.now()}-2`,
          title: `HR Service Delivery Guide - ${query}`,
          snippet: `Learn about ServiceNow HR Service Delivery and how it helps organizations streamline HR processes and improve employee experience.`,
          url: `https://docs.servicenow.com/bundle/utah-hr-service-delivery/page/product/human-resources/concept/c_HumanResources.html`,
          source: Source.Documentation,
          categories: [
            { type: Category.Product, name: 'HRSD' },
            { type: Category.Persona, name: 'HR Manager' },
            { type: Category.UseCase, name: 'Employee Service Center' }
          ],
          isPredefined: false
        });
      }
      
      if (query.toLowerCase().includes('platform') || query.toLowerCase().includes('develop')) {
        results.push({
          id: `docs-${Date.now()}-3`,
          title: `ServiceNow Platform Administration - ${query}`,
          snippet: `Documentation covering the core ServiceNow platform capabilities, configuration, and administration.`,
          url: `https://docs.servicenow.com/bundle/utah-platform-administration/page/administer/home-pf.html`,
          source: Source.Documentation,
          categories: [
            { type: Category.Product, name: 'Platform' },
            { type: Category.Persona, name: 'Administrator' },
            { type: Category.UseCase, name: 'Configuration' }
          ],
          isPredefined: false
        });
      }
      
      // Add more generic results
      results.push({
        id: `docs-${Date.now()}-4`,
        title: `Search Results for "${query}" - ServiceNow Documentation`,
        snippet: `ServiceNow documentation related to your search for "${query}". Our documentation provides comprehensive guides for using ServiceNow products and features.`,
        url: `https://docs.servicenow.com/search?q=${encodeURIComponent(query)}`,
        source: Source.Documentation,
        categories: [
          { type: Category.Product, name: 'Platform' },
          { type: Category.Persona, name: 'All' }
        ],
        isPredefined: false
      });
      
      return results;
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
      console.log('Searching ServiceNow community for:', query);
      
      // Simulate some delay
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400));
      
      // Generate some sample community results
      const results: SearchResult[] = [];
      
      results.push({
        id: `community-${Date.now()}-1`,
        title: `How to solve ${query} in ServiceNow?`,
        snippet: `I've been trying to implement ${query} in our instance but running into some issues. Has anyone successfully done this before? Looking for best practices and any pitfalls to avoid.`,
        url: `https://community.servicenow.com/community?id=community_search&q=${encodeURIComponent(query)}`,
        source: Source.Community,
        categories: [
          { type: Category.Product, name: 'Platform' },
          { type: Category.Persona, name: 'Developer' },
          { type: Category.UseCase, name: 'Integration' }
        ],
        isPredefined: false
      });
      
      if (query.toLowerCase().includes('script') || query.toLowerCase().includes('code')) {
        results.push({
          id: `community-${Date.now()}-2`,
          title: `Scripting examples for ${query} in ServiceNow`,
          snippet: `Community discussion with various script examples and approaches to implement ${query} functionality. Includes business rules, client scripts, and UI actions.`,
          url: `https://community.servicenow.com/community?id=community_question&sys_id=abc123`,
          source: Source.Community,
          categories: [
            { type: Category.Persona, name: 'Developer' },
            { type: Category.UseCase, name: 'Customization' }
          ],
          isPredefined: false
        });
      }
      
      return results;
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
      console.log('Searching ServiceNow developer site for:', query);
      
      // Simulate some delay
      await new Promise(resolve => setTimeout(resolve, 250 + Math.random() * 350));
      
      const results: SearchResult[] = [];
      
      if (query.toLowerCase().includes('api') || query.toLowerCase().includes('rest') || query.toLowerCase().includes('integration')) {
        results.push({
          id: `dev-${Date.now()}-1`,
          title: `REST API Developer Guide - ${query}`,
          snippet: `Comprehensive documentation about ServiceNow REST APIs, including authentication, endpoints, and example requests for ${query} related operations.`,
          url: `https://developer.servicenow.com/dev.do#!/reference/api/utah/rest`,
          source: Source.DevSite,
          categories: [
            { type: Category.Persona, name: 'Developer' },
            { type: Category.UseCase, name: 'Integration' }
          ],
          isPredefined: false
        });
      }
      
      if (query.toLowerCase().includes('script') || query.toLowerCase().includes('code') || query.toLowerCase().includes('develop')) {
        results.push({
          id: `dev-${Date.now()}-2`,
          title: `Scripting in ServiceNow - Developer Guide`,
          snippet: `Learn how to write effective scripts in ServiceNow for business rules, client scripts, UI actions, and more. Includes best practices and example code.`,
          url: `https://developer.servicenow.com/dev.do#!/learn/learning-plans/utah/servicenow_application_developer`,
          source: Source.DevSite,
          categories: [
            { type: Category.Persona, name: 'Developer' },
            { type: Category.UseCase, name: 'Customization' }
          ],
          isPredefined: false
        });
      }
      
      // Generic developer result
      results.push({
        id: `dev-${Date.now()}-3`,
        title: `Developer resources for ${query}`,
        snippet: `ServiceNow developer documentation and guides related to ${query}. Find API references, code samples, and development best practices.`,
        url: `https://developer.servicenow.com/dev.do#!/search?q=${encodeURIComponent(query)}`,
        source: Source.DevSite,
        categories: [
          { type: Category.Persona, name: 'Developer' }
        ],
        isPredefined: false
      });
      
      return results;
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
      console.log('Searching ServiceNow blog for:', query);
      
      // Simulate some delay
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));
      
      const results: SearchResult[] = [];
      
      results.push({
        id: `blog-${Date.now()}-1`,
        title: `Best Practices for ${query} in ServiceNow`,
        snippet: `Our experts share the latest best practices and strategies for implementing ${query} in your ServiceNow instance. Learn how leading organizations are maximizing their ROI.`,
        url: `https://blogs.servicenow.com/?s=${encodeURIComponent(query)}`,
        source: Source.Blog,
        categories: [
          { type: Category.Product, name: 'Platform' },
          { type: Category.UseCase, name: 'Best Practices' }
        ],
        isPredefined: false
      });
      
      if (query.toLowerCase().includes('ai') || query.toLowerCase().includes('automation')) {
        results.push({
          id: `blog-${Date.now()}-2`,
          title: `How AI is Transforming ServiceNow Implementations`,
          snippet: `Explore how artificial intelligence and machine learning are enhancing ServiceNow capabilities and driving automation across the platform.`,
          url: `https://blogs.servicenow.com/ai-machine-learning`,
          source: Source.Blog,
          categories: [
            { type: Category.Product, name: 'AI Intelligence' },
            { type: Category.UseCase, name: 'Innovation' }
          ],
          isPredefined: false
        });
      }
      
      return results;
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
      console.log('Searching YouTube for ServiceNow content:', query);
      
      // Simulate some delay
      await new Promise(resolve => setTimeout(resolve, 350 + Math.random() * 400));
      
      const results: SearchResult[] = [];
      
      // Tutorial video
      results.push({
        id: `youtube-${Date.now()}-1`,
        title: `ServiceNow Tutorial: ${query} Explained`,
        snippet: `In this video, we explain how to implement ${query} in ServiceNow with step-by-step instructions and best practices. Perfect for beginners and intermediate users.`,
        url: `https://www.youtube.com/results?search_query=servicenow+${encodeURIComponent(query)}`,
        source: Source.YouTube,
        categories: [
          { type: Category.Persona, name: 'Administrator' },
          { type: Category.UseCase, name: 'Training' }
        ],
        isPredefined: false
      });
      
      // Demo video
      if (query.toLowerCase().includes('demo') || query.toLowerCase().includes('how to')) {
        results.push({
          id: `youtube-${Date.now()}-2`,
          title: `ServiceNow ${query} Demo`,
          snippet: `Watch a detailed demonstration of ${query} functionality in ServiceNow. See the feature in action and learn about configuration options.`,
          url: `https://www.youtube.com/watch?v=demo-${encodeURIComponent(query)}`,
          source: Source.YouTube,
          categories: [
            { type: Category.Persona, name: 'All' },
            { type: Category.UseCase, name: 'Demonstration' }
          ],
          isPredefined: false
        });
      }
      
      return results;
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
      console.log('Searching GitHub for ServiceNow repositories:', query);
      
      // Use GitHub's public API
      const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+servicenow`;
      
      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github.v3+json',
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
      console.log('User not logged in, showing limited Now Create results');
      
      // Return a teaser result that prompts login
      return [{
        id: `nowcreate-${Date.now()}-login`,
        title: `Now Create: Implementation guides for ${query}`,
        snippet: `Access step-by-step implementation guides, methodologies, and templates related to "${query}" in ServiceNow Now Create. Login required to view full content.`,
        url: `https://create.servicenow.com/`,
        source: Source.NowCreate,
        categories: [
          { type: Category.Persona, name: 'Implementation Specialist' },
          { type: Category.UseCase, name: 'Implementation' }
        ],
        isPredefined: false
      }];
    }

    try {
      console.log('Searching ServiceNow Now Create for:', query);
      
      // Simulate some delay
      await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 400));
      
      const results: SearchResult[] = [];
      
      // Implementation methodologies
      results.push({
        id: `nowcreate-${Date.now()}-1`,
        title: `Implementation Guide: ${query}`,
        snippet: `Comprehensive implementation guide for ${query} with step-by-step instructions, best practices, and templates. Follow this methodology for a successful implementation.`,
        url: `https://create.servicenow.com/create/cms?q=${encodeURIComponent(query)}`,
        source: Source.NowCreate,
        categories: [
          { type: Category.Persona, name: 'Implementation Specialist' },
          { type: Category.UseCase, name: 'Implementation' }
        ],
        isPredefined: false
      });
      
      // Best practices
      results.push({
        id: `nowcreate-${Date.now()}-2`,
        title: `${query} Leading Practices`,
        snippet: `Learn about industry-leading practices for ${query} implementation and configuration. Includes governance models, process flows, and KPIs.`,
        url: `https://create.servicenow.com/leading-practices`,
        source: Source.NowCreate,
        categories: [
          { type: Category.Persona, name: 'Architect' },
          { type: Category.UseCase, name: 'Best Practices' }
        ],
        isPredefined: false
      });
      
      return results;
    } catch (error) {
      console.error('Error searching Now Create:', error);
      return [];
    }
  }

  /**
   * Search ServiceNow TechNotes (requires login)
   */
  private async searchTechNotes(query: string): Promise<SearchResult[]> {
    // TechNotes requires login
    if (!this.userLoggedIn) {
      console.log('User not logged in, showing limited TechNotes results');
      
      // Return a teaser result that prompts login
      return [{
        id: `technotes-${Date.now()}-login`,
        title: `ServiceNow TechNotes for ${query}`,
        snippet: `Access technical knowledge base articles related to "${query}" in ServiceNow. Login required to view full content.`,
        url: `https://support.servicenow.com/`,
        source: Source.DevSite, // Using DevSite as we don't have a TechNotes source defined
        categories: [
          { type: Category.Persona, name: 'Administrator' },
          { type: Category.UseCase, name: 'Troubleshooting' }
        ],
        isPredefined: false
      }];
    }

    try {
      console.log('Searching ServiceNow TechNotes for:', query);
      
      // Simulate some delay
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 300));
      
      const results: SearchResult[] = [];
      
      // Troubleshooting KB
      results.push({
        id: `technotes-${Date.now()}-1`,
        title: `Troubleshooting: ${query} issues in ServiceNow`,
        snippet: `Technical article detailing common issues, error messages, and troubleshooting steps for ${query} in ServiceNow.`,
        url: `https://support.servicenow.com/kb?id=kb_article_view&sysparm_article=KB1234`,
        source: Source.DevSite, // Using DevSite as we don't have a TechNotes source defined
        categories: [
          { type: Category.Persona, name: 'Administrator' },
          { type: Category.UseCase, name: 'Troubleshooting' }
        ],
        isPredefined: false
      });
      
      // Configuration guide
      results.push({
        id: `technotes-${Date.now()}-2`,
        title: `Advanced Configuration Guide: ${query}`,
        snippet: `Step-by-step technical guide for advanced configuration of ${query} functionality. Includes script examples and configuration parameters.`,
        url: `https://support.servicenow.com/kb?id=kb_article_view&sysparm_article=KB5678`,
        source: Source.DevSite, // Using DevSite as we don't have a TechNotes source defined
        categories: [
          { type: Category.Persona, name: 'Administrator' },
          { type: Category.UseCase, name: 'Configuration' }
        ],
        isPredefined: false
      });
      
      return results;
    } catch (error) {
      console.error('Error searching TechNotes:', error);
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
