# MagaPost (demo)

React + Vite app with login, rich-text posts (TipTap), image embeds in the browser, and a simple layout. Data lives in **localStorage** only.

## Scripts

- `npm run dev` — start dev server  
- `npm run build` — production build  
- `npm run preview` — preview the build  
- `npm run lint` — ESLint  

## Security notes (read before shipping anything real)

- **Auth and passwords** are a front-end demo: credentials are stored in plain text in `localStorage`. Do not reuse this for production.
- **Post HTML** is sanitized with [DOMPurify](https://github.com/cure53/DOMPurify) before display to reduce XSS risk in public forks.
- **Images** are stored as base64 inside post HTML; large files can fill `localStorage`. There is a client-side size limit in the editor.

## Tech

React 19, React Router 7, TipTap, DOMPurify, Vite 8.
