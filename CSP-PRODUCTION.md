# Production Hardening

## CSP Header (Apache)
```apache
Header set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
```

## CSP Header (Nginx)
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'" always;
```

## Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
```

## Backend Price Validation
```javascript
// CRITICAL: Never trust client prices
const PRICES = {
  'Döner Kebab': 6.50,
  'Dürüm': 7.00,
  // ...
};

app.post('/cart/add', (req, res) => {
  const serverPrice = PRICES[req.body.name];
  if (!serverPrice) return res.status(400).end();
  // Use serverPrice, ignore req.body.price
});
```

## File Updates Required
Replace in HTML:
- `<script src="menu-script.js">` → `<script src="menu-script-improved.js">`
- `<link href="menu-styles.css">` → `<link href="menu-styles-improved.css">`
- Add CSP meta tag (line 6 of menu-section.html already added)
- Change all `<div class="product-card">` → `<article class="product-card" data-price="X.XX" data-name="Product Name">`
- Add `type="button"` to all buttons
- Add `aria-label` to buttons
- Add `role="tablist"` to category-tabs
- Add `role="tab"` and `aria-selected` to tab buttons
- Add `aria-hidden="true"` to decorative SVGs