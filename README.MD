# Maan Travels — All in One Travel Booking Platform

Chauffeur-driven cars, airport transfers, self-drive rentals, luxury and wedding cars, tempo travellers, and curated tour packages across Punjab and North India — booking, fleet, route/pricing management, and an admin dashboard, all in one platform.

**Live site:** [maantravels.com](https://www.maantravels.com)

---

## Preview

<table>
  <tr>
    <td align="center"><b>Desktop</b></td>
    <td align="center"><b>Mobile</b></td>
  </tr>
  <tr>
    <td><img src="frontend\public\desktop-home.png" alt="Maan Travels — desktop homepage" width="480" /></td>
    <td><img src="frontend\public\mobile-home.jpeg" alt="Maan Travels — mobile homepage" width="220" /></td>
  </tr>
</table>

<table>
  <tr>
    <td align="center"><b>Fleet — Desktop</b></td>
    <td align="center"><b>Fleet — Mobile</b></td>
  </tr>
  <tr>
    <td><img src="frontend\public\dektop-fleet.png" alt="Maan Travels — desktop fleet page with filter" width="480" /></td>
    <td><img src="frontend\public\mobile-fleet.jpeg" alt="Maan Travels — mobile fleet page with filter" width="220" /></td>
  </tr>
</table>

> 📸 Drop your screenshots into `docs/screenshots/` using the filenames above (or update the paths to match your own naming) — see [Adding Screenshots](#adding-screenshots) below.

---

## Tech Stack

### Frontend
- **Next.js** (App Router) + **React**
- **TypeScript**
- **Tailwind CSS**
- **Zustand** — client state (e.g. booking modal store)
- **lucide-react** — icons
- **Supabase JS client** — frontend Supabase access

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**, hosted on **Supabase**
- **Multer** (or equivalent) — file uploads (payment screenshots, images)

### Infrastructure
- **Frontend deployment:** [Vercel](https://vercel.com)
- **Backend deployment:** [Render](https://render.com) (free tier)
- **Database:** Supabase Postgres, accessed via Prisma (pooled connection for the app, direct connection for migrations)
- **Uptime monitoring:** [UptimeRobot](https://uptimerobot.com) pings `https://maan-travels-backend.onrender.com/health` every 5 minutes to keep the free Render instance warm and catch downtime

---

## Project Structure

This is a **monorepo** with the frontend and backend as sibling directories.

```
.
├── frontend/                  # Next.js app
│   ├── app/                   # App Router pages & layouts
│   ├── components/            # UI components (booking, home, layout, common, admin, ui)
│   └── src/
│       ├── lib/                # Shared client-side utilities
│       ├── hooks/               # Custom React hooks
│       ├── services/            # API/service helpers (e.g. bookingService)
│       └── store/                # Zustand stores (e.g. bookingModalStore)
│
└── backend/                   # Express API
    ├── src/
    │   ├── routes/             # Express route modules (see API Routes below)
    │   ├── middleware/          # Express middleware (e.g. file upload)
    │   ├── prisma.ts             # Prisma client instance
    │   └── server.ts              # App entry point — mounts all routes, CORS config
    └── schema/
        └── schema.prisma        # Database schema
```

---

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm
- A PostgreSQL database (this project uses Supabase)

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-folder>
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (see [Environment Variables](#environment-variables) below).

Generate the Prisma client and apply the schema:

```bash
npx prisma generate
npx prisma migrate deploy   # or: npx prisma db push, depending on your workflow
```

Run the backend in development:

```bash
npm run dev
```

The API will be available at `http://localhost:5000` (or whatever `PORT` you set).

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/` (see [Environment Variables](#environment-variables) below).

Run the frontend in development:

```bash
npm run dev
```

The site will be available at `http://localhost:3000`.

> ⚠️ I don't have your `package.json` scripts in front of me, so the exact script names above (`dev`, etc.) are my best assumption based on standard Next.js/Express conventions — please confirm they match what's actually defined in your `package.json` files, and adjust if not.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | Pooled (transaction-mode, PgBouncer) Postgres connection string — used by the running app |
| `DIRECT_URL` | Direct (session-mode) Postgres connection string — used by Prisma for migrations |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only — full access, keep secret) |
| `DEVICE_TOKEN_SECRET` | Secret used for signing/verifying admin device tokens |
| `FRONTEND_URL` | Frontend origin, added to the CORS allowlist |
| `PORT` | Port the Express server listens on (defaults to `5000`) |

### Frontend (`frontend/.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | Base URL of the backend API |
| `NEXT_PUBLIC_API_URL` | Base URL used by frontend service calls to the API |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key (public) |

> 🔒 Never commit real `.env` files. Keep `SUPABASE_SERVICE_ROLE_KEY` and `DEVICE_TOKEN_SECRET` server-side only — they must never be exposed with a `NEXT_PUBLIC_` prefix or in frontend code.

> ⚠️ I noticed `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_BACKEND_URL` both appear to point at the backend — if that's intentional (e.g. one is used by `bookingService.ts` and the other elsewhere), no action needed; if it's redundant, you may want to consolidate to one.

---

## API Routes

All routes are mounted in `backend/src/server.ts`, prefixed under `/api`, plus two unprefixed utility routes.

| Base Path | Route Module | Purpose |
|---|---|---|
| `/api/taxi-bookings` | `taxi.routes.ts` | Taxi/outstation booking submissions |
| `/api/airport-bookings` | `airport-bookings.routes.ts` | Airport transfer booking submissions |
| `/api/selfdrive-bookings` | `selfdrive.routes.ts` | Self-drive rental booking submissions |
| `/api/tour-bookings` | `tour.routes.ts` | Tour package booking submissions |
| `/api/vehicles` | `vehicle.routes.ts` | Fleet vehicle listing/management |
| `/api/wedding` | `wedding.routes.ts` | Wedding car booking submissions |
| `/api/bookings` | `booking.routes.ts` | General booking lookups (e.g. receipts) |
| `/api/locations` | `location.routes.ts` | Pickup/drop location options |
| `/api/luxury` | `luxury.routes.ts` | Luxury car booking submissions |
| `/api/tempo-bookings` | `tempo.routes.ts` | Tempo Traveller / Urbania booking submissions |
| `/api/feedback` | `feedback.routes.ts` | Customer feedback/testimonials |
| `/api/upload` | `upload.routes.ts` | File upload handling |
| `/api/luxury-cars` | `luxuryCars.routes.ts` | Luxury car catalog (cards shown on `/luxury-cars`) |
| `/api/admin-devices` | `adminDevice.routes.ts` | Admin device registration/approval (trusted-device auth for `/admin`) |
| `/api/routes` | `routes.routes.ts` | Route cards (Popular Tour Routes, Destinations, etc.) |
| `/api/stats` | `stats.routes.ts` | Admin dashboard statistics |
| `/api/inquiries` | `inquiry.routes.ts` | Contact/inquiry form submissions |
| `/api/gallery` | `gallery.routes.ts` | Gallery images |
| `/api/airports` | `airports.routes.ts` | Airport catalog |
| `/api/pricing` | `pricing.routes.ts` | Route/airport pricing management |
| `/api/payment` | `payment.routes.ts` | Payment settings (QR code, UPI ID) |
| `/` | — (inline in `server.ts`) | Root health text — confirms the API is running |
| `/health` | — (inline in `server.ts`) | JSON health check — polled by UptimeRobot every 5 minutes |
| `/api/test` | — (inline in `server.ts`) | Database connectivity check (counts bookings) |

> Methods (GET/POST/etc.) and sub-paths within each module aren't detailed here — this table reflects only the base mount paths from `server.ts`. Let me know if you'd like the full method+path breakdown for any specific route module and I'll go through that file directly.

### CORS

The backend explicitly whitelists origins rather than using a wildcard, since `credentials: true` (required for the admin device cookie) is rejected by browsers when combined with `origin: "*"`. Allowed origins:
- `https://www.maantravels.com`
- `http://localhost:3000`
- `process.env.FRONTEND_URL`
- any `*.vercel.app` subdomain (preview deployments)

---

## Database Schema

Defined in `backend/schema/schema.prisma`, using PostgreSQL via Prisma.

### Core models

- **`Customer`** — name, email, phone; has many `Booking`s
- **`Booking`** — the central record for every booking, regardless of service type. Holds `serviceType`, `status`, pricing (`totalAmount`, `paymentType`, `amountPaid`, `paymentStatus`), and an optional link to a `Vehicle` and/or `Route`. Each `Booking` has *one* of the following service-specific child records:
  - **`TaxiBooking`**
  - **`AirportTransfer`**
  - **`TourBooking`**
  - **`SelfDriveBooking`**
  - **`LuxuryBooking`**
  - **`WeddingBooking`**
  - **`TempoBooking`**

- **`Vehicle`** — fleet vehicles. Shared across taxi, self-drive, and tempo bookings via flags:
  - `isTaxiFleet` (default `true`) and `isSelfDrive` (default `false`) — independent booleans; a vehicle **can be both** (e.g. an Innova Crysta available for taxi trips *and* self-drive rental)
  - `category` (free text, e.g. `"luxury"`, `"suv"`, `"sedan"`) — luxury vehicles are identified by `category` containing `"luxury"`, not a separate boolean
  - Self-drive-specific fields: `fuelType`, `transmission`, `seats`, `modelYear`, `rentalPerDay`
  - General pricing: `price` (used for taxi/tour context); `rentalPerDay` (used for self-drive context)

- **`LuxuryCar`** — catalog entries for luxury vehicles (slug, images, features), each linked 1:1 to a `Vehicle`

- **`Route`** — predefined route cards (e.g. "Popular Tour Routes", "Popular Destinations"), categorized by `category` (`destination` | `one_way` | `local` | `airport` | `tour`) and `baseType` (`taxi` | `airport` | `tour`)
- **`RoutePricing`** — per-vehicle price for a given `Route` (unique on `routeId` + `vehicleId`)

- **`Airport`** / **`AirportPricing`** — airport catalog and per-vehicle airport transfer pricing, mirroring the `Route`/`RoutePricing` pattern

- **`TourLocation`** — pickup/drop location options (`canPickup`, `canDrop` flags)

- **`PaymentSettings`** — stores the QR code image and UPI ID shown during checkout
- **`Feedback`** — customer testimonials, with a `showOnWebsite` flag for moderation
- **`GalleryImage`** — gallery photos, categorized and orderable
- **`Inquiry`** — contact form submissions (`status`: `new` | `contacted` | `closed`)

- **`AdminDevice`** / **`AdminDeviceInvite`** — trusted-device authentication for `/admin`. A device is `pending` until approved via an invite code created by an already-approved device, after which its `status` becomes `approved` (or `revoked` if access is later pulled). The `active` boolean is kept in sync with `status === "approved"` for backward compatibility — it should not be written to independently of `status`.

### Key relationships to know

- A `Vehicle` with both `isTaxiFleet: true` and `isSelfDrive: true` is **not an edge case to special-case away** — it's valid data, and the frontend resolves which price/label to show based on which filter context (taxi vs. self-drive) the vehicle is currently being viewed under.
- `RoutePricing`/`AirportPricing` are the *only* source of truth for route-specific or airport-specific pricing. There's no fallback to `Vehicle.price` for these — if no pricing row exists, the booking is created with `totalAmount: 0` and the team follows up manually to confirm pricing.

---

## Deployment

| Layer | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Auto-deploys from the connected branch; preview deployments get a `*.vercel.app` URL, which is allow-listed in backend CORS |
| Backend | Render (free tier) | Free tier spins down on inactivity — see Uptime Monitoring below |
| Database | Supabase (Postgres) | Accessed via Prisma; pooled connection (`DATABASE_URL`) for the app, direct connection (`DIRECT_URL`) for migrations |

### Uptime Monitoring

Render's free tier spins the backend down after a period of inactivity, causing a slow "cold start" on the next request. **UptimeRobot** pings [`https://maan-travels-backend.onrender.com/health`](https://maan-travels-backend.onrender.com/health) every 5 minutes to keep the instance warm and to provide independent alerting if the backend ever goes down.

---

## Adding Screenshots

The [Preview](#preview) section above expects images at these paths — create the folder and drop your screenshots in with these exact filenames (or edit the paths in the README to match your own):

```
docs/
└── screenshots/
    ├── desktop-home.png
    ├── mobile-home.png
    ├── desktop-fleet.png
    └── mobile-fleet.png
```

Tips for clean results:
- **Desktop:** capture at a standard width (e.g. 1440px or 1920px) so the layout looks intentional, not cropped mid-breakpoint.
- **Mobile:** use a real device screenshot or a browser devtools mobile emulation (e.g. iPhone 14 Pro / Pixel viewport) rather than a shrunk desktop screenshot — this site has dedicated mobile layouts (e.g. the horizontally-scrolling fleet filter) that only render correctly at mobile widths.
- Keep file sizes reasonable (compress with something like [squoosh.app](https://squoosh.app)) so the README loads quickly on GitHub.
- Add more pairs the same way (e.g. `desktop-booking.png` / `mobile-booking.png`) and extend the tables above if you want to showcase additional pages.

---
