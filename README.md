# PulseTech Frontend

> Customer-facing storefront for the **PulseTech** e-commerce platform — built with **Next.js 16**, **React 19**, and **TypeScript**.

🌐 **Live:** https://pulse-tech-beryl.vercel.app

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Development](#local-development)
- [Environment Variables](#environment-variables)
- [Pages & Routes](#pages--routes)
- [Deploying to Vercel](#deploying-to-vercel)
- [Development Notes](#development-notes)

---

## Overview

PulseTech Frontend is a full-featured **Next.js App Router** application for a modern technology e-commerce store, including:

- 🛍️ Product browsing, search, and filtering
- 🛒 Shopping cart and online checkout
- 🔐 User registration and login with email verification
- ❤️ Wishlist management
- 📦 Order placement, history, and tracking
- 👤 User profile and address book management
- 💳 VNPay payment integration
- 📱 Fully responsive — mobile-first design

All API requests are proxied through the `/backend-api/*` path to the backend **API Gateway**, keeping backend service URLs completely hidden from the client.

---

## Tech Stack

| Component        | Technology                              |
|------------------|-----------------------------------------|
| Framework        | Next.js 16 (App Router)                 |
| UI Library       | React 19                                |
| Language         | TypeScript 5                            |
| Styling          | Tailwind CSS v4                         |
| Component Library| shadcn/ui + Radix UI                    |
| Animations       | Framer Motion                           |
| Icons            | Lucide React + React Icons              |
| Notifications    | Sonner (toast notifications)            |
| QR Code          | react-qr-code                           |
| Linting          | ESLint (eslint-config-next)             |
| Cloud Hosting    | Vercel                                  |

---

## Project Structure

```
frontend/
├── src/
│   ├── app/                  # App Router — all pages (route segments)
│   │   ├── page.tsx          # Home page
│   │   ├── layout.tsx        # Root layout
│   │   ├── loading.tsx       # Global loading UI
│   │   ├── login/            # Login page
│   │   ├── register/         # Registration page
│   │   ├── verify-email/     # Email verification callback
│   │   ├── products/         # Product listing & detail pages
│   │   ├── cart/             # Shopping cart
│   │   ├── checkout/         # Checkout flow
│   │   ├── orders/           # Order history
│   │   ├── order-tracking/   # Order tracking by ID + phone
│   │   ├── wishlist/         # Saved items
│   │   ├── profile/          # User profile & address book
│   │   ├── blog/             # Blog / news articles
│   │   ├── stores/           # Store locator
│   │   ├── trade-in/         # Device trade-in program
│   │   └── policies/         # Store policies
│   ├── components/           # Shared, reusable UI components
│   ├── context/              # React Context providers (Auth, Cart, etc.)
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # API client and utility functions
│   ├── types/                # Global TypeScript type definitions
│   └── config/               # Application-level configuration
├── public/                   # Static assets (images, icons, fonts)
├── next.config.ts            # Next.js config with API proxy rewrites
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env.example
```

---

## Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10 *(or yarn / pnpm / bun)*
- A running instance of the PulseTech backend (local or on Render)

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/VuIceTea/PulseTech.git
cd PulseTech
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Update `.env` with your backend URL:

```env
# URL of the backend API Gateway
API_URL=http://localhost:8080
```

> When running alongside the backend via Docker Compose (`d:\backend`), `API_URL` is automatically injected — no manual configuration needed.

### 4. Start the development server

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

### Available Scripts

| Command           | Description                            |
|-------------------|----------------------------------------|
| `npm run dev`     | Start the development server with HMR  |
| `npm run build`   | Build the optimized production bundle  |
| `npm run start`   | Serve the production build locally     |
| `npm run lint`    | Run ESLint across the codebase         |

---

## Environment Variables

| Variable  | Required | Default                  | Description                                        |
|-----------|----------|--------------------------|----------------------------------------------------|
| `API_URL` | ✅        | `http://localhost:8080`  | Base URL of the backend API Gateway                |

### How the API proxy works

`next.config.ts` defines a rewrite rule at build time:

```
/backend-api/<path>  →  ${API_URL}/api/<path>
```

This means all frontend API calls use `/backend-api/...` — the actual backend address is never exposed to the browser. This approach also allows seamlessly switching between local and cloud backends by simply changing `API_URL`.

---

## Pages & Routes

| Route               | Description                              | Auth Required |
|---------------------|------------------------------------------|:-------------:|
| `/`                 | Home page (featured products, banners)   | ❌            |
| `/products`         | Product listing with filters             | ❌            |
| `/products/[id]`    | Product detail page with reviews         | ❌            |
| `/login`            | User login                               | ❌            |
| `/register`         | New account registration                 | ❌            |
| `/verify-email`     | Email verification callback page         | ❌            |
| `/cart`             | Shopping cart                            | ❌            |
| `/checkout`         | Checkout and payment                     | ❌            |
| `/order-tracking`   | Track order by ID and phone number       | ❌            |
| `/orders`           | Order history                            | ✅            |
| `/wishlist`         | Saved / favorite products                | ✅            |
| `/profile`          | User profile and address book            | ✅            |
| `/blog`             | Blog articles and tech news              | ❌            |
| `/stores`           | Physical store locator                   | ❌            |
| `/trade-in`         | Device trade-in program                  | ❌            |
| `/policies`         | Return, warranty, and store policies     | ❌            |

---

## Deploying to Vercel

### Option 1: Vercel Dashboard *(recommended)*

1. Push your code to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → select the repository.
3. Vercel auto-detects Next.js — no build configuration needed.
4. Add the following **Environment Variable:**
   ```
   API_URL = https://<your-api-gateway>.onrender.com
   ```
5. Click **Deploy**.

### Option 2: Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

### After deployment

- Every push to the `main` branch triggers an automatic **rebuild and redeploy** on Vercel.
- Monitor deployments in the **Deployments** tab of the Vercel Dashboard.
- If you change an environment variable, click **Redeploy** (uncheck *"Use existing Build Cache"*) to apply the new value.

---

## Development Notes

- **Main branch:** `main` — automatically deployed to Vercel on every push.
- **Development branch:** `VuDev` — used for active development; merged into `main` upon completion.
- Never commit the `.env` file — it is already listed in `.gitignore`.
- All new features and bug fixes are automatically committed and pushed to GitHub upon completion.
