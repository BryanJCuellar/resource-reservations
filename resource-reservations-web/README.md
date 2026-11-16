# resource-reservations Web

## Overview

The resource-reservations web application is built with React, TypeScript, and Vite. It connects to the API and provides authentication and navigation based on the signed-in user's role.

## Prerequisites

- Node.js 22.12 or later.
- npm.
- The [API](../resource-reservations-api/README.md) configured and available.

## Setup

1. From the repository root, enter the web directory and install dependencies:

   ```powershell
   cd resource-reservations-web
   npm install
   ```

2. Copy the environment example:

   ```powershell
   Copy-Item .env.example .env
   ```

   On macOS/Linux, use `cp .env.example .env` instead.

3. Edit `.env` and set `VITE_API_URL` to the API's base URL, using the [environment example](.env.example) as the reference.

## API Connection

The frontend and API use separate environment files:

| Variable | Location | Local example | Purpose |
| --- | --- | --- | --- |
| `VITE_API_URL` | Web `.env` | `http://localhost:3000` | API base URL used by the frontend. |
| `CORS_ORIGIN` | API `.env` | `http://localhost:5173` | Frontend origin allowed to make browser requests to the API. |

`CORS_ORIGIN` must match the frontend URL opened in the browser, including protocol, hostname, and port. The API accepts multiple origins separated by commas. Restart Vite after changing the web `.env`, and restart the API after changing its `.env`.

Variables prefixed with `VITE_` are exposed to the browser. Do not put secrets in them.

## Running

```powershell
npm run dev
```

Open the URL shown in the terminal. Vite uses `http://localhost:5173` by default; if that port is occupied, it selects another port. Update the API's `CORS_ORIGIN` to match the actual frontend origin and restart the API.

## Signing In

With both servers running, open `/auth/login` on the frontend URL. For local test accounts, follow the API's [Seed Data](../resource-reservations-api/README.md#seed-data) instructions.

The frontend stores the access token in `localStorage` and validates the session through the API when the page reloads. Navigation and protected pages depend on the signed-in user's role.

## Development Commands

Run these commands from the web directory:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run lint` | Check the project with ESLint. |
| `npm run build` | Run the TypeScript build, then generate the frontend build in `dist/` with Vite. |
| `npm run preview` | Serve the built frontend locally. Run `npm run build` first. |

Preview still requires the API. Use the preview URL shown in the terminal and include its origin in the API's `CORS_ORIGIN`, then restart the API. Preview serves local build output; it does not deploy the application.
