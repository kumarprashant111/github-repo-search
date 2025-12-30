"use client";
import React from 'react';
import type { RepoItem } from '../api/github';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
}

export default function RepoList({ items }: { items: RepoItem[] }) {
  return (
    <div className="repoGrid">
      {items.map((repo) => (
        <article key={repo.id} className="repoCard">
          <div className="repoHeader">
            <img className="avatar" src={repo.owner.avatar_url} alt={repo.owner.login} />
            <div className="repoTitleWrap">
              <a className="repoTitle" href={repo.html_url} target="_blank" rel="noreferrer">
                {repo.full_name}
              </a>
              <a className="repoOwner" href={repo.owner.html_url} target="_blank" rel="noreferrer">
                {repo.owner.login}
              </a>
            </div>
          </div>
          <p className="repoDesc">{repo.description ?? 'No description.'}</p>
          <div className="repoMeta">
            <span className="pill">{repo.language ?? 'Unknown'}</span>
            <span className="pill">★ {repo.stargazers_count.toLocaleString()}</span>
            <span className="pill">⑂ {repo.forks_count.toLocaleString()}</span>
            <span className="muted">Updated {formatDate(repo.updated_at)}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
