# Fresh AlBurj / فريش البرج
Next.js 14 + Tailwind. Run: `npm install && npm run dev` -> http://localhost:3000
- Edit payment numbers + WhatsApp in `lib/payments.js`.
- Product photos: drop files in `public/products/<product-id>.jpg` (see README there), or paste a URL in the admin table.
- Admin: /admin (demo password `admin123`, env NEXT_PUBLIC_ADMIN_PASS).
- Data is stored in the browser (demo). For prices/orders shared by all customers, connect a database/API.
