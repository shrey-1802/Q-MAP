import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Button, Alert, Badge } from '@/components/ui';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, sessionExpired, registeredAccounts } = useAuthStore();

  const [email, setEmail] = useState('alex.rivera@mobility.org');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/home';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your User ID / Email and Password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      // Check registered accounts
      const matched = registeredAccounts.find(
        (acc) => acc.user.email.toLowerCase() === email.toLowerCase() && acc.passwordHash === password
      );

      if (matched) {
        login(matched.user, `jwt_token_${Date.now()}`);
        setIsLoading(false);
        navigate(from, { replace: true });
      } else {
        // Allow fallback demo authentication if any valid password entered
        login(
          {
            id: `usr_${Math.random().toString(36).substring(2, 8)}`,
            name: email.split('@')[0] || 'Mobility Operator',
            email: email,
            role: 'USER',
            defaultVehicle: 'FOUR_WHEELER',
            preferredObjective: 'BALANCED',
            units: 'METRIC',
            language: 'en',
          },
          `jwt_token_${Date.now()}`
        );
        setIsLoading(false);
        navigate(from, { replace: true });
      }
    }, 400);
  };

  const handleQuickSignIn = (role: 'FLEET_MANAGER' | 'RESEARCHER' | 'DISPATCHER') => {
    login(
      {
        id: `usr_${role.toLowerCase()}_01`,
        name: role === 'FLEET_MANAGER' ? 'Alex Rivera' : role === 'RESEARCHER' ? 'Dr. Elena Vance' : 'Marcus Brody',
        email: `${role.toLowerCase()}@mobility.org`,
        role: role === 'FLEET_MANAGER' ? 'FLEET_MANAGER' : 'USER',
        defaultVehicle: role === 'DISPATCHER' ? 'HEAVY_LOAD' : 'FOUR_WHEELER',
        preferredObjective: role === 'RESEARCHER' ? 'ECO' : 'BALANCED',
        units: 'METRIC',
        language: 'en',
      },
      `jwt_quick_${role.toLowerCase()}`
    );
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-950 relative overflow-hidden">
      {/* Subtle Quantum Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-quantum-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10 text-left">
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

        <Card variant="glass" className="border-surface-700/80 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-base">Operator Sign In</CardTitle>
            <CardDescription>Enter credentials or use 1-click Quick Profile to access the QIGA cluster</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <Input
                label="Operator Email / ID"
                type="email"
                placeholder="alex.rivera@mobility.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <div className="flex items-center justify-between text-xs">
                <Link to="/forgot-password" className="text-brand-400 hover:text-brand-300 transition-colors">
                  Forgot password?
                </Link>
                <Link to="/register" className="text-surface-400 hover:text-surface-200 transition-colors">
                  Create Account
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4 text-surface-950" />}
                className="w-full"
              >
                Authenticate & Enter
              </Button>

              <div className="pt-2 border-t border-surface-800/80 w-full space-y-1.5">
                <span className="text-[10px] text-surface-400 font-semibold tracking-wider uppercase block text-center">
                  Instant Demo Roles
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleQuickSignIn('FLEET_MANAGER')}
                    className="text-[11px] px-1 py-1"
                  >
                    Fleet Mgr
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleQuickSignIn('RESEARCHER')}
                    className="text-[11px] px-1 py-1"
                  >
                    Q-Scientist
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => handleQuickSignIn('DISPATCHER')}
                    className="text-[11px] px-1 py-1"
                  >
                    Dispatcher
                  </Button>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
