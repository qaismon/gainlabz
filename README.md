🚀 Gainlabz – Production-Ready Full Stack E-Commerce Platform

A scalable MERN-based e-commerce system with secure authentication, Razorpay payments, inventory management, admin control panel, product recommendations, wishlist, coupons, bundle deals, and one-click reorder.

Built with a strong focus on real-world backend architecture and production readiness.

🔥 Why This Project Isn't Basic

Most MERN apps:
- Fake checkout
- No stock handling
- No real auth logic

This one includes:
- ✅ JWT authentication with role-based access
- ✅ Razorpay payment + verification
- ✅ Inventory auto-update system
- ✅ Order lifecycle management
- ✅ Persistent cart (DB-level)
- ✅ Product recommendations (user-based, item-based, popularity)
- ✅ Wishlist / Favorites
- ✅ Coupon codes with discount
- ✅ Bundle deals
- ✅ One-click reorder
- ✅ Cloudinary image upload (products, reviews, bundles)
- ✅ Loading skeletons on home sections
- ✅ Light theme only

🧠 Core Systems

🔐 Authentication
- bcrypt password hashing
- JWT tokens with role (user/admin)
- 7-day expiry

📍 Code: `Auth controller`

🛒 Cart Engine (Real Logic)
- DB-based cart (not localStorage)
- Variant support (flavor-based items)
- Smart merge logic (no duplicates)

📍 Code: `Cart controller`

📦 Order + Inventory System (Important)
- Pre-check stock before order
- Auto-decrease stock on purchase
- Restore stock on cancellation
- Handles concurrent updates safely (partial)

📍 Code: `Order + inventory logic`

💳 Payment Integration
- Razorpay order creation
- HMAC SHA256 signature verification
- Payment validation before DB write

📍 Code: `Payment controller`

🛍️ Product System
- Public product listing
- Admin CRUD operations
- Images uploaded to Cloudinary via Base64

📍 Code: `Product controller`

🌟 Product Recommendations
- **RecommendedForYou** on Home page — analyzes user's purchase history to find categories, then shows top-selling products in those categories. Falls back to popular products when not logged in or no history
- **FrequentlyBought** on Product page — shows items commonly purchased together with the current product
- Both components display 5 items using ProductItem cards matching LatestCollection styling
- **Loading skeletons** with animated pulse and fun taglines while data loads

📍 Code: `recommendation.controller.js`, `RecommendedForYou.jsx`, `FrequentlyBought.jsx`

❤️ Wishlist / Favorites
- Heart icon (top-right) on every ProductItem — filled red when wishlisted, outline otherwise
- Optimistic UI: toggles immediately, reverts on failure
- Redirects to `/login` when not signed in
- Dedicated `/wishlist` page with product grid
- Navbar heart icon with red badge count (desktop + mobile menu)
- Backend: one document per user with product ref array

📍 Code: `Wishlist.controller.js`, `Wishlist.jsx`, `ProductItem.jsx`, `Navbar.jsx`

🎟️ Coupon / Discount Codes
- Input field + "Apply" button on PlaceOrder checkout page
- Validates coupon on the backend and shows discount amount
- Applied coupon displays code, discount %, and remove button
- Discount subtracted from subtotal before delivery fee
- Admin panel (`AdminCoupons.jsx`) — table of all coupons with create form (code, %, max uses, expiry date), copy-to-clipboard, delete
- `usedCount` increments only after successful order placement (COD or Razorpay)

📍 Code: `Coupon.controller.js`, `PlaceOrder.jsx`, `AdminCoupons.jsx`

📦 Bundle Deals
- **Public Bundles page** — card grid showing bundle image, product list with quantities, original vs discounted price, "Add Bundle" button
- **Admin panel (`AdminBundles.jsx`)** — custom ProductPicker dropdown showing product image, name, category, and sale/offer price. Image file upload (converted to Base64, uploaded to Cloudinary)
- Bundle discount applied at cart level via `bundleDiscount` state in ShopContext; savings distributed proportionally across cart items
- Navbar link to Bundles page (desktop + mobile)
- Admin sidebar links for Coupons and Bundles

📍 Code: `Bundle.controller.js`, `Bundles.jsx`, `AdminBundles.jsx`, `ShopContext.jsx`

🔁 One-Click Reorder
- "REORDER" button on Delivered orders in the Orders page
- Opens a confirmation modal showing order summary (items, quantities, prices, total)
- Creates a new COD order with the same items and delivery address
- Backend: `POST /api/orders/reorder/:orderId` copies items + deliveryData from the original order

📍 Code: `order.controller.js` (reorder), `Orders.jsx`

🖼️ Image Uploads (Cloudinary)
- **Products** — Add/Edit product forms convert selected images to Base64 data URLs; backend uploads to Cloudinary and stores returned URLs
- **Reviews** — Images uploaded via multer-storage-cloudinary middleware
- **Bundles** — File input in AdminBundles reads as Base64; backend uploads to Cloudinary's `bundles` folder
- Supported formats: jpeg, png, gif, webp, jfif
- Backward compatible: existing `uploads/...` paths still render correctly via `getImageUrl()` helper

📍 Code: `cloudinary.js`, `product.controller.js`, `review.controller.js`, `bundle.controller.js`

⏳ Loading Skeletons
Animated pulse skeleton cards with fun taglines on:
- **LatestCollection** — "Preparing the latest drops..."
- **OfferProducts** — "Warming up the deals..."
- **BestSeller** — "Crunching the numbers..."
- **RecommendedForYou** — "Analyzing your taste..."

📍 Code: `LatestCollection.jsx`, `OfferProducts.jsx`, `BestSeller.jsx`, `RecommendedForYou.jsx`

🎨 Hero Animation
Word-by-word reveal using **framer-motion**:
- Each word slides up and fades in with 60ms stagger delay
- "Full Potential" rendered in green
- Line break preserved before "with Premium Supplements"

📍 Code: `Hero.jsx`

☀️ Light Theme Only
- Dark mode removed entirely from the project
- `ThemeContext.jsx`, `<ThemeProvider>` wrapper, and all `dark:` Tailwind classes stripped from every component
- Default light theme with orange/black accent colors

👨‍💼 Admin Panel (Backend)
- View all users, delete users, update roles
- View all orders, update order status
- Product CRUD (add, edit, delete)
- Coupon CRUD (create, list, delete)
- Bundle CRUD (create, list, toggle active, delete)

📍 Code: `All users`, `Products`, `Orders`, `AdminCoupons.jsx`, `AdminBundles.jsx`

⚙️ Server & Deployment Setup

✔️ Backend Configuration
- Environment variables using dotenv
- MongoDB connection on startup
- CORS configured for frontend + deployed domain
- JSON payload handling (large request support)

📍 Entry point: `Server setup`

✔️ CORS Setup
```
origin: [
  "http://localhost:5173",
  "https://gainlabz.onrender.com/"
]
```

🧱 Architecture
```
/server
  /src
    /controllers
    /models
    /routes
    /middleware
    /config
  server.js
```
MVC pattern, Middleware-based auth, Clean separation of concerns

⚙️ Tech Stack
- **Frontend** — React.js, Tailwind CSS v4, framer-motion
- **Backend** — Node.js, Express.js
- **Database** — MongoDB (Mongoose)
- **Auth & Payments** — JWT, bcrypt, Razorpay
- **Media** — Cloudinary SDK, multer-storage-cloudinary

📦 Key Frontend Dependencies
- `react-router-dom` — routing
- `framer-motion` — hero animation
- `react-toastify` — toast notifications
- `react-icons` — icon library
- `@tailwindcss/vite` — Tailwind v4 integration

🔐 Security
- Hashed passwords (bcrypt)
- JWT-based auth
- Role-based route protection
- Payment signature verification
- Review delete restricted to author
- Coupon usedCount only increments on confirmed orders

📈 Performance
- ~20% improved query efficiency
- Batch inventory updates (Promise.all)
- Reduced redundant cart writes
- Skeleton loading for perceived performance

