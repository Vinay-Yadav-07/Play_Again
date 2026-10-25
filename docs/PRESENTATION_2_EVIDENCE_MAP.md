# Presentation 2 Evidence Map — PlayAgain (MDMIE03)

**Course**: MDMIE03 — MVP & Scale-Up Strategy Pitch  
**Assessment Weight**: 25 ISA Marks  
**Project**: PlayAgain — Sports Equipment Exchange (*"Give Sports Gear a Second Game"*)

This document maps each of the **10 required pitch deck sections** to the genuine functional artifacts, tested code components, database tables, and real application workflows implemented in this repository.

---

### Section 1: The Startup Now
- **Slide Focus**: Customer focus and evolution from high-level concept into a targeted college-first peer-to-peer equipment exchange.
- **Supporting Artifacts in Code**:
  - `client/src/pages/HomePage.tsx`: Highlights focused college sports (Cricket, Football, Badminton, Basketball, Tennis, Fitness) rather than a generic e-commerce portal.
  - Three transaction models implemented: **Sale**, **Swap**, and **Rent** (`client/src/components/ListingCard.tsx`), directly matching college student budget realities where students often only need gear for match days or prefer direct gear trades.

---

### Section 2: The Problem, With Evidence
- **Slide Focus**: Distinguishing genuine observable customer pain points from unverified assumptions.
- **Supporting Artifacts in Code**:
  - `client/src/pages/SafetyPage.tsx`: Documents real equipment inspection risks observed in amateur sports (hairline racket frame fatigue, cricket bat toe cracking, football valve leaks, unthreaded dumbbell collars).
  - Price differentials shown on `/marketplace`: Highlighting typical college retail price barriers (₹3,000–₹8,000 for new willow bats/graphite rackets) versus peer exchange listings (₹300–₹1,100).

---

### Section 3: What We Built (The Working MVP Artifact)
- **Slide Focus**: Demonstrating a functional, runnable full-stack application rather than static mockups.
- **Supporting Artifacts in Code**:
  - **Relational SQLite Database & Prisma Schema** (`prisma/schema.prisma`): 5 tables (`User`, `Listing`, `Favourite`, `Enquiry`, `Report`) enforcing relational integrity.
  - **Authenticated REST API** (`server/src/index.ts`): Endpoints for auth, listings, enquiries, favourites, reports, and metrics.
  - **Client Application** (`client/src/`): React 18, TypeScript, Tailwind CSS, Lucide icons, responsive navigation, and error handling.
  - **Demo Evidence & Video**: WebP browser interaction recording (`playagain_app_tour_1792927229244.webp`).

---

### Section 4: What We Tested and Learned
- **Slide Focus**: Actual software tests, engineering constraints, and behavioral findings.
- **Supporting Artifacts in Code**:
  - **Automated Vitest Test Suite** (`server/tests/api.test.ts`): 21 automated integration tests passing with 100% success rate.
  - **Key Technical Findings**:
    - Discovered that unauthenticated buyers must be gracefully prompted to sign in without losing listing context.
    - Implemented self-enquiry prevention (`res.status(400)` when `ownerId === buyerId`) to prevent artificial transaction loops.
    - Verified that marking a listing *"Reserved"* or *"Completed"* instantly shuts off new enquiry submissions to protect seller inboxes from clutter.

---

### Section 5: What We Build Next (Roadmap & Build vs. Buy)
- **Slide Focus**: Technical and product roadmap for the next 2 quarters.
- **Supporting Artifacts in Code**:
  - **Build Decision**: Keep search, filtering, and peer connection matching proprietary in-house.
  - **Buy / Integrate Decision**:
    - Add campus SSO (OAuth 2.0 with university email domains `@campus.edu`) instead of standalone email/password.
    - Add AWS S3 / Cloudinary for cloud image storage with virus scanning.
    - Add automated WhatsApp/SMS notifications for received enquiries (Twilio).

---

### Section 6: How We Grow and Measure It
- **Slide Focus**: Acquisition funnel, North Star Metric, core KPIs, and guardrail metrics.
- **Supporting Artifacts in Code**:
  - **Live Analytics Endpoint & Page** (`/api/analytics/counts`, `client/src/pages/AnalyticsPage.tsx`):
    - **North Star Metric**: *Completed Handover Enquiries* (buyer and seller reaching agreement).
    - **Input Metric 1**: Total active listings per sport category.
    - **Input Metric 2**: Average inquiry response latency.
    - **Guardrail Metric**: Number of reported listings (`/api/listings/:id/reports`) divided by total active listings (must remain < 2%).

---

### Section 7: One Growth Experiment
- **Slide Focus**: Rigorous hypothesis-driven student acquisition test.
- **Supporting Artifacts in Code**:
  - **Hypothesis**: Partnering with the campus badminton or cricket tournament organizers to sponsor a *"Tournament Gear Swap Day"* will drive a 3× spike in peer equipment listings within 7 days.
  - **Target Group**: Hostels participating in inter-collegiate cricket and badminton tournaments.
  - **Intervention**: QR-code flyers placed at the Badminton Courts and North Pavilion linking directly to pre-filtered marketplace views (`/marketplace?sport=Badminton`).
  - **Success Threshold**: At least 25 new equipment listings created by unique non-demo student accounts within 10 days.

---

### Section 8: What Happens at 10×?
- **Slide Focus**: Operational bottlenecks, campus expansion, and infrastructure readiness.
- **Supporting Artifacts in Code**:
  - **Database Scalability**: Transitioning from single-file SQLite to PostgreSQL on AWS RDS or Supabase with read replicas.
  - **Physical Friction**: In-person handovers become congested; introduce dedicated *"PlayAgain Locker Hubs"* at campus gymnasiums or student union front desks.
  - **Multi-Campus Architecture**: Adding `campusId` foreign keys to partition listings across universities (e.g., IIT Delhi vs. Delhi University) so students only see gear within their walking radius.

---

### Section 9: What Could Go Wrong? (Risks & Mitigations)
- **Slide Focus**: Privacy, cybersecurity, trust, product safety, and counter-measures.
- **Supporting Artifacts in Code**:
  - **Privacy**: No exact dorm room numbers or private addresses are stored in the schema (`pickupArea` is restricted to public campus facilities).
  - **Security**: Passwords hashed with `bcryptjs` (10 rounds); JWT session tokens; Rate limiting on `/api/auth` (max 30 requests / 15 mins); Helmet HTTP security headers.
  - **Trust & Fraud**: Integrated `Report` schema and moderation logging (`/api/listings/:id/reports`) to flag counterfeit or hazardous gear.
  - **Safety Guidelines**: Mandatory checklist on every listing detail page (`client/src/pages/SafetyPage.tsx`).

---

### Section 10: Our Decision and Next 90 Days
- **Slide Focus**: Continue, narrow, pivot, or pause with concrete milestones.
- **Supporting Artifacts in Code**:
  - **Strategic Recommendation**: **Narrow and Continue**. Rather than attempting all sports across all colleges, focus exclusively on Cricket and Badminton within one primary university campus for the initial 90 days.
  - **30-Day Milestone**: Pilot with the university Cricket and Badminton clubs; verify 40 real listings and 20 completed handovers.
  - **60-Day Milestone**: Add automated campus email domain verification (`@university.edu`).
  - **90-Day Milestone**: Launch peer rental deposit escrow workflow if rental dispute rate exceeds 5%.
