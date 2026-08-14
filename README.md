# JobTracker

A full-stack job application tracker for managing your job search in one place, instead of a spreadsheet.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [API](#api)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Description

JobTracker replaces spreadsheet-based tracking with a small full-stack app: a React frontend talking to an Express/SQLite backend over a JWT-authenticated API. Register, log in, and log applications as you send them — company, role, status, notes — then update status as you hear back.

## Features

- Register and log in with hashed passwords (bcrypt) and JWT-based sessions.
- Create, view, update, and delete job applications.
- Track company, role, status (`Applied`, `Interviewing`, `Rejected`, `Offer`), notes, and application date.
- Filter the job list by status.
- SQLite storage — one file, created and seeded automatically, no separate database server.

## Tech Stack

- Frontend: React 19, Vite, React Router
- Backend: Node.js, Express 5
- Auth: bcrypt, JSON Web Tokens
- Database: SQLite
- Tooling: ESLint, npm scripts

## Getting Started

### Prerequisites

- Node.js (v18+) and npm
- Two terminals — the frontend and backend run as separate processes

### Installation

Clone the repo:

```
git clone https://github.com/Pranay847/JobTracker.git
cd JobTracker
```

Install backend dependencies:

```
cd BackEnd
npm install
```

Install frontend dependencies, in a second terminal:

```
cd FrontEnd
npm install
```

Optional — create `BackEnd/.env` to override the defaults:

```
PORT=8000
JWT_SECRET=replace-with-a-real-secret
```

Without `JWT_SECRET` set, the server falls back to a hardcoded default. That's fine for running it locally, not for deploying it anywhere real.

### Usage

Start the backend:

```
cd BackEnd
npm run dev
```

Runs on `http://localhost:8000` and creates `jobtracker.db` on first launch — no migration step.

Start the frontend:

```
cd FrontEnd
npm run dev
```

Runs on Vite's default port, `http://localhost:5173`. Open that in your browser, register an account, and start logging applications.

Note: the frontend's fetch calls point at `http://localhost:8000` directly rather than through an env var, so the backend has to be running on port 8000 for login, register, and the job list to work.

## API

`/api/jobs` routes require `Authorization: Bearer <token>`, returned by `/register` or `/login`.

**Auth**

| Method | Path | Body | Returns |
|---|---|---|---|
| POST | `/api/auth/register` | `name, email, password, confirmPassword` | user + token |
| POST | `/api/auth/login` | `email, password` | user + token |

**Jobs**

| Method | Path | Body | Does |
|---|---|---|---|
| GET | `/api/jobs` | — (optional `?status=`) | list the caller's jobs, newest first |
| POST | `/api/jobs` | `company, title, status, applicationDate?, notes?` | create a job |
| PUT | `/api/jobs/:id` | same as create | update a job |
| DELETE | `/api/jobs/:id` | — | delete a job |

`status` must be one of `applied`, `interviewing`, `rejected`, `offer` (case-insensitive coming in, stored capitalized).

`GET /api/health` — liveness check, no auth required.

## Project Structure

```
.
├── BackEnd/
│   ├── index.js        entry point, mounts routes
│   ├── database.js     SQLite connection + schema
│   ├── routes/          auth.js, jobs.js
│   ├── middleware/      JWT verification
│   └── package.json
└── FrontEnd/
    ├── src/             pages, components, styles
    ├── public/
    ├── vite.config.js
    └── package.json
```

## Contributing

1. Fork the repo.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes.
4. Open a pull request.

## License

No license file yet — all rights reserved by default until one is added.

## Acknowledgments

Built with React, Vite, Express, SQLite, bcrypt, and jsonwebtoken.
