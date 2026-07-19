# Cove Website

The repository contains two deployments:

- `apps/site`: Astro static site deployed as Cloudflare Worker static assets at
  `covebitcoinwallet.com`
- the root Next.js app: roadmap and MoneyDevKit runtime deployed on Vercel at
  `roadmap.covebitcoinwallet.com`

The Astro homepage calls only the narrow donation, checkout-status, and
feature-vote APIs on the roadmap origin. The generic MDK endpoint remains
same-origin to the Next.js app.

## Getting started

```bash
npm install
```

Run the Next.js roadmap and payment app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Run the Astro site in another terminal:

```bash
npm run dev:site
```

Open [http://localhost:4321](http://localhost:4321). Next.js permits this
origin in development; set `COVE_SITE_ORIGIN` when using another site origin.

Build both deployments with `npm run build`, or build them independently with
`npm run build:site` and `npm run build:roadmap`.

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

The page is available at `https://roadmap.covebitcoinwallet.com/`. The apex
site redirects `/roadmap` and `/next-features` there with temporary redirects
in `public/_redirects`.

- Products are loaded from MDK and filtered to names starting with `Feature:`.
- Voting uses SAT custom amounts.
- Only `PAYMENT_RECEIVED` checkouts are persisted in Turso; partial or merely
  confirmed payments are not votes.
- Leaderboard rank is sorted by total sats.

### MDK webhooks

Configure an MDK dashboard webhook endpoint for:

```text
https://roadmap.covebitcoinwallet.com/api/webhooks/mdk
```

Subscribe to `checkout.completed` and set `MDK_WEBHOOK_SECRET` to the endpoint
signing secret. Webhooks record feature-vote payments server-side, while the
existing browser polling and confirmation route remain the fallback path.

## Deployment

### Cloudflare

Build with `npm run build:site` and deploy `apps/site` using
`apps/site/wrangler.jsonc`. The Worker contains static assets only; path
redirects are handled by the static-assets `_redirects` file. Point the apex
hostname to this Worker. Configure a Cloudflare Redirect Rule from `www` to the
same path on the apex hostname so the previous Next.js hostname redirect is
preserved without Worker code.

### Vercel

Deploy the repository root as the Next.js project and attach
`roadmap.covebitcoinwallet.com`. Configure:

- `COVE_SITE_ORIGIN=https://covebitcoinwallet.com`
- `MDK_ACCESS_TOKEN`
- `MDK_WEBHOOK_SECRET`
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

Point the roadmap DNS record to Vercel using the value Vercel provides. DNS
selects the deployment by hostname; no separate routing Worker is required.

Keep the temporary `307` roadmap redirects until the split is manually
verified, then change them to `308` if the subdomain should be permanent.
