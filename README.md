# Fes Lamp — Next.js e-commerce scaffold

This folder contains a scaffold for the Fes Lamp e-commerce site built with Next.js + TypeScript + Tailwind CSS and Prisma (SQLite for local dev).

Quick start:

1. Copy `.env.example` to `.env` and update values (DATABASE_URL, NEXT_PUBLIC_WHATSAPP_NUMBER, STRIPE_SECRET).
2. Install dependencies:

```bash
cd fes-lamp
npm install
```

3. Initialize Prisma and the database:

```bash
npx prisma migrate dev --name init
```

4. Run the dev server:

```bash
npm run dev
```

Next steps: implement API routes, Stripe server integration, admin CRUD pages, file uploads and polish the design.

Stripe setup:

- Add `STRIPE_SECRET` (server key) and `NEXT_PUBLIC_STRIPE_PUBLISHABLE` (client key) to `.env`.
- Add `NEXT_PUBLIC_BASE_URL` with your site origin (used for success/cancel redirects).

Note: For production you must validate payments server-side via Stripe webhooks before marking orders as paid.

Stripe webhook setup:

- Add `STRIPE_WEBHOOK_SECRET` (signing secret) to your `.env`.
- Expose the webhook endpoint `/api/checkout/webhook` to Stripe (use the full site URL).
- In development you can use `stripe listen --forward-to localhost:3000/api/checkout/webhook` to forward events.

The webhook implementation creates an `Order` in the database when a `checkout.session.completed` event is received.
