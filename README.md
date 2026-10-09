# Logic Forge Website
React + Vite + Tailwind + React Router + Framer Motion + Lucide.

## Prerequisites
Node.js 18+.

## Run
```
npm install
npm run dev      # development
npm run build    # production build in /dist
npm run preview  # preview the build
```

## Customize
- **Brand colors:** `tailwind.config.js` (navy, dark, cyan, electric, light).
- **Text:** pages in `src/pages.jsx`; contact details in `src/data.js` (`SITE`).
- **Pricing:** edit the `pricing` array in `src/data.js`.
- **Services / FAQs / process:** same file.
- **Add a project:** add an object to `projects` in `src/data.js` (unique `slug`, `cat` of Business, E-Commerce, Portfolio or Landing Pages). Its filter and `/projects/<slug>` page appear automatically. Replace the mockup with a real screenshot by editing `Browser` in `src/components.jsx`.

## Real contact form submissions
The form currently opens WhatsApp or the user's email app with a prefilled message. To receive submissions directly, create a Formspree or Web3Forms endpoint and replace the `send` function in `Contact` (`src/pages.jsx`) with a `fetch(endpoint, { method: 'POST', body: JSON.stringify(v) })` call.

## Hosting note
For clean URLs on Vercel/Netlify, add a rewrite of all paths to `/index.html`.
