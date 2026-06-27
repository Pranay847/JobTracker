# JobTracker

JobTracker is a full-stack job application tracker with a React/Vite frontend and an Express/SQLite backend. It replaces spreadsheet-based tracking with authenticated workflows for saving applications, updating statuses, and reviewing the job search pipeline in one place.

## Features

- Register and log in with hashed passwords and JWT-based authentication.
- Create, view, update, and delete job applications.
- Track company, role, status, notes, and application metadata.
- Store data locally with SQLite for simple development and demo usage.
- Separate frontend and backend codebases so the UI and API can evolve independently.

## Tech Stack

- **Frontend:** React, Vite, React Router
- **Backend:** Node.js, Express
- **Auth:** bcrypt, JSON Web Tokens
- **Database:** SQLite
- **Tooling:** ESLint, npm scripts

## Project Layout

```text
.
├── BackEnd/
│   ├── index.js
│   ├── database.js
│   ├── routes/
│   ├── middleware/
│   └── package.json
└── FrontEnd/
    ├── src/
    ├── public/
    ├── vite.config.js
    └── package.json
```

## Local Development

Install backend dependencies:

```powershell
cd BackEnd
npm install
npm run dev
```

Install frontend dependencies in a second terminal:

```powershell
cd FrontEnd
npm install
npm run dev
```

The frontend runs through Vite, and the backend starts from `BackEnd/index.js`.

## Engineering Highlights

- Designed an Express API with separate auth and job routes.
- Added password hashing and token-based authentication for user sessions.
- Used SQLite for a lightweight persistence layer suitable for demos and local development.
- Split the app into `FrontEnd` and `BackEnd` folders to keep UI, routing, auth, and persistence concerns organized.

## Resume Highlights

- Built a full-stack job tracking app with React, Vite, Express, SQLite, bcrypt, and JWT authentication.
- Implemented authenticated CRUD workflows for managing job applications and status updates.
- Replaced spreadsheet-based tracking with a structured web app for organizing the job search pipeline.
