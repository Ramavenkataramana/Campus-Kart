# CampusKart - Backend REST API

Standalone Node.js + Express + TypeScript backend for CampusKart (College Student Marketplace).

## Features
- **Authentication**: JWT token issuance and verification
- **Products Catalog**: Filter by category, price, condition, search query, and sorting
- **Price Offers**: Peer-to-peer price negotiation between students
- **Campus Wishlist**: Urgent requests board
- **Campus Orders**: Physical handover checkout flow
- **PostgreSQL Ready**: Complete DDL in `schema.sql` (configured for AWS VPC private subnet)

## Setup & Running

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env

# 3. Start development server (Port 5000)
npm run dev

# 4. Build for production
npm run build
npm start
```
