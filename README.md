# CompuStore — Full-Stack Hardware E-Commerce

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

**CompuStore** is a full-stack e-commerce web application specializing in computer components and PC hardware (CPUs, GPUs, Motherboards, RAM, Storage, Power Supplies, Cases, Coolers).

Built with a modern Single Page Application (SPA) architecture on the frontend and a modular 3-tier REST API on the backend, CompuStore features guest-to-authenticated cart synchronization, transactional checkout, email account activation, and hardware catalog filtering.

---

## 🚀 Key Features

### 🖥️ Storefront & Product Catalog

- **Multi-Category Navigation**: Categorized hardware listings with dedicated views for Processors, Graphics Cards, Motherboards, RAM, Storage, PSUs, Cases, and Coolers.
- **Dynamic Server-Side Filtering & Sorting**: Filter products by manufacturer brand, price range slider, and sort by price or name using PostgreSQL window functions for single-query pagination.
- **Full-Text Catalog Search**: Fast keyword search across product titles.
- **Product Detail Views**: Rich product pages with technical specifications tables, stock indicators, and pricing.
- **Interactive Carousels & Hero Banners**: Powered by Embla Carousel with smooth slide controls and responsive viewports.

### 🛒 Shopping Cart & Checkout

- **Hybrid Dual-Mode Cart**:
  - **Guest Mode**: Cart items are saved locally in `localStorage` and enriched with live pricing and product data via the API.
  - **Authenticated Mode**: Cart items are persisted to the PostgreSQL database (`cart_items` table).
  - **Automatic Cart Merge**: Unauthenticated items in `localStorage` are seamlessly migrated and merged into the user's database cart upon logging in.
- **Cart Drawer & Summary Page**: Real-time quantity adjustments, item removals, subtotal calculations, and order preview.
- **ACID Transactional Checkout**: Order creation and line-item insertions are wrapped in database transactions (`BEGIN` / `COMMIT` / `ROLLBACK`).

### 🔐 Authentication & Account Management

- **Secure JWT Session Management**: Tokens are delivered and verified via `httpOnly`, `sameSite` secure browser cookies to prevent XSS attacks.
- **Email Activation Flow**: New registrations trigger transactional confirmation emails with expiring verification tokens via the Resend API.
- **User Profile Dashboard**: Tabbed user panel displaying account information and real-time order history with expandable order line items.

### 🎨 UI, UX & Theming

- **Dark Mode / Light Mode**: Class-based theme toggling persisted in `localStorage` using CSS custom properties (HSL color tokens).
- **Scroll Restoration**: Custom `useScrollRestore` hook tracking scroll position across routes and category views.
- **Responsive Layout**: Designed for mobile, tablet, and desktop viewports.

---

## 🛠️ Tech Stack

### Frontend (`ecommerce-project-react/`)

- **Core**: React 19, Vite, JavaScript (JSX)
- **Routing**: React Router (`react-router-dom` v7 with nested layout architecture)
- **Styling**: Tailwind CSS 3.4, PostCSS, Autoprefixer, `tailwind-merge`, `clsx`
- **UI Primitives**: Radix UI (`@radix-ui/react-select`, `@radix-ui/react-slider`, `@radix-ui/react-slot`)
- **Icons**: Lucide React
- **Carousels**: Embla Carousel (`embla-carousel-react`, `embla-carousel-autoplay`)
- **State Management**: React Context API (`AuthContext`, `CartContext`)

### Backend (`server/`)

- **Runtime & Framework**: Node.js, Express 5
- **Language**: TypeScript 5.7 executed with `tsx` (development) and `tsc` (production)
- **Database Driver**: `pg` (node-postgres with connection pooling)
- **Security & Cryptography**: `bcrypt` (password hashing), `jsonwebtoken` (JWT cookies)
- **Email Delivery**: `resend` (transactional email API)
- **Architecture**: Layered 3-tier modular architecture (`routes` $\to$ `controllers` $\to$ `services` $\to$ `models`)

### Database

- **Database Engine**: PostgreSQL
- **Schema**: Tables for `product`, `product_specs`, `categories`, `users`, `user_auth`, `cart_items`, `orders`, and `order_items` with relational foreign keys and cascading deletes.

---

## 📁 Directory Structure

```
e-commerce-Hardware/
├── ecommerce-project-react/       # Frontend application
│   ├── src/
│   │   ├── app/
│   │   │   └── App.jsx            # Routing layout, MainLayout & AuthLayout
│   │   ├── components/
│   │   │   ├── cart/              # Cart & Order UI (OrderCard)
│   │   │   ├── layout/            # Layout shell (Header, Navigation)
│   │   │   ├── product/           # Catalog UI (CardItem, FilterSidebar, Banner, Carousel)
│   │   │   └── ui/                # Radix UI primitives (Button, Slider, Select, Carousel)
│   │   ├── contexts/              # Global state (AuthContext, CartContext)
│   │   ├── data/                  # Category mappings (idParaCategoria.js) & banners
│   │   ├── hooks/                 # Custom hooks (useScrollRestore.js)
│   │   ├── lib/                   # Utility helpers (utils.js)
│   │   ├── pages/                 # Route pages (Home, CategoryPage, Detail, Cart, Profile, etc.)
│   │   ├── index.css              # Tailwind base layers & HSL color tokens
│   │   └── main.jsx               # React entry point
│   ├── tailwind.config.js         # Tailwind theme configuration
│   └── vite.config.js             # Vite configuration with '@' alias
│
├── server/                        # Backend REST API
│   ├── server.ts                  # Server entry point
│   └── src/
│       ├── app.ts                 # Express application & middleware setup
│       ├── config/                # Database pool (db.ts) & Resend client (resend.ts)
│       ├── middleware/            # Auth middleware (auth.middleware.ts)
│       ├── model/                 # TypeScript interfaces (auth, cart, orders, products)
│       └── modules/               # Modular domain logic
│           ├── auth/              # Auth controllers, routes, and services
│           ├── cart/              # Cart controllers, routes, and services
│           ├── orders/            # Order controllers, routes, and services
│           └── products/          # Product catalog & filtering logic
│
├── Script-1.sql                   # Database migrations, tables, and seed dataset
├── cpu.json                       # Hardware specifications reference dataset
├── GEMINI.md                      # Developer instructions & coding guidelines
└── README.md                      # Project documentation (this file)
```

---

## ⚙️ Installation & Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [PostgreSQL](https://www.postgresql.org/) (running instance)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

---

### 1. Database Setup

1. Create a PostgreSQL database (e.g. `compustore` or `postgres`):
   ```sql
   CREATE DATABASE compustore;
   ```
2. Run the initialization and seed script located at [`Script-1.sql`](./Script-1.sql) using your preferred SQL client (e.g., DBeaver, pgAdmin, or `psql`):
   ```bash
   psql -U postgres -d compustore -f Script-1.sql
   ```

---

### 2. Backend Setup (`server/`)

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `server/.env`:

   ```env
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   SERVER_URL=http://localhost:3000

   # Database connection
   DB_USER=postgres
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=compustore

   # Security & Services
   JWT_SECRET=your_jwt_secret_key_here
   RESEND_API_KEY=your_resend_api_key_here
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   _The API will start at `http://localhost:3000`._

---

### 3. Frontend Setup (`ecommerce-project-react/`)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd ecommerce-project-react
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file to specify the API URL (defaults to `http://localhost:3000`):
   ```env
   VITE_API_URL=http://localhost:3000
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   _The application will open at `http://localhost:5173`._

---

## 📡 API Overview

| Method     | Endpoint                                    | Description                                                 | Auth Required |
| :--------- | :------------------------------------------ | :---------------------------------------------------------- | :-----------: |
| **GET**    | `/products`                                 | List catalog products with pagination (`limit`, `offset`)   |      No       |
| **GET**    | `/products/category/id/:categoryId`         | Paginated products by category with brand/price filters     |      No       |
| **GET**    | `/products/category/id/:categoryId/filters` | Aggregated filter options (available brands, min/max price) |      No       |
| **GET**    | `/products/search`                          | Search products by name (`searchQuery`)                     |      No       |
| **GET**    | `/products/:id/details`                     | Product details and technical specifications                |      No       |
| **POST**   | `/register`                                 | Register a new user account and send verification email     |      No       |
| **GET**    | `/verify/:token`                            | Confirm email token and activate user account               |      No       |
| **POST**   | `/login`                                    | Authenticate user and issue secure HTTP-only JWT cookie     |      No       |
| **GET**    | `/session`                                  | Retrieve active session details for current user            |    **Yes**    |
| **POST**   | `/logout`                                   | Invalidate active authentication cookie                     |      No       |
| **GET**    | `/getcart`                                  | Retrieve the authenticated user's cart                      |    **Yes**    |
| **POST**   | `/cart`                                     | Add an item or update quantity in cart                      |    **Yes**    |
| **POST**   | `/getItems`                                 | Hydrate local guest cart IDs with product details           |      No       |
| **POST**   | `/cart/merge`                               | Merge guest `localStorage` items into user account          |    **Yes**    |
| **DELETE** | `/cart/:itemId`                             | Remove an item from the cart                                |    **Yes**    |
| **DELETE** | `/cart`                                     | Clear all items from the cart                               |    **Yes**    |
| **POST**   | `/order`                                    | Place an order with address and line items (transactional)  |    **Yes**    |
| **GET**    | `/orders`                                   | Retrieve order history with line items for current user     |    **Yes**    |

---

## 📜 Available Scripts

### Backend (`server/`)

- `npm run dev`: Starts the server in development mode using `tsx watch`.
- `npm run build`: Compiles TypeScript source files to the `dist/` directory.
- `npm start`: Executes the compiled production bundle (`node dist/server.js`).

### Frontend (`ecommerce-project-react/`)

- `npm run dev`: Launches the local Vite development server with HMR.
- `npm run build`: Bundles optimized production assets to `dist/`.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint over the source files.

---

## 📄 Documentation

For full architectural guidelines, state management mechanics, and coding standards, refer to [`GEMINI.md`](./GEMINI.md).
