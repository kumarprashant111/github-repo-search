'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import Pagination from "../components/Pagination";
import RepoList from "../components/RepoList";
import { searchRepositories, type OrderOption, type SortOption, type RepoItem } from "../api/github";

const PER_PAGE = 10;
const MAX_SEARCH_RESULTS = 1000; // GitHub caps search results per query

export default function Page() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("best-match");
  const [order, setOrder] = useState<OrderOption>("desc");
  const [page, setPage] = useState(1);

  const [items, setItems] = useState<RepoItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [incomplete, setIncomplete] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const totalPages = useMemo(() => {
    const cappedTotal = Math.min(totalCount, MAX_SEARCH_RESULTS);
    return Math.max(1, Math.ceil(cappedTotal / PER_PAGE));
  }, [totalCount]);

  async function runSearch(nextQuery: string, nextPage: number) {
    const q = nextQuery.trim();
    if (!q) return;

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    setError(null);

    try {
      const res = await searchRepositories({
        q,
        page: nextPage,
        perPage: PER_PAGE,
        sort,
        order,
        signal: ac.signal,
      });

      setItems(res.items);
      setTotalCount(res.total_count);
      setIncomplete(res.incomplete_results);
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") return;
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setItems([]);
      setTotalCount(0);
      setIncomplete(false);
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim();
    if (!q) {
      setError("Please enter a search query.");
      return;
    }
    setQuery(q);
    setPage(1);
  }

  useEffect(() => {
    if (!query) return;
    runSearch(query, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, page, sort, order]);

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="title">GitHub Repo Search</h1>
          <p className="subtitle">Search repositories and browse results with pagination.</p>
        </div>
      </header>

      <main className="main">
        <form className="searchBar" onSubmit={onSubmit}>
          <input
            className="searchInput"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Try: "react stars:>50000 language:typescript"'
            aria-label="Search GitHub repositories"
          />

          <select className="select" value={sort} onChange={(e) => setSort(e.target.value as SortOption)}>
            <option value="best-match">Best match</option>
            <option value="stars">Stars</option>
            <option value="forks">Forks</option>
            <option value="updated">Recently updated</option>
          </select>

          <select className="select" value={order} onChange={(e) => setOrder(e.target.value as OrderOption)}>
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>

          <button className="primaryBtn" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <div className="alert error">{error}</div>}

        {!query && (
          <div className="empty">
            <p>Enter a query above to search GitHub repositories.</p>
            <ul>
              <li><code>nextjs</code></li>
              <li><code>language:typescript stars:&gt;5000</code></li>
              <li><code>react in:name</code></li>
            </ul>
          </div>
        )}

        {query && (
          <>
            <div className="resultsHeader">
              <div>
                <div className="resultsTitle">
                  Results for <span className="mono">"{query}"</span>
                </div>
                <div className="resultsMeta">
                  Total: {totalCount.toLocaleString()}
                  {totalCount > MAX_SEARCH_RESULTS && (
                    <span className="muted"> (showing first {MAX_SEARCH_RESULTS.toLocaleString()} max)</span>
                  )}
                  {incomplete && <span className="muted"> • results may be incomplete</span>}
                </div>
              </div>

              <div className="pageMeta">
                Page {page} / {totalPages}
              </div>
            </div>

            {loading ? (
              <div className="loadingCard">Loading…</div>
            ) : (
              <RepoList items={items} />
            )}

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(p) => setPage(p)}
            />
          </>
        )}
      </main>

      <footer className="footer">
        <span className="muted">
          Tip: Use GitHub search qualifiers (language:, stars:, in:name, etc.).
        </span>
      </footer>
    </div>
  );
}
