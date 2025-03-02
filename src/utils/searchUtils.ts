
import { SearchResult, Category, Source } from '../types/search';

/**
 * Performs a search based on the query and returns mock results
 * In a real app, this would call the actual search APIs
 */
export const performSearch = async (query: string): Promise<SearchResult[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  if (!query.trim()) {
    return [];
  }
  
  // In a real implementation, this would call various APIs and aggregate results
  // For now, we'll return mock data based on the query
  const mockResults = getMockResults(query);
  return mockResults;
};

/**
 * Get mock search results based on the query
 */
const getMockResults = (query: string): SearchResult[] => {
  // Filter mock data based on query (case insensitive)
  const lowerQuery = query.toLowerCase();
  
  return mockData.filter(result => 
    result.title.toLowerCase().includes(lowerQuery) || 
    result.snippet.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Mock data for development purposes
 */
const mockData: SearchResult[] = [
  {
    id: '1',
    title: 'Integrating ServiceNow with Azure AD',
    snippet: 'Step-by-step guide to set up Single Sign-On between ServiceNow and Azure Active Directory. Learn about SAML configuration and user mapping.',
    url: '#',
    source: Source.Documentation,
    categories: [
      { type: Category.Product, name: 'Platform' },
      { type: Category.Persona, name: 'Administrator' },
      { type: Category.UseCase, name: 'Identity Integration' }
    ],
    isPredefined: true
  },
  {
    id: '2',
    title: 'ServiceNow ITSM Best Practices',
    snippet: 'Optimize your ITSM implementation with proven best practices for incident management, problem management, and change management. Includes KPI recommendations.',
    url: '#',
    source: Source.Blog,
    categories: [
      { type: Category.Product, name: 'ITSM' },
      { type: Category.Persona, name: 'Process Owner' },
      { type: Category.UseCase, name: 'Process Optimization' }
    ],
    isPredefined: false
  },
  {
    id: '3',
    title: 'Using Flow Designer for HR Service Delivery',
    snippet: 'Learn how to automate HR workflows using Flow Designer. Includes examples for onboarding, time-off requests, and employee transitions.',
    url: '#',
    source: Source.Community,
    categories: [
      { type: Category.Product, name: 'HRSD' },
      { type: Category.Persona, name: 'HR Administrator' },
      { type: Category.UseCase, name: 'Workflow Automation' }
    ],
    isPredefined: false
  },
  {
    id: '4',
    title: 'ServiceNow Performance Analytics Dashboard Configuration',
    snippet: 'Configure powerful dashboards using Performance Analytics. Learn about widgets, data sources, and visualization best practices.',
    url: '#',
    source: Source.Documentation,
    categories: [
      { type: Category.Product, name: 'Performance Analytics' },
      { type: Category.Persona, name: 'Business Analyst' },
      { type: Category.UseCase, name: 'Reporting' }
    ],
    isPredefined: true
  },
  {
    id: '5',
    title: 'Implementing CMDB in ServiceNow',
    snippet: 'Best practices for CMDB implementation including data modeling, discovery setup, and maintaining data quality.',
    url: '#',
    source: Source.NowCreate,
    categories: [
      { type: Category.Product, name: 'CMDB' },
      { type: Category.Persona, name: 'Technical Architect' },
      { type: Category.UseCase, name: 'Asset Management' }
    ],
    isPredefined: true
  },
  {
    id: '6',
    title: 'ServiceNow API Authentication Methods',
    snippet: 'Learn different methods to authenticate with ServiceNow APIs including Basic Auth, OAuth, and Mid Server. Includes code examples in JavaScript and Python.',
    url: '#',
    source: Source.DevSite,
    categories: [
      { type: Category.Product, name: 'Platform' },
      { type: Category.Persona, name: 'Developer' },
      { type: Category.UseCase, name: 'Integration' }
    ],
    isPredefined: false
  },
  {
    id: '7',
    title: 'Agent Workspace Customization',
    snippet: 'Customize the Agent Workspace to improve agent productivity. Learn about configuration options, custom widgets, and layouts.',
    url: '#',
    source: Source.Documentation,
    categories: [
      { type: Category.Product, name: 'ITSM' },
      { type: Category.Persona, name: 'System Administrator' },
      { type: Category.UseCase, name: 'UI/UX' }
    ],
    isPredefined: false
  },
  {
    id: '8',
    title: 'ServiceNow Tokyo Release Highlights',
    snippet: 'Overview of key features and improvements in the Tokyo release. Learn about platform changes, new modules, and deprecated functionality.',
    url: '#',
    source: Source.Blog,
    categories: [
      { type: Category.Product, name: 'Platform' },
      { type: Category.Persona, name: 'All' },
      { type: Category.UseCase, name: 'Upgrade Planning' }
    ],
    isPredefined: true
  }
];

/**
 * Get source display information
 */
export const getSourceInfo = (source: Source): { name: string; color: string } => {
  switch (source) {
    case Source.Documentation:
      return { name: 'Documentation', color: 'bg-blue-100 text-blue-800' };
    case Source.Community:
      return { name: 'Community', color: 'bg-green-100 text-green-800' };
    case Source.Blog:
      return { name: 'Blog', color: 'bg-purple-100 text-purple-800' };
    case Source.DevSite:
      return { name: 'Developer', color: 'bg-yellow-100 text-yellow-800' };
    case Source.NowCreate:
      return { name: 'Now Create', color: 'bg-red-100 text-red-800' };
    case Source.GitHub:
      return { name: 'GitHub', color: 'bg-gray-100 text-gray-800' };
    default:
      return { name: 'Unknown', color: 'bg-gray-100 text-gray-800' };
  }
};

/**
 * Get category display information
 */
export const getCategoryInfo = (category: { type: Category; name: string }): { icon: string; color: string } => {
  const { type } = category;
  
  switch (type) {
    case Category.Product:
      return { icon: '🧩', color: 'bg-servicenow-blue text-white' };
    case Category.Persona:
      return { icon: '👤', color: 'bg-servicenow-lightblue text-white' };
    case Category.UseCase:
      return { icon: '🔄', color: 'bg-servicenow-green text-white' };
    case Category.Industry:
      return { icon: '🏢', color: 'bg-gray-700 text-white' };
    default:
      return { icon: '•', color: 'bg-gray-500 text-white' };
  }
};
