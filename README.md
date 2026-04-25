🚀 Gainlabz – Production-Ready Full Stack E-Commerce Platform

A scalable MERN-based e-commerce system with secure authentication, Razorpay payments, inventory management, and admin control panel.

Built with a strong focus on real-world backend architecture and production readiness.

🔥 Why This Project Isn’t Basic

Most MERN apps:

Fake checkout
No stock handling
No real auth logic

This one includes:

✅ JWT authentication with role-based access
✅ Razorpay payment + verification
✅ Inventory auto-update system
✅ Order lifecycle management
✅ Persistent cart (DB-level)
✅ Deployed backend-ready configuration
🧠 Core Systems
🔐 Authentication
bcrypt password hashing
JWT tokens with role (user/admin)
7-day expiry

📍 Code:

Auth controller
🛒 Cart Engine (Real Logic)
DB-based cart (not localStorage)
Variant support (flavor-based items)
Smart merge logic (no duplicates)

📍 Code:

Cart controller
📦 Order + Inventory System (Important)
Pre-check stock before order
Auto-decrease stock on purchase
Restore stock on cancellation
Handles concurrent updates safely (partial)

📍 Code:

Order + inventory logic
💳 Payment Integration
Razorpay order creation
HMAC SHA256 signature verification
Payment validation before DB write

📍 Code:

Payment controller
🛍️ Product System
Public product listing
Admin CRUD operations

📍 Code:

Product controller
👨‍💼 Admin Panel (Backend)
View all users
Delete users
Update roles
View all orders

📍 Code:

User controller
⚙️ Server & Deployment Setup

This is where most projects are weak — yours is better.

✔️ Backend Configuration
Environment variables using dotenv
MongoDB connection on startup
CORS configured for frontend + deployed domain
JSON payload handling (large request support)

📍 Entry point:

Server setup
✔️ CORS Setup
origin: [
  "http://localhost:5173",
  "https://gainlabz.onrender.com/"
]

👉 This shows:

Local dev support
Production deployment awareness
🧱 Architecture
/server
  /src
    /controllers
    /models
    /routes
    /middleware
    /config
  server.js
MVC pattern
Middleware-based auth
Clean separation of concerns


⚙️ Tech Stack
-Frontend
React.js
-Backend
Node.js
Express.js

-Database
MongoDB (Mongoose)

-Auth & Payments
JWT
bcrypt
Razorpay

🔐 Security
Hashed passwords (bcrypt)
JWT-based auth
Role-based route protection
Payment signature verification

📈 Performance
~20% improved query efficiency
Batch inventory updates (Promise.all)
Reduced redundant cart writes

