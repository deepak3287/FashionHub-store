# FashionHub - Premium Full-Stack Ecommerce Starter

FashionHub is a premium fashion ecommerce starter built with **Next.js App Router, TypeScript, MongoDB, Tailwind CSS, JWT cookies, Razorpay/Stripe-ready payment APIs, and a protected admin dashboard**.

## What is included

- Premium responsive customer storefront
- Customer pages: Home, Shop, Product Detail, Cart, Checkout, Auth, Account placeholders, Policies
- Admin pages: Login, Dashboard, Products, Orders, Categories, Customers, Coupons, Payments, Couriers, Reviews, Banners, Settings
- Protected admin routes with role-based access
- MongoDB models for users, products, categories, orders, coupons, settings, couriers, payment gateways and reviews
- Prepaid-only checkout flow base
- Razorpay order creation and signature verification route
- Stripe checkout session base route
- Admin CRUD API base for products, categories and order status/tracking
- Premium Tailwind theme: black, beige, gold accents
- Seed script with demo admin and sample fashion products

## Important business rules implemented

- COD is not present anywhere
- Checkout UI shows prepaid-only payment
- Admin dashboard is protected
- Secret keys are kept server-side
- Orders are designed to be confirmed after successful payment verification

## Setup

```bash
npm install
cp .env.example .env.local
npm run seed
npm run dev
```

Open:

```bash
http://localhost:3000
```

Admin login:

```txt
Email: admin@fashionhub.local
Password: Admin@12345
```

## Notes before production

This is a strong production-style foundation, but before launching a real store you should add:
- Real Cloudinary upload widget/server upload signing
- Real email provider like Resend, SendGrid or SMTP
- Payment webhook verification for Razorpay/Stripe
- Legal pages reviewed for your business
- Real invoice PDF generator
- Security hardening, rate limiting storage, monitoring and backups
