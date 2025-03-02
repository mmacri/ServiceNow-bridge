
export enum Source {
  Documentation = 'documentation',
  Community = 'community',
  Blog = 'blog',
  DevSite = 'devsite',
  NowCreate = 'nowcreate',
  GitHub = 'github',
  YouTube = 'youtube'
}

export enum Category {
  Product = 'product',
  Persona = 'persona',
  UseCase = 'usecase',
  Industry = 'industry'
}

export interface CategoryTag {
  type: Category;
  name: string;
}

export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  url: string;
  source: Source;
  categories: CategoryTag[];
  isPredefined: boolean;
}

export interface SearchState {
  query: string;
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
}
