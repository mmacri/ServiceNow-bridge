
import { SearchResult, Source, Category } from '../types/search';

/**
 * ServiceNowDataService handles fetching and processing data from various ServiceNow knowledge sources
 */
export class ServiceNowDataService {
  private static instance: ServiceNowDataService;
  private cache: Map<string, { results: SearchResult[], timestamp: number }> = new Map();
  private cacheDuration = 1000 * 60 * 30; // 30 minutes cache

  private constructor() {}

  public static getInstance(): ServiceNowDataService {
    if (!ServiceNowDataService.instance) {
      ServiceNowDataService.instance = new ServiceNowDataService();
    }
    return ServiceNowDataService.instance;
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

    // Fetch from all sources in parallel
    const results = await Promise.all([
      this.searchDocumentation(query),
      this.searchCommunity(query),
      this.searchDeveloperSite(query),
      this.searchBlog(query),
      this.searchGitHub(query)
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
  }

  /**
   * Search ServiceNow documentation
   */
  private async searchDocumentation(query: string): Promise<SearchResult[]> {
    try {
      // In a real implementation, we would fetch from the docs.servicenow.com
      // Here we're simulating the API call and response
      const response = await this.simulateApiCall(
        `https://docs.servicenow.com/search?q=${encodeURIComponent(query)}`,
        1000
      );
      
      // Parse and transform the results
      return response.slice(0, 3).map((item: any, index: number) => ({
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
      // Simulate community search
      const response = await this.simulateApiCall(
        `https://community.servicenow.com/search?q=${encodeURIComponent(query)}`,
        1200
      );
      
      return response.slice(0, 2).map((item: any, index: number) => ({
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
      // Simulate developer site search
      const response = await this.simulateApiCall(
        `https://developer.servicenow.com/search?q=${encodeURIComponent(query)}`,
        800
      );
      
      return response.slice(0, 2).map((item: any, index: number) => ({
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
      // Simulate blog search
      const response = await this.simulateApiCall(
        `https://blogs.servicenow.com/search?q=${encodeURIComponent(query)}`,
        700
      );
      
      return response.slice(0, 2).map((item: any, index: number) => ({
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
   * Search GitHub for ServiceNow repositories
   */
  private async searchGitHub(query: string): Promise<SearchResult[]> {
    try {
      // In a real implementation, use GitHub's API with authentication
      const response = await this.simulateApiCall(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+servicenow`,
        1500
      );
      
      return response.slice(0, 1).map((item: any, index: number) => ({
        id: `github-${Date.now()}-${index}`,
        title: item.title,
        snippet: item.snippet,
        url: item.url,
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
   * Extract categories from content using simple keyword matching
   * In a real implementation, NLP or ML would be used for better classification
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
   * Simulate an API call with mock data
   * In a real implementation, this would make actual HTTP requests
   */
  private simulateApiCall(url: string, delay: number): Promise<any[]> {
    console.log(`Simulating API call to: ${url}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const urlLower = url.toLowerCase();
        const query = url.split('q=')[1]?.split('&')[0] || '';
        const decodedQuery = decodeURIComponent(query).toLowerCase();
        
        // Generate mock results based on the query and source
        let results = [];
        
        if (urlLower.includes('docs.servicenow.com')) {
          results = this.generateDocumentationResults(decodedQuery);
        } else if (urlLower.includes('community.servicenow.com')) {
          results = this.generateCommunityResults(decodedQuery);
        } else if (urlLower.includes('developer.servicenow.com')) {
          results = this.generateDeveloperResults(decodedQuery);
        } else if (urlLower.includes('blogs.servicenow.com')) {
          results = this.generateBlogResults(decodedQuery);
        } else if (urlLower.includes('api.github.com')) {
          results = this.generateGitHubResults(decodedQuery);
        }
        
        resolve(results);
      }, delay);
    });
  }

  /**
   * Generate mock documentation results
   */
  private generateDocumentationResults(query: string): any[] {
    const results = [
      {
        title: `Using ${this.capitalizeFirstLetter(query)} in ServiceNow`,
        snippet: `This article provides a comprehensive guide to ${query} functionality in ServiceNow. Learn best practices and implementation strategies.`,
        url: `https://docs.servicenow.com/bundle/tokyo-platform-administration/page/administer/${query.replace(/\s+/g, '-')}.html`
      },
      {
        title: `${this.capitalizeFirstLetter(query)} Configuration Guide`,
        snippet: `Step-by-step instructions for configuring ${query} in your ServiceNow instance. Includes permissions, setup, and common issues.`,
        url: `https://docs.servicenow.com/bundle/tokyo-platform-administration/page/administer/configuration/${query.replace(/\s+/g, '-')}-guide.html`
      },
      {
        title: `ServiceNow ${this.capitalizeFirstLetter(query)} API Reference`,
        snippet: `Complete API reference for ${query} functionality in ServiceNow. Includes endpoints, parameters, and example requests.`,
        url: `https://docs.servicenow.com/bundle/tokyo-application-development/page/integrate/api-reference/${query.replace(/\s+/g, '-')}-api.html`
      },
      {
        title: `Troubleshooting ${this.capitalizeFirstLetter(query)} Issues`,
        snippet: `Common issues and solutions when working with ${query} in ServiceNow. Includes error messages and debugging tips.`,
        url: `https://docs.servicenow.com/bundle/tokyo-platform-administration/page/administer/troubleshooting/${query.replace(/\s+/g, '-')}-troubleshooting.html`
      }
    ];
    
    // Randomize which results we return to simulate different searches
    return this.shuffleArray(results);
  }

  /**
   * Generate mock community results
   */
  private generateCommunityResults(query: string): any[] {
    const results = [
      {
        title: `How do I implement ${query} in my instance?`,
        snippet: `I'm trying to set up ${query} but running into issues with the configuration. Has anyone successfully implemented this? Any tips or best practices would be appreciated.`,
        url: `https://community.servicenow.com/community?id=community_question&sys_id=${this.generateRandomId()}`
      },
      {
        title: `Best practice for ${query} in large enterprises`,
        snippet: `We're implementing ${query} across our global organization. Looking for advice on scaling and governance models that have worked for others.`,
        url: `https://community.servicenow.com/community?id=community_question&sys_id=${this.generateRandomId()}`
      },
      {
        title: `${this.capitalizeFirstLetter(query)} not working after Tokyo upgrade`,
        snippet: `After upgrading to Tokyo release, our ${query} workflow stopped functioning correctly. Has anyone else experienced this issue? We've tried reverting the update but still facing problems.`,
        url: `https://community.servicenow.com/community?id=community_question&sys_id=${this.generateRandomId()}`
      }
    ];
    
    return this.shuffleArray(results);
  }

  /**
   * Generate mock developer site results
   */
  private generateDeveloperResults(query: string): any[] {
    const results = [
      {
        title: `${this.capitalizeFirstLetter(query)} Script Includes and API`,
        snippet: `Learn how to develop custom functionality for ${query} using Script Includes. This guide covers API design, best practices, and performance considerations.`,
        url: `https://developer.servicenow.com/dev.do#!/reference/api/${query.replace(/\s+/g, '-')}`
      },
      {
        title: `Building custom ${this.capitalizeFirstLetter(query)} applications`,
        snippet: `This developer guide walks through creating a custom application that extends ${query} functionality. Includes code samples and architecture guidance.`,
        url: `https://developer.servicenow.com/dev.do#!/guide/apps/${query.replace(/\s+/g, '-')}-app`
      },
      {
        title: `${this.capitalizeFirstLetter(query)} Developer Training`,
        snippet: `Comprehensive training module on developing ${query} solutions in ServiceNow. Covers fundamentals through advanced topics with hands-on exercises.`,
        url: `https://developer.servicenow.com/dev.do#!/learn/courses/${query.replace(/\s+/g, '-')}-development`
      }
    ];
    
    return this.shuffleArray(results);
  }

  /**
   * Generate mock blog results
   */
  private generateBlogResults(query: string): any[] {
    const results = [
      {
        title: `The Future of ${this.capitalizeFirstLetter(query)} in ServiceNow`,
        snippet: `Explore how ${query} is evolving in the ServiceNow ecosystem and what new capabilities are on the roadmap for upcoming releases.`,
        url: `https://blogs.servicenow.com/${query.replace(/\s+/g, '-')}-future`
      },
      {
        title: `Customer Success Story: ${this.capitalizeFirstLetter(query)} at Global Financial Services Firm`,
        snippet: `Learn how a leading financial services company transformed their operations using ServiceNow ${query} to streamline processes and improve customer satisfaction.`,
        url: `https://blogs.servicenow.com/customer-story-${query.replace(/\s+/g, '-')}`
      },
      {
        title: `${this.capitalizeFirstLetter(query)} Best Practices from ServiceNow Experts`,
        snippet: `Our team of platform experts shares their top tips and strategies for getting the most out of ${query} functionality in ServiceNow.`,
        url: `https://blogs.servicenow.com/${query.replace(/\s+/g, '-')}-best-practices`
      }
    ];
    
    return this.shuffleArray(results);
  }

  /**
   * Generate mock GitHub results
   */
  private generateGitHubResults(query: string): any[] {
    const results = [
      {
        title: `servicenow-${query.replace(/\s+/g, '-')}-integration`,
        snippet: `Open source project providing tools and utilities for ${query} integration with ServiceNow. Includes sample code, documentation, and reusable components.`,
        url: `https://github.com/servicenow-community/servicenow-${query.replace(/\s+/g, '-')}-integration`
      },
      {
        title: `awesome-servicenow-${query.replace(/\s+/g, '-')}`,
        snippet: `A curated list of awesome resources, libraries, and tools for working with ${query} in ServiceNow. Community-maintained reference guide.`,
        url: `https://github.com/servicenow-community/awesome-servicenow-${query.replace(/\s+/g, '-')}`
      },
      {
        title: `${query.replace(/\s+/g, '-')}-servicenow-connector`,
        snippet: `Connect ${this.capitalizeFirstLetter(query)} with ServiceNow using this open source connector. Supports bidirectional data synchronization and custom field mappings.`,
        url: `https://github.com/integration-projects/${query.replace(/\s+/g, '-')}-servicenow-connector`
      }
    ];
    
    return this.shuffleArray(results);
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
   * Utility to shuffle an array (for random mock results)
   */
  private shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  /**
   * Utility to generate a random ID for mock data
   */
  private generateRandomId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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
