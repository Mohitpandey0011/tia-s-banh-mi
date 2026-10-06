# Tia's Bánh Mì website

A new website for Tia's Bánh Mì (Cavill Lane, Surfers Paradise). It follows
the structure of the Roll'd site (menu, promotions, catering, loyalty club)
using Tia's own name, menu and details, and fixes the weak spots found in
`research/rolld-site-review.md`.

Ordering is built into this site. Every "Order now" button opens
`order.html`, so customers never leave the new site. The old TapTouch store is
not linked from anywhere and has not been changed.

## Pages

| Page | What it does |
|---|---|
| `index.html` | Home: hero, featured bánh mì, menu categories, promotions, Crunch Club teaser, catering, hours and map |
| `order.html` | Online ordering for pick-up: add dishes, notes per item, pick-up time (ASAP or scheduled from opening hours), Crunch Club points, send order |
| `menu.html` | Full menu by category, with search, Vegetarian/Popular filters and Vietnamese names |
| `promotions.html` | One card per offer: what you get, where it works, terms, shareable link (`promotions.html#early-bird`) |
| `catering.html` | Same-day share packs plus next-day catering boxes, "suggest boxes for my group", live total, request form |
| `club.html` | Crunch Club loyalty: worked example, points calculator, rewards list, Fresh/Crispy/Golden levels, top-ups, join form |
| `find-us.html` | Address, map, opening hours with live "open now" status |
| `faq.html` | FAQs, each with its own link (`faq.html#allergies`) |

## Preview it

Double-click `index.html`. It works straight from the folder with no
install. Or run a local server:

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Put it online

It's a plain static site (HTML, CSS, JavaScript), so any host works:

- **GitHub Pages:** repo **Settings → Pages → Deploy from a branch**,
  choose the branch and `/ (root)`. Free for public repos; private repos
  need a paid GitHub plan.
- **Netlify or Cloudflare Pages:** drag the folder in, or connect the repo.
  No build command, publish directory `/`.

## Editing

Everything you'd normally change is in two files:

- **`assets/js/config.js`**: phone, address, opening hours, order link,
  social links, form settings, and the preview banner switch.
- **`assets/js/data.js`**: menu items and prices, promotions, catering
  boxes, Crunch Club rules and rewards, FAQs.

The pages read from these files, so there's no need to touch the HTML to
change a price or add a dish.

### Orders and forms (pick-up orders, catering requests, Crunch Club sign-ups)

The basket is saved in the customer's browser, so it stays filled while they
move between pages. There's no server, so orders and forms are delivered
like this:

1. If `formEndpoint` is set in `config.js` (e.g. a free
   [Formspree](https://formspree.io) form URL), submissions are sent there
   and land in the shop's inbox.
2. Otherwise the customer sees a summary of their order or request with
   buttons to **email** it (if `email` is set), **text** it to
   0449 797 339, or **call**. Nothing gets lost.

Customers pay in store when they pick up. Taking card payments online needs
a payment provider (e.g. Square or Stripe) connected to a small backend.
That's a later step.

## Before going live: please confirm

Details came from the TapTouch store, Uber Eats and the Cavill Lane centre
listing. Some items couldn't be seen in full, so check these:

**Menu (`data.js`)**
- [ ] Bánh mì prices: Classic Pork Roll $13.50, BBQ Pork, Lemongrass Chicken
  and Tuna $14.50 came from the online store. Lemongrass Beef, Crispy Pork,
  Pork Meatballs and BBQ Prawn are assumed $14.50.
- [ ] Prices for everything showing "Price on order" (`price: null`):
  Avocado & Salad, Tofu & Salad, street food, rice dishes, phở, drinks.
- [ ] Dishes marked `draft: true` (shown with a "To confirm" tag) were
  guessed from the store's category names: phở, noodle soup, vermicelli,
  curry, sides and drinks. Replace them with the real dishes.
- [ ] Vegetarian tags, and whether fish sauce or egg is used in those dishes.
- [ ] Add food photos if available (none are used yet).

**Promotions, catering and club (`data.js`):** these are proposals. Set the
real numbers.
- [ ] Crunch Combo ($7), Early Bird Coffee ($3 before 10am), Catering Bonus
  ($30 credit on $300+), free coffee on joining.
- [ ] Catering box contents and prices, share pack prices, 2pm cutoff,
  delivery fee ($10), radius (5 km) and minimum ($120).
- [ ] Crunch Club: 10 points per $1, 100 points = $1, levels at 1,500 and
  4,000 points, rewards, top-up bonuses, 12-month expiry.
- [ ] **How points will be tracked.** The site explains the club and
  collects sign-ups, but points need a loyalty system at the counter. Ask
  TapTouch whether their POS has loyalty built in, or use a separate
  loyalty app.

**Ordering**
- [ ] Set `formEndpoint` (or `email`) so orders arrive in your inbox
  instead of by text message.
- [ ] Pick-up lead time (15 minutes) and time steps (15 minutes) in
  `config.js`.
- [ ] Dishes without a price can still be ordered and show "Price TBC".
  Add prices in `data.js` and they appear automatically.

**Config (`config.js`)**
- [ ] Opening hours (currently 8am–9pm every day).
- [ ] Shop email and/or `formEndpoint`, so form submissions arrive directly.
- [ ] Instagram, Facebook and TikTok links.
- [ ] Set `showPreviewBanner: false` to remove the preview strip and the
  "To confirm" tags.

## What's improved over the Roll'd site

- Ordering lives on the same site, with one basket and one flow, instead of
  several platforms.
- The loyalty page explains everything without signing in: a worked
  example, a calculator, rewards, levels and expiry rules.
- Opening hours, address, phone and live "open now" status on every page.
- Catering shows clear cutoffs, a live total and a "suggest for my group"
  helper.
- Accessible: keyboard friendly, skip link, labelled forms, screen-reader
  friendly points display, works on screens from 320px wide.

## Files

```
index.html, order.html, menu.html, promotions.html, catering.html,
club.html, find-us.html, faq.html, 404.html
assets/css/styles.css      all styling (colours at the top)
assets/js/config.js        business details
assets/js/data.js          menu, promotions, catering, club, FAQs
assets/js/site.js          header, footer, hours, open-now, forms
assets/js/<page>.js        page-specific behaviour
assets/img/                logo mark and hero illustration (SVG)
research/                  Roll'd website review notes
```
