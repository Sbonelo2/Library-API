# Library-API

A small Express + TypeScript REST API for managing authors and books. This repository contains a minimal library API with routes, models, and middleware organized under `src/`.

## What this project provides

- CRUD endpoints for authors and books
- Simple TypeScript + Express server
- Basic middleware wiring in `src/middleware` (validation / parsing / security)
- Route definitions in `src/routes` and models in `src/models`

## Tech

- Node.js + TypeScript
- Express 5
- ts-node for running TypeScript directly
- nodemon for local development

## Requirements

- Node.js (v16+ recommended)
- npm (or yarn)

## Install

Install dependencies:

```bash
npm install
```

## Run the server

The project includes two npm scripts in `package.json`:

- `npm start` — runs the server with `ts-node`
- `npm run dev` — runs the server with `nodemon` + `ts-node` for hot reload during development

Start in development mode:

```bash
npm run dev
```

Or run normally:

```bash
npm start
```

By default the server implementation is in `src/server.ts` — open that file to change the port or other settings.

## API Overview

Base URL: http://localhost:3000 (confirm port in `src/server.ts`)

Authors endpoints

- GET /authors — list all authors
- GET /authors/:id — get author by id
- POST /authors — create an author
- PUT /authors/:id — update an author
- DELETE /authors/:id — delete an author

Books endpoints

- GET /books — list all books
- GET /books/:id — get a book by id
- POST /books — create a book
- PUT /books/:id — update a book
- DELETE /books/:id — delete a book

Example request bodies

Author (POST /authors):

```json
{
  "name": "Jane Austen",
  "bio": "English novelist",
  "birthYear": 1775
}
```

Book (POST /books):

```json
{
  "title": "Pride and Prejudice",
  "authorId": "<author-id>",
  "publishedYear": 1813,
  "genre": "Fiction"
}
```

Adjust the fields to match the exact model shapes defined in `src/models/author.ts` and `src/models/book.ts`.

## Project layout

- `src/server.ts` — application entry
- `src/middleware` — central middleware (parsers, validators, security)
- `src/models` — data models (`author.ts`, `book.ts`)
- `src/routes` — route handlers (`authors.ts`, `books.ts`)

## Notes & next steps

- This project runs TypeScript directly via `ts-node` for development. For production deployment, consider building to JavaScript (`tsc`) and running a compiled bundle.
- Add request validation and tests for routes (a quick win: add Jest or Vitest and a couple of endpoint tests).

## Contributing

PRs welcome. Keep changes small and add tests when adding features or fixing bugs.

## License

ISC

## Contact

If you have questions about this repo, check the code under `src/` and open an issue on the repository.



<img src="https://socialify.git.ci/Sbonelo2/Library-API/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="Library-API" width="640" height="320" />