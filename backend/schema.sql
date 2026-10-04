-- ==============================================================================
-- CampusKart: College Student Marketplace - PostgreSQL Schema DDL
-- Cloud Deployment: AWS VPC Private Subnet with RDS PostgreSQL (Port 5432)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Verified College Students)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    college_branch VARCHAR(100) NOT NULL,
    college_year VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    hostel_address VARCHAR(150),
    campus_name VARCHAR(150) DEFAULT 'Main University Campus',
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table (Used Textbooks, Calculators, Lab & Hostel Gear)
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    category VARCHAR(50) NOT NULL,
    condition VARCHAR(30) NOT NULL, -- 'Brand New', 'Like New', 'Good', 'Fair'
    image_url TEXT NOT NULL,
    pickup_spot VARCHAR(150) NOT NULL,
    seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
    seller_name VARCHAR(100) NOT NULL,
    seller_branch VARCHAR(100),
    seller_year VARCHAR(20),
    seller_contact VARCHAR(100) NOT NULL,
    seller_phone VARCHAR(50),
    is_verified_student BOOLEAN DEFAULT TRUE,
    campus_name VARCHAR(150) DEFAULT 'Main University Campus',
    views_count INT DEFAULT 0,
    saves_count INT DEFAULT 0,
    allow_offers BOOLEAN DEFAULT TRUE,
    highlighting_condition VARCHAR(30) DEFAULT 'None',
    missing_pages BOOLEAN DEFAULT FALSE,
    edition_or_model VARCHAR(150),
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'sold'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);

-- 3. Price Offers Table (Peer Negotiation)
CREATE TABLE IF NOT EXISTS offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    product_title VARCHAR(200) NOT NULL,
    offered_price DECIMAL(10, 2) NOT NULL,
    original_asking_price DECIMAL(10, 2) NOT NULL,
    buyer_name VARCHAR(100) NOT NULL,
    buyer_contact VARCHAR(100) NOT NULL,
    proposed_meetup VARCHAR(200) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'countered', 'declined'
    seller_response_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Campus Item Requests / Wishlist Table
CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_name VARCHAR(100) NOT NULL,
    requester_branch VARCHAR(100) NOT NULL,
    requester_year VARCHAR(20) NOT NULL,
    item_title VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    budget_max DECIMAL(10, 2) NOT NULL,
    urgency VARCHAR(30) DEFAULT 'This Week',
    needed_at VARCHAR(150) NOT NULL,
    responses_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Orders Table (Campus Physical Handover)
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    buyer_name VARCHAR(100) NOT NULL,
    buyer_email VARCHAR(120) NOT NULL,
    buyer_phone VARCHAR(20) NOT NULL,
    delivery_location VARCHAR(200) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Cash/UPI on Campus Handover',
    status VARCHAR(30) DEFAULT 'confirmed',
    handover_time VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    seller_name VARCHAR(100),
    pickup_spot VARCHAR(150)
);
