# PlayAgain — Genuine Evidence Guide

This guide details how to verify and capture genuine, verifiable visual evidence and data artifacts from the running **PlayAgain — Sports Equipment Exchange** application.

All evidence below is produced directly from the active SQLite database and running Vite/Express server. No mock screenshots or fake transaction testimonials are used.

---

## 1. Landing Page (`/`)
- **URL**: `http://localhost:3000/`
- **Key Evidence Elements**:
  - Brand heading: *"Good Gear Deserves Another Game"*
  - Tagline: *"Give Sports Gear a Second Game"*
  - Category navigation cards (Cricket, Football, Badminton, Basketball, Tennis, Fitness)
  - Live featured gear cards with real prices and conditions from the SQLite database
  - Circular economy / sustainability statement explaining college sports reuse
- **Screenshot Artifact**: [`screenshots/01_landing_page.png`](file:///c:/Users/vinay/Downloads/MDM_P2/screenshots/01_landing_page.png)

---

## 2. Marketplace & Sport Filters (`/marketplace`)
- **URL**: `http://localhost:3000/marketplace`
- **Key Evidence Elements**:
  - Live query controls: Search bar, Sport category pills, Transaction type segmented toggle (Sale, Swap, Rent), Condition selector, Price range inputs, and Sort dropdown
  - Instant client-side URL synchronization (`?sport=Cricket`, `?type=sale`)
  - Live result count badge (e.g., *"Showing 8 items"*)
  - Empty state with *"Reset All Filters"* button when queries have no matches
- **Screenshot Artifact**: [`screenshots/03_marketplace_browse.png`](file:///c:/Users/vinay/Downloads/MDM_P2/screenshots/03_marketplace_browse.png)

---

## 3. Equipment Listing Detail (`/listings/:id`)
- **URL**: `http://localhost:3000/listings/caadcac1-96d4-4564-8f2d-f8786038893e` (or any active listing ID)
- **Key Evidence Elements**:
  - High-resolution equipment photography with thumbnail carousel
  - Detailed product condition tag (*"Good"*, *"Like New"*, *"Fair"*)
  - Pricing model: Sale price (₹), Rental rate & duration (₹ / match day), or Desired swap description
  - Seller profile card with *"Campus Demo Account"* badge
  - Public campus pickup location (e.g., *"Campus North Sports Pavilion"*)
  - In-person inspection and safety checklist
  - Similar equipment recommendations in the same sport
- **Screenshot Artifact**: [`screenshots/07_listing_detail_page.png`](file:///c:/Users/vinay/Downloads/MDM_P2/screenshots/07_listing_detail_page.png)

---

## 4. Create Listing Form (`/create-listing`)
- **URL**: `http://localhost:3000/create-listing`
- **Key Evidence Elements**:
  - Protected route requiring authentication
  - Dynamic fields responding to listing type (Sale, Swap, or Rent)
  - Sports photo presets + local file upload with 5MB validation
  - Server-side Zod schema validation preventing negative prices or empty descriptions
  - Mandatory campus safety and ownership acknowledgement checkbox

---

## 5. Authenticated Dashboard (`/dashboard`)
- **URL**: `http://localhost:3000/dashboard`
- **Key Evidence Elements**:
  - Student profile card with verified campus athlete badge
  - Four dedicated management tabs:
    1. **My Equipment Listings**: Real-time status toggles (*Available*, *Reserved*, *Completed*) and edit/delete actions
    2. **Saved Favourites**: Persisted across user sessions
    3. **Received Enquiries**: Buyer messages, proposed counter-offers, requested rental dates, and seller response workflow
    4. **Sent Enquiries**: Status tracking (*New*, *Responded*, *Closed*)
- **Screenshot Artifact**: [`screenshots/09_authenticated_dashboard.png`](file:///c:/Users/vinay/Downloads/MDM_P2/screenshots/09_authenticated_dashboard.png)

---

## 6. Real Database Record Verification
To inspect active SQLite rows directly without opening the browser:
```bash
# Run Prisma Studio to visually inspect real rows in dev.db
npx prisma studio
```
Or execute a quick CLI query:
```bash
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.listing.findMany({ select: { id: true, title: true, sport: true, price: true } }).then(console.log);"
```

---

## 7. Stored Enquiry Verification
Verify that enquiries sent from buyers to sellers persist in `prisma/dev.db`:
```bash
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.enquiry.findMany({ include: { buyer: true, seller: true, listing: true } }).then(console.log);"
```

---

## 8. Automated Test Results
Execute the Vitest automated test suite verifying all 12 critical platform workflows:
```bash
npm test
```
**Actual Result**:
- Test Files: 1 passed
- Tests: 21 passed (100% pass rate)
- Verifies registration, login, ownership protection, enquiry validation, self-enquiry rejection, unavailable listing protection, and negative price rejection.

---

## 9. End-to-End Recording & Full Screenshot Catalog
- Full interactive browser walkthrough recording: [`screenshots/playagain_app_tour.webp`](file:///c:/Users/vinay/Downloads/MDM_P2/screenshots/playagain_app_tour.webp)
- Complete screenshot catalog: [`screenshots/README.md`](file:///c:/Users/vinay/Downloads/MDM_P2/screenshots/README.md)
