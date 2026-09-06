import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Button, Alert } from '@/components/ui';
import { Sparkles, Lock, Mail, ArrowRight, Copy, CheckCircle2, Eye, EyeOff } from 'lucide-react';

// Demo credentials to show on the login page
const DEMO_CREDENTIALS = [
  { label: 'Fleet Manager', email: 'alex.rivera@mobility.org', password: 'password123', role: 'FLEET_MANAGER' },
  { label: 'Q-Scientist',   email: 'researcher@mobility.org',  password: 'qiga2024',    role: 'RESEARCHER'    },
  { label: 'Dispatcher',    email: 'dispatcher@mobility.org',  password: 'dispatch99',  role: 'DISPATCHER'    },
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, sessionExpired, registeredAccounts } = useAuthStore();

  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const from = (location.state as any)?.from?.pathname || '/home';

  // Fill credentials from demo card click
  const handleFillDemo = (idx: number) => {
    const cred = DEMO_CREDENTIALS[idx]!;
    setEmail(cred.email);
    setPassword(cred.password);
    setCopiedIdx(idx);
    setError(null);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      // 1. Check registered accounts (from store)
      const matched = registeredAccounts.find(
        (acc) => acc.user.email.toLowerCase() === email.toLowerCase() && acc.passwordHash === password
      );

      if (matched) {
        login(matched.user, `jwt_token_${Date.now()}`);
        setIsLoading(false);
        navigate(from, { replace: true });
        return;
      }

      // 2. Check demo credentials
      const demo = DEMO_CREDENTIALS.find(
        (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
      );

      if (demo) {
        login(
          {
            id: `usr_${demo.role.toLowerCase()}_01`,
            name: demo.label,
            email: demo.email,
            role: demo.role === 'FLEET_MANAGER' ? 'FLEET_MANAGER' : 'USER',
            defaultVehicle: demo.role === 'DISPATCHER' ? 'HEAVY_LOAD' : 'FOUR_WHEELER',
            preferredObjective: demo.role === 'RESEARCHER' ? 'ECO' : 'BALANCED',
            units: 'METRIC',
            language: 'en',
          },
          `jwt_demo_${Date.now()}`
        );
        setIsLoading(false);
        navigate(from, { replace: true });
        return;
      }

      // 3. Invalid credentials
      setError('Invalid email or password. Use the demo credentials below.');
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-950 relative overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-quantum-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-5 relative z-10 text-left">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>QIGA Production Platform v2.0</span>
          </div>
          <h1 className="text-2xl font-black text-surface-100 tracking-tight">Q-MAP Intelligence</h1>
          <p className="text-xs text-surface-400">Quantum-Inspired Genetic Algorithm Multi-Objective Router</p>
        </div>

        {sessionExpired && (
          <Alert variant="warning" title="Session Expired">
            Your session has ended. Please sign in again to continue route planning.
          </Alert>
        )}

        {error && (
          <Alert variant="error" title="Authentication Failed">
            {error}
          </Alert>
        )}

        {/* ── Login card ── */}
        <Card variant="glass" className="border-surface-700/80 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-base">Operator Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the QIGA platform</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <Input
                label="Email / Operator ID"
                type="email"
                placeholder="e.g. alex.rivera@mobility.org"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  leftIcon={<Lock className="w-4 h-4" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-8 text-surface-400 hover:text-surface-200 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <Link to="/forgot-password" className="text-brand-400 hover:text-brand-300 transition-colors">
                  Forgot password?
                </Link>
                <Link to="/register" className="text-surface-400 hover:text-surface-200 transition-colors">
                  Create Account
                </Link>
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4 text-surface-950" />}
                className="w-full"
              >
                Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* ── Demo credentials panel ── */}
        <div className="rounded-2xl border border-surface-800/80 bg-surface-900/60 backdrop-blur-sm p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-surface-300 tracking-wide uppercase">Demo Credentials</span>
            <span className="text-[10px] text-surface-500 ml-auto">Click any to auto-fill</span>
          </div>

          <div className="space-y-2">
            {DEMO_CREDENTIALS.map((cred, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleFillDemo(idx)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-surface-700/60 bg-surface-900/40 hover:border-brand-500/40 hover:bg-brand-500/5 transition-all duration-200 text-left group"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-surface-200">{cred.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-800 text-surface-400 border border-surface-700">
                      {cred.role === 'FLEET_MANAGER' ? 'Admin' : cred.role === 'RESEARCHER' ? 'Scientist' : 'Dispatcher'}
                    </span>
                  </div>
                  <div className="text-[11px] text-surface-400 font-mono">
                    {cred.email} · <span className="text-surface-500">{cred.password}</span>
                  </div>
                </div>
                <div className="shrink-0 ml-3">
                  {copiedIdx === idx ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-surface-500 group-hover:text-brand-400 transition-colors" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
