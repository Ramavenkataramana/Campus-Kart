import React from 'react';
import {
  X,
  Download,
  FolderArchive,
  Server,
  Layout,
  CheckCircle2,
  Terminal,
  FileCode,
  ExternalLink
} from 'lucide-react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 max-w-2xl w-full max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col text-zinc-100">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-zinc-900/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-none">
                Download CampusKart Codebase
              </h3>
              <span className="text-xs text-zinc-400">
                Separated Backend & Frontend standalone projects
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 text-xs">
          {/* Download Packages Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Full Stack Package */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-blue-500/40 relative flex flex-col justify-between space-y-3 shadow-lg">
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-600 text-white inline-block">
                  Recommended
                </span>
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <FolderArchive className="w-4 h-4 text-blue-400" />
                  Full Project
                </h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Both <code>/backend</code> and <code>/frontend</code> with PostgreSQL schema & READMEs.
                </p>
              </div>

              <a
                href="/campuskart-fullstack.zip"
                download="campuskart-fullstack.zip"
                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5 text-center"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .zip</span>
              </a>
            </div>

            {/* Backend Only */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 inline-block">
                  API Only
                </span>
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-indigo-400" />
                  Backend Only
                </h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Node.js + Express REST API, JWT auth, schema.sql & endpoints.
                </p>
              </div>

              <a
                href="/campuskart-backend.zip"
                download="campuskart-backend.zip"
                className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 text-center border border-zinc-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Backend .zip</span>
              </a>
            </div>

            {/* Frontend Only */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 inline-block">
                  UI Only
                </span>
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Layout className="w-4 h-4 text-emerald-400" />
                  Frontend Only
                </h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  React 19 + Vite + Tailwind CSS with black theme & floating cards.
                </p>
              </div>

              <a
                href="/campuskart-frontend.zip"
                download="campuskart-frontend.zip"
                className="w-full py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 text-center border border-zinc-700"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Frontend .zip</span>
              </a>
            </div>
          </div>

          {/* Directory Hierarchy Breakdown */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2.5">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-blue-400" />
              Project Structure Breakdown
            </h4>
            <pre className="p-3 bg-black text-blue-300 rounded-xl font-mono text-[11px] overflow-x-auto border border-zinc-800/80">
{`campuskart/
├── backend/
│   ├── src/server.ts      # Express API server on port 5000 (CORS, JWT, routes)
│   ├── schema.sql         # PostgreSQL DDL for AWS VPC Private Subnet
│   ├── package.json       # express, cors, dotenv, tsx
│   ├── tsconfig.json
│   └── README.md
│
└── frontend/
    ├── src/               # React 19 UI, Tailwind CSS, Lucide icons
    ├── index.html         # Entry point
    ├── vite.config.ts     # Configured with proxy to http://localhost:5000
    ├── package.json       # Standalone frontend dependencies
    ├── tsconfig.json
    └── README.md`}
            </pre>
          </div>

          {/* How to Run Locally Terminal Guide */}
          <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-emerald-400" />
              How to Run Locally on Your Computer
            </h4>

            <div className="space-y-2 text-zinc-300">
              <div>
                <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  1. Start the Backend API (Terminal 1):
                </span>
                <pre className="p-2.5 bg-black text-emerald-400 rounded-lg font-mono text-[11px] border border-zinc-800">
cd backend
npm install
npm run dev
# Backend runs on http://localhost:5000
                </pre>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  2. Start the Frontend App (Terminal 2):
                </span>
                <pre className="p-2.5 bg-black text-emerald-400 rounded-lg font-mono text-[11px] border border-zinc-800">
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
                </pre>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/50 text-[11px] text-blue-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                The frontend's <code>vite.config.ts</code> automatically proxies <code>/api/*</code> requests directly to <code>http://localhost:5000</code>.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
