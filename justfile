[default]
list:
    @just --list

# ---------- dev ----------

# Start dev server and open browser
[group('dev')]
dev:
    (sleep 2 && open http://localhost:3000) &
    npm run dev

# Start Turso local dev database
[group('dev')]
db:
    turso dev --port 8080

# Start dev server and local database together
[group('dev')]
dev-all:
    (sleep 2 && open http://localhost:3000) &
    turso dev --port 8080 &
    npm run dev

# ---------- build ----------

# Production build
[group('build')]
build:
    npm run build

# Start production server
[group('build')]
start:
    npm run start

# ---------- lint / format ----------

# Run ESLint
[group('lint')]
lint:
    npm run lint

# Format all files with prettier
[group('format')]
fmt:
    npx prettier --write .

# Check formatting without writing
[group('format')]
fmt-check:
    npx prettier --check .

# ---------- db ----------

# Run database migrations
[group('db')]
db-migrate:
    npx tsx scripts/migrate.ts

# ---------- ci ----------

# Run all CI checks
[group('ci')]
ci:
    just fmt-check && just lint && just build

# ---------- aliases ----------

[private]
alias f := fmt
[private]
alias b := build
[private]
alias l := lint
