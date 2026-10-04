import React, { useState } from 'react';
import { X, Server, Database, Shield, Globe, Layers, ArrowDown, Code2, CheckCircle2 } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'diagram' | 'sql'>('diagram');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col text-zinc-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-none">
                CampusKart Cloud Architecture
              </h3>
              <span className="text-xs text-zinc-400">
                3-Tier Cloud Design with AWS VPC Private Subnet Isolation
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-zinc-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'diagram'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Cloud & VPC Architecture Diagram
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'sql'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            PostgreSQL Schema (schema.sql)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {activeTab === 'diagram' ? (
            <div className="space-y-4">
              {/* Visual Pipeline */}
              <div className="space-y-3">
                {/* Layer 1: Client */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-400 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      1. Client Web Application
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 font-mono text-[10px] font-bold border border-blue-800/60">
                      React 19 · Vite · Tailwind CSS
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Black theme student marketplace UI. Handles state, instant search, floating interactions, and JWT bearer authentication.
                  </p>
                </div>

                <div className="flex justify-center text-zinc-600">
                  <ArrowDown className="w-4 h-4 animate-bounce text-blue-500" />
                </div>

                {/* Layer 2: Express API */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-400 flex items-center gap-2">
                      <Server className="w-4 h-4 text-indigo-400" />
                      2. Backend REST API
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 font-mono text-[10px] font-bold border border-indigo-800/60">
                      Node.js · Express · JWT Auth
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Mounted on <code>/api/*</code>. Serves product catalogs, student offers, wishlist requests, and campus handover orders.
                  </p>
                </div>

                <div className="flex justify-center text-zinc-600">
                  <ArrowDown className="w-4 h-4 animate-bounce text-emerald-500" />
                </div>

                {/* Layer 3: PostgreSQL */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" />
                      3. Database Tier (AWS VPC Private Subnet)
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-800/60">
                      PostgreSQL 15+ (Port 5432)
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[11px]">
                    Isolated in AWS VPC Private Subnet with zero public ingress. Security Group restricted to Express backend instances.
                  </p>
                </div>
              </div>

              {/* Cloud Deployment Specification */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <h4 className="font-bold text-white text-xs">
                  AWS VPC Subnet Design Blueprint:
                </h4>
                <ul className="space-y-1.5 text-zinc-400 text-[11px]">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span><strong>Public Subnet</strong>: Internet Gateway (IGW) + Application Load Balancer (ALB) routing traffic to web containers.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span><strong>Private App Subnet</strong>: Node.js Express server running inside ECS/EKS container cluster.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span><strong>Isolated Database Subnet</strong>: PostgreSQL RDS instance with port 5432 ingress restricted to app security group.</span>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>Tables: users, products, orders, order_items</span>
                <span className="text-blue-400 font-bold">schema.sql</span>
              </div>
              <pre className="p-4 bg-black text-blue-300 border border-zinc-800 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-[380px]">
{`-- CampusKart PostgreSQL Schema
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    college_branch VARCHAR(100) NOT NULL,
    college_year VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    hostel_address VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    category VARCHAR(50) NOT NULL,
    condition VARCHAR(30) NOT NULL,
    image_url TEXT NOT NULL,
    pickup_spot VARCHAR(150) NOT NULL,
    seller_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
