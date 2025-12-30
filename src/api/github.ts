export type SortOption = 'best-match' | 'stars' | 'forks' | 'updated';
export type OrderOption = 'desc' | 'asc';

export type RepoOwner = {
  login: string;
  avatar_url: string;
  html_url: string;
};

export type RepoItem = {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  updated_at: string;
  owner: RepoOwner;
};

export type SearchResponse = {
  total_count: number;
  incomplete_results: boolean;
  items: RepoItem[];
};

const API_BASE = 'https://api.github.com';

function mapSort(sort: SortOption): string | undefined {
  if (sort === 'best-match') return undefined;
  return sort;
}

export async function searchRepositories(args: {
  q: string;
  page: number;
  perPage: number;
  sort: SortOption;
  order: OrderOption;
  signal?: AbortSignal;
}): Promise<SearchResponse> {
  const { q, page, perPage, sort, order, signal } = args;
  const url = new URL(`${API_BASE}/search/repositories`);
  url.searchParams.set('q', q);
  url.searchParams.set('page', String(page));
  url.searchParams.set('per_page', String(perPage));
  const sortParam = mapSort(sort);
  if (sortParam) url.searchParams.set('sort', sortParam);
  url.searchParams.set('order', order);
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
  };
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url.toString(), { headers, signal });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub API error (${res.status}): ${text || res.statusText}`);
  }
  return (await res.json()) as SearchResponse;
}
