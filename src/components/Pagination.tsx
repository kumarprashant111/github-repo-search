"use client";
import React from 'react';

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function range(start: number, end: number) {
  const arr: number[] = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  const start = clamp(page - half, 1, Math.max(1, totalPages - windowSize + 1));
  const end = clamp(start + windowSize - 1, 1, totalPages);
  const pages = range(start, end);
  return (
    <div className="pagination">
      <button
        className="pageBtn"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        ← Prev
      </button>
      {start > 1 && (
        <>
          <button className="pageBtn" onClick={() => onChange(1)}>1</button>
          {start > 2 && <span className="ellipsis">…</span>}
        </>
      )}
      {pages.map((p) => (
        <button
          key={p}
          className={`pageBtn ${p === page ? 'active' : ''}`}
          onClick={() => onChange(p)}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="ellipsis">…</span>}
          <button className="pageBtn" onClick={() => onChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}
      <button
        className="pageBtn"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next →
      </button>
    </div>
  );
}
