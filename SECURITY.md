# Security Hardening Guide

## Implemented Security Measures

### 1. Content Security Policy (CSP)
```html
<meta http-equiv="Content-Security-Policy"
  content="default-src 'self';
           script-src 'self';
           style-src 'self' https://fonts.googleapis.com;
           font-src 'self' https://fonts.gstatic.com;
           img-src 'self' data:;
           connect-src 'self';
           frame-ancestors 'none';
           base-uri 'self';
           form-action 'self';">
```

### 2. XSS Prevention
- No `innerHTML` usage - only `textContent` and `createTextNode`
- Input validation with whitelisted categories
- Price validation (numeric, max cap)
- Data attributes validated before DOM insertion

### 3. Price Manipulation Protection
- Canonical price stored in `data-price` attribute
- Server-side validation required before checkout
- Client-side validation as defense-in-depth
- Max price cap constant

### 4. DOM Injection Prevention
- IIFE encapsulation (no global pollution)
- Strict mode enabled
- `textContent` only for user-facing text
- No dynamic script/style injection from user input

### 5. Accessibility Improvements
- ARIA roles: `tablist`, `tab`, `region`
- `aria-selected` state management
- `aria-label` on action buttons
- `aria-live="polite"` for dynamic content
- Semantic HTML (`article`, proper button types)
- Focus indicators (`:focus-visible`)
- Screen reader support (`aria-hidden` on decorative elements)

### 6. Performance Optimizations
- `will-change` only on hover-enabled elements
- Transition properties reduced to essential properties
- `prefers-reduced-motion` respect
- Event delegation considered
- DOM query caching

## Production Deployment Checklist

### Server-Side Configuration

#### Apache `.htaccess`
```apache
# Security Headers
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "geolocation=(), microphone=(), camera=()"

# CSP (use server config instead of meta tag in production)
Header always set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"

# HTTPS Enforcement
Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
```

#### Nginx
```nginx
# Security Headers
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

# CSP
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';" always;

# HSTS
add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;
```

### Backend Integration Requirements

**CRITICAL**: Never trust client-side pricing data.

```javascript
// Backend validation example (Node.js/Express)
const PRODUCT_CATALOG = {
  'Döner Kebab': { price: 6.50, category: 'doener' },
  'Dürüm': { price: 7.00, category: 'doener' },
  // ... rest of catalog
};

app.post('/api/cart/add', (req, res) => {
  const { productName, clientPrice, category } = req.body;

  // ALWAYS validate against server-side catalog
  const product = PRODUCT_CATALOG[productName];

  if (!product) {
    return res.status(400).json({ error: 'Invalid product' });
  }

  // Ignore client-sent price, use server price
  const validatedPrice = product.price;

  // Process order with validated data
  addToCart(productName, validatedPrice, product.category);

  res.json({ success: true, price: validatedPrice });
});
```

### Additional Hardening

1. **Subresource Integrity (SRI)** for external resources:
```html
<link rel="stylesheet" href="https://fonts.googleapis.com/..."
  integrity="sha384-..." crossorigin="anonymous">
```

2. **Rate Limiting** on cart endpoints

3. **CSRF Protection** for state-changing operations

4. **Input Sanitization** on server-side

5. **Logging & Monitoring** for suspicious activity

6. **TLS 1.3** minimum with strong cipher suites

## File Structure

- `menu-section-secure.html` - Hardened HTML with CSP
- `menu-script-secure.js` - IIFE module, XSS-safe, validated
- `menu-styles-optimized.css` - Performance-optimized styles
- `SECURITY.md` - This file

## Testing

1. Test CSP violations in browser console
2. Attempt XSS via DevTools (modify data attributes)
3. Verify price validation rejects invalid values
4. Check ARIA attributes with screen reader
5. Validate focus management with keyboard only
6. Test reduced motion preference