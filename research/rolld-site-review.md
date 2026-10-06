# Roll'd website review, second pass (6 Oct 2026)

Focus: Menu, Promotions, Catering, Rollers Club. Builds on the earlier
`rolld-analysis.md` (Oasis store, loyalty, FAQ).

**How this was gathered:** this environment's network policy blocks
rolld.com.au, so the pages could not be opened directly. Everything below
comes from search-engine copies of rolld.com.au, rolld.co,
loyalty.nomnie.com and third-party listings (DoorDash, shopping centres,
press). Those copies were taken at different times, so **treat prices as
indicative** and recheck anything marked *(verify)*.

Quoted Roll'd copy is here for reference only. Don't reuse it on our site.

---

## 1. Biggest change: the site has moved off Shopify

The earlier analysis described a Shopify storefront. Current evidence says
rolld.com.au is now **WordPress on WP Engine**:

- Host alias `rolldausprod.wpenginepowered.com`
- Files under `/wp-content/uploads/2026/03/...` (allergen guide, March 2026)
- New URL patterns: `/menu/`, `/menu/banh-mi/`, `/promotions/`,
  `/rollers-club/`, `/catering/`, `/faqs/`, `/store-category/wa/`
- Old Shopify URLs (`/collections/...`, `/pages/...`, `/blogs/stores/...`)
  are still indexed, probably as redirects.
- `rolld.co` serves the same site, with New Zealand under `rolld.co/nz/`.

So some weaknesses in the first analysis may be fixed now (old
myshopify.com store links, the `#` "Join Rollers Club" header link, store
pages with no hours) *(verify)*.

---

## 2. Menu

### Structure
`/menu/` landing page → category page → one page per item, e.g.
`/menu/banh-mi/crispy-chicken-banhmi/`,
`/menu/soldiers/lemongrass-beef-soldier/`,
`/menu/com/roast-pork-crackling/`.

Categories mix Vietnamese names with English labels:

| Category | URL | Notes |
|---|---|---|
| Bánh Mì | `/menu/banh-mi/` | Signature item |
| Soldiers® (rice paper rolls) | `/menu/soldiers/`, `/menu/freshrolls/` | Rolls are branded with a trademarked name, "Soldiers®" |
| Bao | `/menu/bao/` | |
| Bún (noodle salad) | | |
| Cơm (rice) | `/menu/com/` | |
| Gỏi (salad) | | |
| Súp (noodle soup) | `/menu/noodle-soups/` | |
| Phở | `/menu/pho/` | |
| Sides | `/menu/sides/` | |
| Vietnamese Beverages | `/menu/vietnamese-beverages/` | |
| Group Feeds | `/menu/group-feeds/` | Bundles for sharing, see §4 |

Dietary views have their own URLs, e.g. `/menu/low-gluten-options/`.

### Items and indicative prices
| Category | Items seen | Price |
|---|---|---|
| Bánh Mì | Lemongrass Chilli Chicken, Roast Pork & Crackling, BBQ Chicken, Lemongrass Beef, Crispy Chicken, Pepper Beef Steak, Tofu, Plant-Based Lemongrass Chilli "Chicken" | $12.50 (some listings show $15.50) |
| Soldiers® | Garlic Prawn, BBQ Chicken, Lemongrass Beef, Poached Chicken Breast & Avo, Crispy Flathead & Avo / Lime Crusted Fish & Avo, Pork & Prawn, Tofu, Crispy Chicken, Roast Duck; Low Carb versions (Flathead, Poached Chicken, Tofu) | $4.70 each, Roast Duck $4.90 |
| Bao | BBQ Chicken, Crispy Chicken, Crispy Prawn, Roast Pork & Crackling, Tofu, Crispy Flathead. Each with slaw, herbs and chilli mayo | $6.50 |
| Bún / Cơm | BBQ Chicken, Roast Pork & Crackling, Tofu & Veg Spring Rolls, Crispy Chicken Ribs/Wings, Lemongrass Beef | about $16.90 |
| Phở | Sliced Rare Beef, Mixed Beef & Chicken, Shredded Chicken, Seafood, Mushroom & Tofu | $16.90 (older listings $13.90) |
| Súp (seasonal) | Bún Bò Huế, Bánh Canh Cua, Mì Tôm Thịt, Súp Mì | Sold as "mum's secret recipes" |
| Gỏi | Poached Chicken, Lemongrass Beef, Lotus Stem & Duck | $10.50–$11.90 (old) |
| Sides | Sweet Potato Fries, Vegetable Spring Rolls (3), turmeric chicken wings | $5.50 in store, $7.40 on DoorDash |
| Drinks | Vietnamese Iced Coffee and others | — |

### Copy and tone
- Each category has a short, punchy intro line. Bánh mì: "The perfect
  fusion of French inspired food enriched with vibrant Vietnamese flavours."
  Roast pork: "These two pack a punch, and a crunch."
- Freshness: rolls are "hand Roll'd fresh throughout the day, every day."
- Ingredients: the plant-based bánh mì lists every component, e.g. "100%
  plant-based soy protein (clean label, non-GMO)".

### Dietary info
- Claims a "100% nut-free" menu.
- Items are marked VG / V / pescatarian, and there's a low-gluten
  disclaimer (no gluten-free claim because the kitchen handles everything).
- A **downloadable Dietary & Allergen Guide PDF** is reissued every few
  months (Nov 2024, Jan 2026, Mar 2026). It covers nuts, dairy, egg, gluten,
  sesame, fish/shellfish, soy and MSG.
- In-store prices are lower than delivery-app prices.

---

## 3. Promotions

### Structure
`/promotions/` index → one landing page per promo
(`/promotions/roll-into-a-meal`, `/promotions/product-of-the-year-2023/`).
There are also events pages (`/events/cheers-to-10-years/`) and story
pages (`/food/sarah-keeps-it-fresh/`).

### Recent promotions
| Promo | Mechanics | Channels / terms |
|---|---|---|
| **Roll Into A Meal** | Add a regular drink plus a side or Fresh Roll for $7 | In store, app and online. Not on UberEats/DoorDash. Airport prices vary |
| **Catering bonus** | Spend $300+ on catering 1–30 June, get $100 Roll'd Dollars for your next order | Links catering to the loyalty program |
| **NEW Group Feeds** | Crowd favourites bundled together, no notice needed | App and web, pickup or delivery |
| **Win a trip** | "Eat More Roll'd – More Chances To Win!" | Runs on a separate site (rolldwinatrip.com.au) |
| **Email sign-up** | `/rolld-subscription/`: join the mailing list to enter competitions | Grows the email list |
| **Product of the Year 2023** | Award badge used as a promo | — |

Each promo page follows the same pattern: hero image, what you get, where
it applies, T&Cs, and an order button.

---

## 4. Catering and group food

Roll'd runs **two speeds** of group ordering.

### a) Group Feeds and Family Bundles: same day, no notice
| Bundle | Serves | Price |
|---|---|---|
| Soldiers & Bao Share Feed | 4–6 | $84.70 |
| Bao Share Feed | 4–6 | — |
| Soldiers & Bánh Mì Feed | 4–6 | — |
| Soldiers Share Feed | 4–6 | $90.75 |
| Family Bundle 1: 2 rice or bún bowls, 4 rolls, 12 wings, 4 drinks | 3–4 | $91.00 |

### b) Catering Boxes: next day, or pre-order
Pages: `/catering/` (landing), `/collections/catering` (shop), a page per
box, and `/catering-request-order-form/` (request now, pay later).

| Box | Name | Price | Contents / serves |
|---|---|---|---|
| 1 | Mini Fresh Rolls Box | $130 | |
| 2 | Standard Fresh Rolls Box | $130 | |
| 3 | Mini Bánh Mì Box | $150 | |
| 4 | Mini Bowls Box | $130 | 8–10 people |
| 5 | Mini Bánh Mì & Mini Fresh Rolls | $140 | |
| 6 | Mini Bowls & Mini Bánh Mì | $140 | 10 mini bowls + 15 mini bánh mì (listed as 6–8 people, *verify*) |
| 7 | Bao Box | $130 | |
| 8 | **Best Seller Box** | $160 | 8 mini bowls, 8 mini fresh rolls, 6 mini bánh mì, 4 bao. Serves 8–10 |

### Rules shown on the catering pages
- Order by **3pm** for next-day pickup or delivery. Pre-order up to **30
  days** ahead.
- An order stays **pending until the store accepts it**, confirmed by
  email or SMS.
- Delivery costs about **$4/km, $35 minimum**.
- **1.75%** card surcharge. **15%** public-holiday surcharge.
- Menu is 100% nut-free, with low-gluten, vegetarian and vegan options.
- Anything outside these options: email catering@rolld.com.au (also seen
  as catering@rolld.co) or call the store.
- Corporate customers can also order through the Hampr marketplace.

---

## 5. Rollers Club (loyalty)

- Page moved to `/rollers-club/`. The hub is still Nomnie
  (`loyalty.nomnie.com/rolld-au`, plus `/rolld-nz` for New Zealand).
- Headline copy: "every slurp brings you closer to rewards, perks, and
  exclusive experiences – just for being a part of our club!"
- **Earn:** 10% back as Roll'd Rewards / Roll'd Dollars. Pay in the app or
  scan the QR code on any receipt.
- **Redeem:** food and drink, exclusive merch, experiences.
- **Prepaid bonus:** "buy now and eat more later". Buy Roll'd Dollars
  upfront and get bonus dollars on top.
- **Getting it:** sign up on the web and "save the page to your phone home
  screen" (a web app), or download the app from the App Store or Google
  Play.
- Promo codes are issued through the app, and an FAQ covers using them in
  store.
- History: Roll'd previously partnered with Liven (15% back, capped at $25).
- **Still missing:** tiers, a worked example of the 10%, a preview of
  rewards for logged-out visitors, expiry rules. These are our openings.

---

## 6. Other parts of the site
- **Store locator:** by state (`/store-category/wa/`). Hours vary a lot by
  store (CBD stores close weekends, mall stores open late Thursdays), so
  per-store hours matter.
- **FAQs:** grouped by topic (`/faqs/our-food`, `/faqs/rolld-app/`), with
  **one URL per question** (`/faq/i-receive-a-promo-code-...`), which
  helps search.
- Franchise, Our Story, careers, retail ("Roll'd At Home", Coles range).

---

## 7. What to take for Tia's Bánh Mì

**Worth copying (the pattern, not the content):**
1. Menu as category → item pages. Vietnamese names with English labels.
   A one-line hook per category. Full ingredient list per item.
2. Dietary icons on every item, filter pages, a downloadable allergen
   guide. Only claim "nut-free" if it's actually true.
3. One reusable promo page template: hero, offer, where it applies, T&Cs,
   button.
4. Two speeds of group ordering: same-day share packs, plus next-day
   catering boxes with a clear cutoff and a request form.
5. A catering-to-loyalty bonus (spend X on catering, get Y credit).
6. Loyalty as simple % back, plus a prepaid top-up bonus.
7. Email sign-up page tied to a competition.
8. FAQs with one URL per question.

**Where we can do better than Roll'd:**
- One sign-in and one ordering flow on our own domain.
- Loyalty page for logged-out visitors: a worked example ("spend $50, get
  $5 back"), progress to the next reward, a rewards list, expiry rules.
- Store page with hours, address, phone and "open now".
- Same price on the web as in store. Delivery markup shown up front.
- Catering cost calculator: headcount → suggested boxes → delivery
  estimate.

---

## 8. To verify once rolld.com.au is reachable
- [ ] Current prices (index shows two price generations)
- [ ] Whether the header "Join Rollers Club" link is still `#`
- [ ] Whether store pages now show hours, address and phone
- [ ] Whether web ordering still goes to a separate domain
- [ ] Box 6 serving size, and which catering email is current

## Sources
- https://rolld.com.au/menu/ · https://rolld.com.au/menu/banh-mi/ ·
  https://rolld.com.au/menu/soldiers/lemongrass-beef-soldier/ ·
  https://rolld.com.au/menu/group-feeds/ ·
  https://rolldausprod.wpenginepowered.com/menu/
- https://rolld.com.au/promotions/ ·
  https://rolld.com.au/promotions/roll-into-a-meal ·
  https://rolld.com.au/rolld-subscription/
- https://rolld.com.au/catering/ · https://rolld.com.au/collections/catering ·
  https://rolld.com.au/products/catering-box-8-best-seller-box ·
  https://rolld.com.au/catering-request-order-form/ ·
  https://hampr.com.au/partner/rolld-australia
- https://rolld.com.au/rollers-club/ · https://loyalty.nomnie.com/rolld-au ·
  https://rolld.co/nz/rollers-club/
- https://rolld.com.au/wp-content/uploads/2026/03/Dietary-Allergen-Guide-March-2026-Standard.pdf ·
  https://rolld.com.au/faqs/our-food
- https://www.doordash.com/en/business/rolld-298901/menu ·
  https://www.westfield.com.au/marion/fresh-food ·
  https://www.theaureview.com/?p=180795 ·
  https://www.collinsplace.com.au/retail/rolld
