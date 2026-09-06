import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Modal, Button, Badge } from '@/components/ui';
import {
  Compass,
  History,
  BarChart2,
  Settings,
  LogOut,
  Sparkles,
  User,
  Menu,
  X,
  Radio,
} from 'lucide-react';
import { cn } from '@/utils/cn';

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, sessionExpired, setSessionExpired } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { to: '/home', label: 'Route Planner', icon: <Compass className="w-4 h-4" /> },
    { to: '/history', label: 'History', icon: <History className="w-4 h-4" /> },
    { to: '/analysis', label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
    { to: '/settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface-950 text-surface-50 flex flex-col antialiased">
      {/* Top Header */}
      <header className="h-14 border-b border-surface-800 bg-surface-950/90 backdrop-blur-md sticky top-0 z-40 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/home" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-quantum-500 flex items-center justify-center font-bold text-surface-950 shadow-glow-teal">
              <Sparkles className="w-4 h-4 text-surface-950" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-surface-100 hidden sm:inline">
              Q-MAP Intelligence
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-900 border border-surface-800 text-[11px] text-surface-400">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>QIGA Node: Active</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-surface-800 text-brand-300 font-semibold border border-surface-700/60'
                    : 'text-surface-400 hover:text-surface-100 hover:bg-surface-900'
                )
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden lg:block text-right">
                <p className="text-xs font-medium text-surface-200 leading-none">{user.name}</p>
                <p className="text-[10px] text-surface-400 font-mono mt-0.5">{user.role}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Sign Out"
                className="text-surface-400 hover:text-rose-400"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="primary" size="sm">
                Sign In
              </Button>
            </Link>
          )}

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-surface-400 hover:text-surface-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-14 bg-surface-900 border-b border-surface-800 z-50 p-4 space-y-2 shadow-2xl animate-fadeIn">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 p-2.5 rounded-lg text-xs font-medium transition-colors',
                  isActive ? 'bg-surface-800 text-brand-300 font-semibold' : 'text-surface-400'
                )
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      )}

      {/* Main App Content View */}
      <main className="flex-1 flex flex-col w-full pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 h-14 bg-surface-950/95 border-t border-surface-800 backdrop-blur-md z-40 flex items-center justify-around px-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors',
                isActive ? 'text-brand-400 font-semibold' : 'text-surface-400 hover:text-surface-200'
              )
            }
          >
            {link.icon}
            <span className="mt-0.5">{link.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Session Expired Modal Guard */}
      <Modal
        isOpen={sessionExpired}
        onClose={() => setSessionExpired(false)}
        title="Session Expired"
      >
        <div className="space-y-4 text-xs text-surface-300 text-left">
          <p>Your authenticated operator session has expired. Please sign in again to continue.</p>
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSessionExpired(false);
                navigate('/login');
              }}
            >
              Sign In Now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
