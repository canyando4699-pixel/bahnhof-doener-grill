# Bahnhof Döner Grill – Official Website

Production website for Bahnhof Döner Grill, 35066 Frankenberg, Germany.

---

## 📍 Location

Am Bahnhof 10  
35066 Frankenberg  
Germany  

Phone: +49 6451 240925  

Opening Hours:  
Mon–Thu & Sun: 10:00 – 23:00  
Fri & Sat: 10:00 – 24:00  

---

## 🏗 Architecture

- Framework: Next.js (App Router)
- Production build: `next build`
- Optimized images (AVIF / WebP)
- LCP-optimized hero section
- Marble background only on homepage
- Dark overlay + subtle CSS noise layer
- Images stored locally (`/public/images`)
- Static-optimized where possible

---

## 🔐 Security

- Security headers enabled:
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy
  - Permissions-Policy
- No third-party trackers
- No marketing cookies
- Only technically required cookies (if provided by hosting)
- GDPR compliant

Repository security rules:
- No `.env` files committed
- No secrets in source code
- No deployment tokens
- Proper `.gitignore` configuration
- Production builds only

---

## ⚙ Development Setup

Install dependencies:

```bash
npm install
npm run dev
