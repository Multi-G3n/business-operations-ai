# Ever After Wedding Invitation Studio

A small React, TypeScript, and Vite prototype for customizing a digital wedding invitation. Edit the couple's names, ceremony details, venue, message, and theme to see the card preview update live. Your draft is saved in the current browser with `localStorage`.

## Run locally

```bash
npm install
npm run dev
```

Vite prints the local URL after the development server starts. The project uses the dependencies already listed in `package.json`.

## Available scripts

- `npm run dev` starts the Vite development server.
- `npm run build` type-checks and builds the app.
- `npm run lint` runs ESLint.
- `npm run preview` serves the production build locally.

This is a front-end prototype. Invitations are stored only in the browser where they were created; there is no account, cloud sync, or publishing flow yet.
