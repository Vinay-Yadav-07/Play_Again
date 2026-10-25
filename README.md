# PlayAgain — Sports Equipment Exchange
> **Tagline**: Give Sports Gear a Second Game.  
> **Type**: College-first peer-to-peer sports equipment marketplace.  
> **Course Assessment**: MDMIE03 Course Project (Presentation 2: MVP & Scale-Up Strategy Pitch).

PlayAgain is a runnable, full-stack web application that allows college students, university athletes, and amateur players to buy, sell, exchange, and rent pre-owned sports gear at student-friendly prices.

---

## 🌟 Core Value Proposition
- **Student Affordability**: Save 40% to 70% compared to brand-new retail sporting equipment.
- **Three Flexible Models**: Buy at fixed prices, propose direct gear-for-gear swaps, or rent pads/weights for single matches or weekends.
- **Campus Handover Safety**: Avoid sketchy meetups by coordinating inspection at designated campus sports pavilions, SAC desks, or athletic grounds.
- **Circular Reuse**: Prevent quality bats, rackets, and kits from gathering dust or ending up in landfills.

---

## 🛠️ Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React icons.
- **Backend**: Node.js, Express, TypeScript.
- **Database**: SQLite with Prisma ORM.
- **Validation**: Zod schema validation (server-side & client-side).
- **Security**: JWT authentication, `bcryptjs` password hashing (10 salt rounds), Helmet security headers, Express Rate Limiting.
- **Testing**: Vitest with Supertest.
- **File Uploads**: Multer with 5MB file-size limit and strict MIME validation.

---

## 📂 Repository Structure
```
MDM_P2/
├── client/                     # Vite + React Frontend
│   ├── index.html              # HTML entry point with Plus Jakarta Sans & SEO metadata
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ListingCard, FilterPanel, Modals, Badges
│   │   ├── context/            # AuthContext, ToastContext
│   │   ├── pages/              # Home, Marketplace, Detail, Create, Edit, Dashboard, Login, Register, Safety, Analytics
│   │   ├── services/api.ts     # Typed API client with JWT interceptor
│   │   └── types/              # Domain models & TypeScript interfaces
├── server/                     # Express Backend
│   ├── src/
│   │   ├── index.ts            # Server entry point with security middleware & routing
│   │   ├── routes/             # Auth, Listings, Favourites, Enquiries, Reports, Analytics, Users
│   │   ├── middleware/         # Auth guard, Zod validator, centralized error handling
│   │   └── lib/                # Prisma singleton, JWT utility, validation schemas
│   ├── tests/
│   │   └── api.test.ts         # 21 automated integration tests (Supertest + Vitest)
│   └── uploads/                # Safe local storage for uploaded equipment photos
├── prisma/
│   ├── schema.prisma           # SQLite relational database schema
│   ├── seed.ts                 # Deterministic seed script with demo users & realistic gear
│   └── dev.db                  # Local SQLite database file
├── docs/
│   ├── EVIDENCE_GUIDE.md       # How to capture genuine screenshots & verify DB records
│   └── PRESENTATION_2_EVIDENCE_MAP.md # Mapping to all 10 pitch deck sections
├── screenshots/                # Genuine UI screenshots and browser video tour
│   ├── README.md               # Visual artifact catalog & pitch deck evidence
│   ├── 01_landing_page.png
│   ├── 03_marketplace_browse.png
│   ├── 07_listing_detail_page.png
│   ├── 09_authenticated_dashboard.png
│   ├── 12_live_analytics_and_database_metrics.png
│   └── playagain_app_tour.webp
├── PROJECT_STATUS.md           # Implementation report & test results
├── package.json                # Project dependencies and npm scripts
├── vite.config.ts              # Vite config with proxy to Express backend
├── tailwind.config.js          # Brand palette (emerald accents, deep navy typography)
├── tsconfig.json               # Client TypeScript configuration
├── tsconfig.server.json        # Server TypeScript configuration
└── .env.example                # Safe environment variable template
```

---

## 🚀 Quickstart & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher (v22+ tested)
- **npm**: v9.0.0 or higher

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd MDM_P2
npm install
```

### 2. Environment Setup
Copy the template configuration file:
```bash
cp .env.example .env
```
Default development settings are pre-configured:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
JWT_SECRET=playagain_dev_secret_key_2026_super_secure_random_token_99812
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### 3. Generate Database & Seed Sample Gear
```bash
# Push Prisma schema to SQLite
npx prisma db push

# Run deterministic seed data
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```
This runs the Express API server (`http://localhost:5000`) and the Vite client application (`http://localhost:3000`) concurrently.

---

## 🔑 Demo Accounts (For Instant Evaluation)
All demo accounts use the standard password: `Demo123!`

| Role | Email | Password | What You Can Test |
|------|-------|----------|-------------------|
| **Demo Seller** | `demo.seller@playagain.campus` | `Demo123!` | Manages Cricket bat, SG pads, and gym dumbbells. Views received buyer enquiries and responds. |
| **Demo Buyer** | `demo.buyer@playagain.campus` | `Demo123!` | Sends enquiries on gear, makes offers, views saved favourites. |
| **Sports Club** | `badminton.club@playagain.campus` | `Demo123!` | Campus association listing rackets and kit swaps. |

*Tip: The login page includes 1-click quick-fill buttons for each demo profile.*

---

## 🧪 Automated Testing

Execute the comprehensive 21-scenario automated test suite:
```bash
npm test
```
The test suite validates:
1. Registration schema validation and password matching.
2. Login credential verification and invalid login rejection.
3. Public listing browsing and sport category filtering.
4. Search queries across titles and descriptions.
5. Authenticated equipment creation.
6. Rejection of unauthenticated listing creation.
7. Prevention of cross-user edits (User B cannot edit User A's listing).
8. Favourites persistence (add, list, delete).
9. Buyer-to-seller enquiry submission.
10. Self-enquiry prevention (owners cannot enquire on own items).
11. Unavailable listing protection (reserved/completed items reject new enquiries).
12. Rejection of negative prices and malformed data.

---

## 📦 Production Build

Compile client assets and server code:
```bash
npm run build
```
- Client is built into `dist/` with minified CSS and JavaScript chunks.
- Server is compiled into `dist-server/` with TypeScript CommonJS output.

To run the production build:
```bash
npm start
```

---

## 🛡️ Security & Privacy Notice
- **No Private Home Addresses**: Handover locations (`pickupArea`) are restricted to public university spots.
- **Password Protection**: Stored exclusively as one-way salted hashes (`bcryptjs` 10 rounds).
- **Authentication**: Stateless, tamper-proof JSON Web Tokens (JWT).
- **Rate Limiting**: Brute-force protection applied to `/api/auth` (max 30 requests per 15 minutes).
- **Secure File Uploads**: Image uploads are validated server-side for permitted MIME types (`image/jpeg`, `image/png`, `image/webp`) with a 5MB size limit and randomized file hashes to prevent path traversal.

---

## 📄 Academic Pitch Deck Evidence
For presentation preparation and evaluation:
- Review [EVIDENCE_GUIDE.md](file:///c:/Users/vinay/Downloads/MDM_P2/docs/EVIDENCE_GUIDE.md) for capturing genuine screenshots.
- Review [PRESENTATION_2_EVIDENCE_MAP.md](file:///c:/Users/vinay/Downloads/MDM_P2/docs/PRESENTATION_2_EVIDENCE_MAP.md) for pitch deck section mappings.
- Review [PROJECT_STATUS.md](file:///c:/Users/vinay/Downloads/MDM_P2/PROJECT_STATUS.md) for technical status and test verification.
