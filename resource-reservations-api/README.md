# resource-reservations API

## Overview

The resource-reservations API manages resources, resource categories, users, and reservations for the web application. It is built with NestJS and TypeORM, stores data in SQL Server, and uses JWT authentication with role-based access to protected routes.

## Prerequisites

- Node.js 22.12 or later.
- npm.
- A reachable SQL Server instance and credentials that can access the application database.

## Setup

1. From the repository root, enter the API directory and install dependencies:

   ```powershell
   cd resource-reservations-api
   npm install
   ```

2. Copy the environment example:

   ```powershell
   Copy-Item .env.example .env
   ```

   On macOS/Linux, use `cp .env.example .env` instead.

3. Create an empty local database in SQL Server, using SQL Server Management Studio or another SQL client. The API creates tables, but does not create the database itself.
4. Edit `.env` using the [environment example](.env.example) as the reference. Set the connection values for that database and replace the placeholder credentials, JWT secret, and seed password with your local values.

## Database

On startup, TypeORM uses `synchronize: true` to create or update tables to match the entities. This configuration is intended for local development only.

## Running

```powershell
npm run start:dev
```

The API listens at `http://localhost:3000` by default; `PORT` in `.env` changes the port. Wait for the Nest startup confirmation in the terminal. To check that the server responds, request `GET /auth/user` without a token: the expected response is `401 Unauthorized` because the route is protected.

## Seed Data

After the API has started once and created the tables, ensure `SEED_PASSWORD` is set in `.env`. In a separate terminal, enter the API directory from the repository root and run:

```powershell
cd resource-reservations-api
npm run seed
```

The seed creates test roles, users, resource categories, and resources. These accounts share the password set in `SEED_PASSWORD`:

| Email | Role |
| --- | --- |
| `admin.seed@example.com` | `ADMIN` |
| `staff.seed@example.com` | `STAFF` |
| `client.seed@example.com` | `CLIENT` |

Running the seed again skips existing records. Changing `SEED_PASSWORD` and rerunning it does not reset existing users' passwords.

## Authentication

Send `POST /auth/login` with a JSON body containing the account's `email` and `password`. A successful response contains `accessToken` and `user`. Include the token in protected requests:

```http
Authorization: Bearer <token>
```

The roles are `ADMIN`, `STAFF`, and `CLIENT`; access depends on the route's allowed roles. Login and authenticated requests also require the user account and its role to be active.

## Development Commands

Run these commands from the API directory:

| Command | Purpose |
| --- | --- |
| `npm run lint` | Check source and test files with Oxlint. |
| `npm test` | Run unit tests with Vitest. |
| `npm run test:cov` | Run unit tests with coverage. |
| `npm run build` | Compile the application with the Nest CLI. |

## End-to-End Tests

`npm run test:e2e` loads `AppModule` and uses the configured environment and SQL Server connection. Point `.env` to an isolated local test database before running it: schema synchronization also runs during test initialization.

The current suite is a scaffold containing a root-route test, not comprehensive API coverage.
