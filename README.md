# Fresh AlBurj / فريش البرج
Next.js 14 + Tailwind. Run: `npm install && npm run dev` -> http://localhost:3000
- Edit payment numbers + WhatsApp in `lib/payments.js`.
- Product photos: drop files in `public/products/<product-id>.jpg` (see README there), or paste a URL in the admin table.
- Admin: /admin (demo password `admin123`, env NEXT_PUBLIC_ADMIN_PASS).
- Data is stored in the browser (demo). For prices/orders shared by all customers, connect a database/API.

## Cloudflare Pages
Build command: `npm run build` | Output directory: `out` | Env var: `NODE_VERSION=20`

## Server (orders, prices, photos, WhatsApp alert) — Cloudflare Pages Functions
The `functions/` folder runs on Cloudflare. In the Pages project settings you need:
1. KV namespace bound with the variable name `DB`.
2. Variables: `ADMIN_PASSWORD` (admin login), `OWNER_PHONE` (e.g. +201011411026) and `CALLMEBOT_KEY` (from callmebot.com) for the WhatsApp alert.
Without them the site still works, but orders/prices stay on each device.
