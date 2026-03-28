# Supabase Starter

This starter configures Supabase Auth to use cookies, making the user's session available throughout the entire Next.js app - Client Components, Server Components, Route Handlers, Server Actions and Middleware.

## Deploy your own

The Vercel deployment will guide you through creating a Supabase account and project. After installation of the Supabase integration, all relevant environment variables will be set up so that the project is usable immediately after deployment 🚀

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&integration-ids=oac_jUduyjQgOyzev1fjrW83NYOv)

## How to use

1. Create a [new Supabase project](https://database.new)
1. Run `npx create-next-app -e with-supabase` to create a Next.js app using the Supabase Starter template
1. Use `cd` to change into the app's directory
1. Run `npm install` to install dependencies
1. Rename `.env.local.example` to `.env.local` and update the values for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)
1. Run `npm run dev` to start the local development server

> Check out [the docs for Local Development](https://supabase.com/docs/guides/getting-started/local-development) to also run Supabase locally.

### Create a Supabase client

Check out the [`/app/_examples`](./app/_examples/) folder for an example of creating a Supabase client in:

- [Client Components](./app/_examples/client-component/page.tsx)
- [Server Components](./app/_examples/server-component/page.tsx)
- [Route Handlers](./app/_examples/route-handler/route.ts)
- [Server Actions](./app/_examples/server-action/page.tsx)

### Create `todo` table and seed with data (optional)

Navigate to [your project's SQL Editor](https://app.supabase.com/project/_/sql), click `New query`, paste the contents of the [init.sql](./supabase/migrations/20230618024722_init.sql) file and click `RUN`.

This will create a basic `todos` table, enable Row Level Security (RLS), and write RLS policies enabling `select` and `insert` actions for `authenticated` users.

To seed your `todos` table with some dummy data, run the contents of the [seed.sql](./supabase/seed.sql) file.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## Supplier stock sync (Syntech)

The project includes a dedicated stock-only sync script that pulls from the Syntech update feed and updates:

- `products.totalStock`
- `products.inStock`
- `products.nextShipmentEta`
- `product_inventory.quantity` per warehouse (`CPT`, `JHB`, `DBN`)

### One-off run

```bash
pnpm run stock:sync
```

Useful options:

```bash
# Validate feed load without DB writes
pnpm run stock:sync -- --dry-run

# Use a local feed file
pnpm run stock:sync -- --feed-path ./syntech-feed.json

# Process a subset
pnpm run stock:sync -- --limit 100
```

### Continuous periodic run (single process)

```bash
pnpm run stock:sync:watch
```

This runs the sync every 15 minutes. To change frequency:

```bash
pnpm run stock:sync -- --interval-minutes 5
```

### Scheduler examples

Windows Task Scheduler action:

```powershell
pnpm --dir C:\Users\ncbph\Documents\Development\digitalshopper run stock:sync
```

Linux cron (every 15 minutes):

```cron
*/15 * * * * cd /path/to/digitalshopper && pnpm run stock:sync >> /var/log/digitalshopper-stock-sync.log 2>&1
```

Optional environment overrides:

- `SYNTECH_STOCK_FEED_URL` (defaults to Syntech `syntech-json-update` feed)
- `SYNTECH_STOCK_FEED_PATH` (path to a local JSON file, mainly for testing)

### Vercel cron integration (every 2 days)

This project includes a Vercel cron definition in `vercel.json`:

- Path: `/api/cron/syntech-stock`
- Schedule: `0 3 */2 * *` (03:00 UTC every 2 days)

The route handler lives in `app/api/cron/syntech-stock/route.ts` and runs the same stock sync logic used by the CLI command.

Security recommendation:

1. Set a `CRON_SECRET` environment variable in Vercel.
1. Redeploy after setting the secret.

When `CRON_SECRET` is set, the route requires:

- `Authorization: Bearer <CRON_SECRET>`

This allows Vercel Cron to call the route securely while blocking unauthorized requests.

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
- [Next.js Auth Helpers Docs](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
