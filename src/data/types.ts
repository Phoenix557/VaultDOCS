export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface AppConfig {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  tagline: string;
  baseUrl: string;
  githubUrl: string;
  liveUrl: string;
  docsTitle: string;
  version: string;
}

export interface ApiParam {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  in?: 'query' | 'path' | 'body' | 'header';
}

export interface ApiEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  title: string;
  description: string;
  auth?: string;
  params?: ApiParam[];
  body?: ApiParam[];
  exampleRequest?: string;
  exampleResponse?: string;
}

export interface ApiGroup {
  id: string;
  title: string;
  description?: string;
  endpoints: ApiEndpoint[];
}

export interface GuideNavItem {
  slug: string;
  title: string;
  order: number;
}
