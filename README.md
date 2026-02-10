# Cove Website

## Getting started

```bash
npm install
```

Next, run the development server:

```bash
npm run dev
```

Finally, open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

## Database (Turso)

This app uses [Turso](https://turso.tech) (libSQL) for the feature vote leaderboard.

### Local development

Run a local libSQL server:

```bash
turso dev --port 8080
```

Then apply migrations:

```bash
npm run db:migrate
```

### Production

Set the `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` environment variables to your Turso database credentials, then run the migration.

## Feature Vote Leaderboard

The page is available at `/roadmap`.

- Products are loaded from MDK and filtered to names starting with `Feature:`.
- Voting uses SAT custom amounts.
- Confirmed votes are persisted in Turso and leaderboard rank is sorted by total sats.
