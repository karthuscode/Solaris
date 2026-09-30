# Development

## Requirements

Node.js 22.13 or later and npm. The committed lockfile is the source of dependency versions.

```sh
npm ci
npm run dev
```

The development server prints a loopback URL, normally `http://127.0.0.1:5173`. The visual preview can render the first-event draft before a local database exists. Forms and organizer operations need D1 migrations and the relevant environment values.

## Local data

Build once to generate the local Worker configuration:

```sh
npm run build
```

Apply the migrations in order to a fresh local database:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_chubby_shard.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_yellow_obadiah_stane.sql
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0002_strange_demogoblin.sql
```

Each command above is for a fresh local database; do not replay migrations already applied. `npm start` previews the built Worker using the same local state. `npm run db:generate` generates migrations when the schema changes.

## Configuration

Copy `.env.example` to `.dev.vars` and replace the placeholders locally. Both local environment files and database/storage state are excluded from Git. Hosted values are managed through Sites; local files do not configure the hosted version.

The organizer area is `/admin`. Email codes require an allowlisted organizer address and a verified Brevo sender. Attendance confirmation uses the same transactional sender. A local visual preview does not send mail until these values are configured.

## Checks

```sh
npx tsc --noEmit
npm run build
```

For the existing functional checks and remaining production requirements, see [project status](status.md). The first deployed preview was manually checked; this repository does not yet contain an automated end-to-end suite.

## Hosting

The existing private Site uses logical `DB` and `BUCKET` bindings from `.openai/hosting.json`. Sites manages the actual D1/R2 resources and publishing. Use the existing Site for updates; cloning this repository does not provision a new hosted database or storage bucket.
