# CompuStore — Developer & AI Instructions (GEMINI.md)

This document serves as the primary technical specification, architecture reference, and coding standard for the **CompuStore** repository. All code generated or modified in this project must adhere strictly to these guidelines.

---

## 1. Project Overview & Tech Stack

**CompuStore** is a full-stack e-commerce web application specializing in computer hardware (CPUs, GPUs, Motherboards, RAM, Storage, PSUs, Cases, Coolers).

### Tech Stack Breakdown

- **Frontend (`ecommerce-project-react/`)**:
  - **Framework & Tooling**: React 19, Vite, PostCSS, Autoprefixer
  - **Styling & UI**: Tailwind CSS 3.4 (with CSS custom properties for theming), Radix UI primitives (`@radix-ui/react-select`, `slider`, `slot`), Lucide React icons, Embla Carousel (`embla-carousel-react`, `embla-carousel-autoplay`)
  - **Routing**: React Router (`react-router-dom` v7 running v6 declarative nested routing APIs)
  - **State Management**: React Context API (`AuthContext`, `CartContext`) with hybrid client/server synchronization
- **Backend (`server/`)**:
  - **Runtime & Framework**: Node.js with Express 5
  - **Language & Execution**: TypeScript 5.7 executed via `tsx watch` (development) and compiled via `tsc` (production)
  - **Database & Storage**: PostgreSQL via `pg` (Pool), parameterized queries, window functions
  - **Authentication & Security**: JWT (`jsonwebtoken`) in `httpOnly`, `sameSite` secure cookies, `bcrypt` password hashing
  - **Email Service**: Resend API (`resend`) for transactional account activation emails
- **Root Repository**:
  - `Script-1.sql`: PostgreSQL schema definitions, table migrations, and hardware seed data
  - `cpu.json`: Catalog benchmark and hardware specifications reference dataset

---

## 2. Directory Structure & Architecture

```
e-commerce-Hardware/
├── ecommerce-project-react/      # Frontend application
│   ├── src/
│   │   ├── app/                  # Application root & routing layouts
│   │   │   └── App.jsx           # Route declarations, MainLayout & AuthLayout
│   │   ├── components/
│   │   │   ├── cart/             # Cart & Order UI components (OrderCard, etc.)
│   │   │   ├── layout/           # Global shell components (Header, Sidebar, etc.)
│   │   │   ├── product/          # Catalog UI (CardItem, FilterSidebar, Carousel, Banner)
│   │   │   └── ui/               # Reusable primitives (button, slider, select, carousel)
│   │   ├── contexts/             # Global contexts (AuthContext, CartContext)
│   │   ├── data/                 # Static data & category mappings (idParaCategoria.js)
│   │   ├── hooks/                # Custom React hooks (useScrollRestore.js)
│   │   ├── lib/                  # Utilities (clsx/tailwind-merge helper utils.js)
│   │   ├── pages/                # Route page components (Home, CategoryPage, Detail, Cart, Profile, etc.)
│   │   ├── index.css             # Tailwind base layers, HSL color tokens & theme variables
│   │   └── main.jsx              # React DOM entry point
│   ├── tailwind.config.js        # Extended color tokens, dark mode class configuration
│   └── vite.config.js            # Vite configuration with '@' path alias to './src'
│
├── server/                       # Backend REST API
│   ├── server.ts                 # HTTP listener entry point
│   └── src/
│       ├── app.ts                # Express app configuration, CORS, route orchestration
│       ├── config/               # Database pool (db.ts) and Resend client (resend.ts)
│       ├── middleware/           # Middleware (auth.middleware.ts for JWT cookie parsing)
│       ├── model/                # TypeScript interface definitions by domain
│       │   ├── auth/index.ts     # Auth & user payload interfaces
│       │   ├── cart/index.ts     # Cart item & product interfaces
│       │   ├── orders/index.ts   # Order & order items interfaces
│       │   └── products/index.ts # Product, spec & filter interfaces
│       └── modules/              # 3-tier modular domains (Routes -> Controller -> Service)
│           ├── auth/             # Registration, verify, login, session, logout
│           ├── cart/             # Add, get, merge guest items, delete item, clear
│           ├── orders/           # Transactional order creation and history
│           └── products/         # Catalog pagination, filtering, search, specs
│
├── Script-1.sql                  # PostgreSQL database initialization & seed queries
└── GEMINI.md                     # Architecture guide & coding conventions (this file)
```

---

## 3. Coding Conventions & Standards

When generating, modifying, or refactoring code for this repository, you must observe the following rules:

### Frontend Conventions (React & Tailwind)

1. **Functional Components Only**:
   - Write all components as functional components using React hooks (`useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`).
   - Do not use class components.
2. **Strict Props & Context Usage**:
   - Components rendered inside nested router outlets (`MainLayout`) must access layout data via `useOutletContext()` instead of expecting props from `<Outlet />`.
   - Always validate and provide default fallbacks for array/object props (e.g., `banners = []`, `produtos = []`).
3. **Tailwind CSS & Theming Rules**:
   - **Class-based Dark Mode**: Always support dark mode by declaring `dark:` utility variants matching the project's HSL tokens defined in `index.css`:
     - Backgrounds: `bg-white dark:bg-darkBackground` or `bg-white dark:bg-darkSurface`
     - Text: `text-foreground dark:text-darkForeground` or `dark:text-gray-200`
     - Borders: `border-gray-200 dark:border-gray-700`
     - Primary brand accents: `text-blue-500`, `bg-blue-500 hover:bg-blue-600`
   - Use the `cn(...)` utility (`@/lib/utils`) when combining conditional classes.
   - Do not use arbitrary hardcoded hex codes if a configured theme token or Tailwind standard shade exists.
4. **Client-Side Navigation**:
   - Always use `useNavigate()` or `<Link to="...">` from `react-router-dom` for in-app transitions.
   - **Never** use `window.location.href` or `window.location.reload()` for routine SPA actions (e.g., login redirect, order confirmation, logout).
5. **Robust API Fetching & Error Handling**:
   - When checking API responses, declare your data variable properly to prevent block-scoping issues:
     ```javascript
     const response = await fetch(`${apiUrl}/endpoint`, { ... });
     const data = await response.json().catch(() => ({}));
     if (!response.ok) {
       throw new Error(data.message || data.error || 'Erro na requisição');
     }
     // Process data
     ```
   - Always wrap asynchronous requests in `try/catch/finally` blocks and manage loading states (`loading`, `setLoading`).
6. **Form Inputs**:
   - Ensure all input elements have valid HTML attributes (e.g., `required`, never typos like `requiredf`).
   - Provide explicit, user-friendly Portuguese labels and placeholders adhering to the store language.

### Backend Conventions (Node.js, Express & TypeScript)

1. **Modular 3-Tier Architecture**:
   - Maintain strict separation of concerns across files:
     - `*.routes.ts`: Defines endpoint paths, HTTP verbs, and attaches middleware.
     - `*.controller.ts`: Validates input request parameters/body, handles HTTP responses, and calls the service layer.
     - `*.service.ts`: Contains business logic, database queries, and data transformations.
     - `model/*/index.ts`: Houses TypeScript interfaces and contract types.
2. **TypeScript & Modern Module Standards**:
   - Use ES module syntax (`import` / `export`) consistently.
   - Define strict TypeScript interfaces for all service parameters, database return types, and request bodies. Avoid `any`.
3. **Database Security & Transactions**:
   - **Parameterized Queries**: Always use parameter binding (`$1, $2, ...`). Never concatenate user input directly into SQL strings.
   - **ACID Transactions**: For operations touching multiple tables (e.g., creating an order and inserting its `order_items`), obtain a client from `pool.connect()` and wrap operations in `BEGIN`, `COMMIT`, and `ROLLBACK` within a `try/finally` releasing the client (`client.release()`).
   - **Efficient Queries**: Use PostgreSQL features like window functions (`COUNT(*) OVER()::int`) for paginated queries to avoid dual database roundtrips.
4. **Authentication & Session Handling**:
   - Authentication tokens (`authToken`) must be issued in HTTP-only, secure, sameSite cookies.
   - Protected routes must always incorporate the `authenticateToken` middleware.
   - Never return passwords or verification tokens in API response payloads.

---

## 4. State Management & Routing Architecture

### Routing Architecture

Routing is managed in [`ecommerce-project-react/src/app/App.jsx`](file:///C:/e-commerce-Hardware/ecommerce-project-react/src/app/App.jsx) using React Router nested layouts:

1. **`MainLayout`**:
   - Displays the global sticky [`Header`](file:///C:/e-commerce-Hardware/ecommerce-project-react/src/components/layout/Header.jsx).
   - Renders a scrollable container `<main ref={mainRef} className="flex-1 overflow-auto">`.
   - Exposes `mainRef` via `<Outlet context={{ mainRef }} />`.
   - **Child Page Requirement**: Every child page that restores scroll must consume `mainRef` via `useOutletContext()`:
     ```javascript
     import { useOutletContext } from 'react-router-dom';
     import { useScrollRestore } from '../hooks/useScrollRestore';

     export default function ChildPage() {
       const { mainRef } = useOutletContext();
       const isRestoring = useScrollRestore(mainRef, 'pageScrollKey', !loading);
       // ...
     }
     ```
2. **`AuthLayout`**:
   - Clean, headerless layout dedicated to authentication views (`/login`, `/signup`).
3. **Route Precedence & Paths**:
   - Keep static routes (`/carrinho`, `/search`, `/profile`) clearly distinguished from dynamic category parameters (`/:categoria`).
   - Maintain lowercase canonical route paths (e.g., `/search`, `/signup`).

### State Management: Context API

The application relies on two primary contexts located in `ecommerce-project-react/src/contexts/`:

#### 1. `AuthContext`
- **State**:
  - `isLogged`: Boolean indicating whether the user is authenticated.
  - `userName`: User's display name.
  - `userRole`: User's permission role (e.g., `'customer'`, `'admin'`).
  - `isLoading`: Boolean indicating whether session check `/session` is in progress.
- **Methods**:
  - `login(name, role)`: Updates context state upon successful login.
  - `logout()`: Calls `POST /logout` to invalidate the cookie and clears local user state.
- **Initialization**: Automatically hits `GET /session` (with credentials) on app mount to restore active sessions.

#### 2. `CartContext`
- **Dual-State Mechanics**:
  - **Guest Mode (`!isLogged`)**: Cart items are stored in `localStorage` under key `'cart'`. Item details are hydrated by sending product IDs to `POST /getItems`.
  - **Authenticated Mode (`isLogged`)**: Cart state is stored on the PostgreSQL database (`cart_items` table) and retrieved via `GET /getcart`.
- **Guest-to-User Merge Strategy**:
  - Upon successful login in `Login.jsx`, if a guest cart exists in `localStorage`, dispatch `POST /cart/merge` with `items: [{ productId, quantity }]`.
  - Once merged, remove the local `'cart'` key and call `fetchCart()` to synchronize with the server.
- **Methods**:
  - `addToCart(productId, quantity)`
  - `deleteItem(productId)`
  - `deleteCart()` (removes active cart after checkout)
  - `clearCart()` (wipes local/client cart state)
  - `totalItems`, `totalPrice`, `cartLoading`

---

## 5. Environment Variables & Setup

### Frontend (`ecommerce-project-react/.env`)
```env
VITE_API_URL=http://localhost:3000
```

### Backend (`server/.env`)
```env
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
SERVER_URL=http://localhost:3000
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your_super_secret_jwt_key
RESEND_API_KEY=your_resend_api_key
```

---

## 6. Scripts & Execution Commands

### Running Backend
```bash
cd server
npm install
npm run dev     # Runs tsx watch server.ts
npm run build   # Compiles TypeScript to dist/
npm start       # Runs production dist/server.js
```

### Running Frontend
```bash
cd ecommerce-project-react
npm install
npm run dev     # Starts Vite dev server (http://localhost:5173)
npm run build   # Builds production bundle to dist/
npm run preview # Previews production build
```
