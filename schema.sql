-- CampusKart: College Student Marketplace Database Schema
-- Target Database: PostgreSQL 15+
-- Cloud Deployment: AWS VPC Private Subnet with RDS PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users table (College Students)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    college_branch VARCHAR(100) NOT NULL,
    college_year VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    hostel_address VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products table (Used books & college items)
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
    seller_contact VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'sold'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast marketplace searches
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_seller ON products(seller_id);

-- 3. Orders table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    buyer_name VARCHAR(100) NOT NULL,
    buyer_email VARCHAR(120) NOT NULL,
    buyer_phone VARCHAR(20) NOT NULL,
    delivery_location VARCHAR(200) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Cash/UPI on Campus Handover',
    status VARCHAR(30) DEFAULT 'confirmed', -- 'confirmed', 'completed', 'cancelled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    seller_name VARCHAR(100)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
