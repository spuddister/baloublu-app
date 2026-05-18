# Baloublu

**Art prints, handmade pottery, and custom commissions — a static storefront site.**

---

## Features

- Art print shop with category filtering (Digital, Physical, Originals)
- Handmade pottery listings
- Commissions section
- Contact form powered by [Netlify Forms](https://docs.netlify.com/forms/setup/)
- Fully responsive with a mobile hamburger menu

## Tech Stack

| Layer | Detail |
|-------|--------|
| HTML | Semantic single-page layout |
| CSS | Custom properties, CSS Grid, no framework |
| JS | Vanilla — no build step required |
| Hosting | Netlify (static) |
| Fonts | [Nunito](https://fonts.google.com/specimen/Nunito) via Google Fonts |

## Project Structure

```
baloublu-app/
├── index.html       # Page structure and content
├── styles.css       # All styling
├── main.js          # Interactivity (nav, filtering, form)
├── logo.svg         # Primary logo
├── logo-minimized.svg
└── logo.png
```

## Local Development

No build step needed — open directly in a browser or use any static file server:

```bash
npx serve .
```

## Deployment

The site is configured for Netlify. Push to `main` and Netlify will deploy automatically.

To receive contact form submissions by email:
1. Deploy to Netlify
2. Go to **Site → Forms → contact → Notifications**
3. Add an email notification
