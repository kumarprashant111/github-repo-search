# GitHub Repo Search

This project is a simple Next.js app that lets you search for GitHub repositories by leveraging GitHub’s public Search API. It was originally built to showcases how to build a modern, type‑safe web application using React, TypeScript, and the Next.js App Router (in the `src` directory).

## Features

- **Search GitHub repositories** with arbitrary queries, including GitHub qualifiers like `language:`, `stars:`, or `in:name` to narrow results.
- **Pagination** with previous/next buttons and page numbers, respecting GitHub’s 1,000‑result cap on search.
- **Sorting and ordering options**: best match, stars, forks, or recently updated, in ascending or descending order.
- **Repository details**: list items include the full name, description, primary language, star count, fork count, and last updated date, as well as links to the repo and owner on GitHub.
- **Responsive UI** styled with plain CSS. The layout uses cards, pills and subtle colors for a clean look.

## Project Structure

- **src/app/** – Contains the root layout and the main `page.tsx` component. The page uses client side hooks (`useState`, `useEffect`) to manage search queries and fetch results.
- **src/api/github.ts** – A small wrapper around the GitHub Search API with TypeScript types for repository items and query parameters.
- **src/components/** – Reusable UI components:
  - `Pagination.tsx` – Renders a minimal pagination control.
  - `RepoList.tsx` – Renders repository cards with meta information.
- **src/app/globals.css** – Global styles for typography, colors, layout, and component classes.

This project uses the Next.js app router introduced in Next.js 13+ with the `src` directory convention.

## Running Locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **(Optional) Configure a GitHub token**

   To avoid GitHub’s rate limits for unauthenticated requests, you can create a personal access token and save it in a `.env.local` file at the project root:

   ```
   VITE_GITHUB_TOKEN=your-github-token
   ```

   You can run the app without a token, but unauthenticated requests are limited to 10 per minute.

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`.

4. **Build for production**

   ```bash
   npm run build
   npm start
   ```

## License

This repository was created for a coding test and is provided without any warranty. Feel free to fork or modify it for your own use.
