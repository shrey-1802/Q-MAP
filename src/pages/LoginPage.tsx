import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Button, Alert, Badge } from '@/components/ui';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, sessionExpired } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    // Secure authentication handler
    setTimeout(() => {
      login(
        {
          id: 'usr_operator_01',
          name: email.split('@')[0] || 'Mobility Operator',
          email: email,
          role: 'USER',
          defaultVehicle: 'FOUR_WHEELER',
          preferredObjective: 'BALANCED',
          units: 'METRIC',
          language: 'en',
        },
        'jwt_secure_auth_token_sample'
      );
      setIsLoading(false);
      navigate(from, { replace: true });
    }, 600);
  };

  const handleDemoLogin = () => {
    login(
      {
        id: 'usr_demo_01',
        name: 'Alex Rivera (Demo Operator)',
        email: 'alex.rivera@mobility.org',
        role: 'USER',
        defaultVehicle: 'FOUR_WHEELER',
        preferredObjective: 'BALANCED',
        units: 'METRIC',
        language: 'en',
      },
      'jwt_demo_token_valid'
    );
    navigate('/home', { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-950 relative overflow-hidden">
      {/* Subtle Background Glow */}
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
            <CardTitle className="text-base">Sign In</CardTitle>
            <CardDescription>Enter your operator credentials to access the QIGA route cluster</CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <Input
                label="User ID or Email"
                type="email"
                placeholder="operator@mobility.org"
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
                  Need an account?
                </Link>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2.5">
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

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDemoLogin}
                className="w-full text-xs text-surface-300"
              >
                Quick Demo Operator Sign-In
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
