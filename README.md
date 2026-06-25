# ArtHub – Online Art Marketplace

ArtHub is a digital platform designed to bridge the gap between art lovers, collectors, buyers, and talented artists globally. Traditional art buying is often constrained by physical galleries and exhibitions. ArtHub democratizes access to art, enabling emerging artists to showcase their creations to a global audience while providing a secure, streamlined purchase and exploration experience for buyers. Built using the advanced MERN (MongoDB, Express.js, React, Node.js) stack, this project incorporates role-based access control, secure payment processing, real-time feedback, and comprehensive dashboards.

## 🔗 Live Links & Deployment
- **Live Website URL:** [https://arthub-client-dun.vercel.app/]
- **Client-side Repository:** [https://github.com/sanjidanabu/arthub-client]
- **Server-side Repository:** [https://github.com/sanjidanabu/arthub-server]

---

## 🚀 Key Features

### 👤 Role-Based Access Control (RBAC) & Dashboards
The system dynamically adapts to three distinct roles, each having a dedicated and secure dashboard interface:
- **Users (Buyers):**
  - Browse a rich catalog of high-quality artworks and view detailed product pages.
  - Make secure purchases seamlessly via Stripe payment integration.
  - Express engagement through comments and interactive feedback on purchased pieces.
  - Track complete order fulfillment and purchase history from their custom dashboard.
- **Artists:**
  - Full CRUD control to upload and manage their unique art portfolios (Title, medium, price, description, image).
  - Ability to edit details or delete pieces from the marketplace.
  - Dedicated sales history dashboard with tracking metrics to monitor earnings and popularity.
- **Admin:**
  - Comprehensive overview and management of all users, with options to adjust user roles (e.g., promoting a user to an artist or admin).
  - Complete control over system integrity with the ability to delete policy-violating artworks.
  - System-wide transaction overview and detailed analytical logs.

### 🛡️ Security & Authentication
- **Dual Authentication Modes:** Supports secure email/password registration along with seamless Google Social Login.
- **Stateful Verification:** Employs **JSON Web Tokens (JWT)** issued upon authentication, stored securely, and passed via headers to protect private client-side routes and secure server-side API endpoints.
- **Environment Isolation:** Sensitive deployment keys, database credentials, and payment API secrets are completely isolated using environment variables on both client and server layers.

---

## 🛠️ Technology Stack & Dependencies

### Frontend (Client-Side)
The user interface is crafted with focus on contrast, professional space alignment, and an elegant layout suited for an art platform.
- **React.js** – Component-based core architecture.
- **React Router DOM** – For handling clean, declarative client-side routing.
- **Stripe React Elements** – To handle secure, PCI-compliant payment card forms.
- **Tailwind CSS** – For clean, high-contrast, modern responsive styles.

### Backend & Database (Server-Side)
A robust, modular MVC-inspired backend architecture built for speed and security.
- **Node.js & Express.js** – Fast, unopinionated web framework for server routing.
- **MongoDB & Mongoose** – NoSQL database modeling to store structured schemas for users, artworks, and payments.
- **jsonwebtoken (JWT)** – For creating and validating secure access tokens.
- **Stripe SDK** – Backend processing for managing intents and completing monetary transfers.
- **dotenv** – Environment management to abstract configuration data.
- **cors** – Cross-Origin Resource Sharing handling to restrict and whitelist safe origins.

---

## 💻 Environment Setup Guide

To run this project locally, ensure you configure the following environmental files.
