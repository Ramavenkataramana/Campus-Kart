import React, { useState } from 'react';
import { X, Lock, Mail, User, GraduationCap, Building, Sparkles } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, pass: string) => Promise<void>;
  onRegister: (data: any) => Promise<void>;
  onSelectDemoUser: (user: UserType, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onSelectDemoUser
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [name, setName] = useState('');
  const [collegeBranch, setCollegeBranch] = useState('Computer Science');
  const [collegeYear, setCollegeYear] = useState('3rd Year (B.Tech)');
  const [phone, setPhone] = useState('');
  const [hostelAddress, setHostelAddress] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (mode === 'login') {
        await onLogin(email.trim(), password);
      } else {
        await onRegister({
          name: name.trim(),
          email: email.trim(),
          password,
          collegeBranch,
          collegeYear,
          phone: phone.trim(),
          hostelAddress: hostelAddress.trim()
        });
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = (userIndex: 1 | 2) => {
    if (userIndex === 1) {
      onSelectDemoUser(
        {
          id: 'user-demo-1',
          name: 'Aarav Patel',
          email: 'aarav@college.edu',
          collegeBranch: 'Computer Science & Engineering',
          collegeYear: '3rd Year (B.Tech)',
          phone: '+91 98765 43210',
          hostelAddress: 'Hostel Block 3, Room 214'
        },
        'demo-jwt-token-aarav'
      );
    } else {
      onSelectDemoUser(
        {
          id: 'user-demo-2',
          name: 'Priya Sen',
          email: 'priya@college.edu',
          collegeBranch: 'Electronics & Communication',
          collegeYear: '2nd Year (B.Tech)',
          phone: '+91 91234 56789',
          hostelAddress: 'Girls Hostel B, Room 102'
        },
        'demo-jwt-token-priya'
      );
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 max-w-md w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col text-zinc-100">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-none">
                CampusKart Student Sign In
              </h3>
              <span className="text-xs text-zinc-400">
                Buy and sell with verified college peers
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

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-zinc-950 mx-5 mt-4 rounded-xl text-xs font-semibold border border-zinc-800">
          <button
            onClick={() => setMode('login')}
            className={`py-2 rounded-lg transition-colors ${
              mode === 'login'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setMode('register')}
            className={`py-2 rounded-lg transition-colors ${
              mode === 'register'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Full Student Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Patel"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Department</label>
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={collegeBranch}
                    onChange={e => setCollegeBranch(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Year / Semester</label>
                  <input
                    type="text"
                    placeholder="e.g. 3rd Year"
                    value={collegeYear}
                    onChange={e => setCollegeYear(e.target.value)}
                    className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-zinc-300 font-medium mb-1">College Email Address</label>
            <input
              type="email"
              placeholder="student@college.edu"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
              required
            />
          </div>

          <div>
            <label className="block text-zinc-300 font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-colors"
          >
            {isLoading
              ? 'Authenticating...'
              : mode === 'login'
              ? 'Log In to CampusKart'
              : 'Create Student Account'}
          </button>

          {/* Quick Demo Profiles */}
          <div className="pt-3 border-t border-zinc-800 space-y-2">
            <span className="block text-[11px] font-semibold text-zinc-400 text-center uppercase tracking-wider">
              Quick Student Demo Profiles
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn(1)}
                className="p-2.5 rounded-xl border border-zinc-800 hover:border-blue-500/60 bg-zinc-950 hover:bg-blue-950/20 text-left transition-colors"
              >
                <div className="font-bold text-white">Aarav Patel</div>
                <div className="text-[10px] text-blue-400">CS 3rd Year</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSignIn(2)}
                className="p-2.5 rounded-xl border border-zinc-800 hover:border-blue-500/60 bg-zinc-950 hover:bg-blue-950/20 text-left transition-colors"
              >
                <div className="font-bold text-white">Priya Sen</div>
                <div className="text-[10px] text-blue-400">ECE 2nd Year</div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
