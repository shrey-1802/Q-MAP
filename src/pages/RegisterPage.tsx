import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Button, Alert } from '@/components/ui';
import { Sparkles, Lock, Mail, User, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    login(
      {
        id: `usr_${Date.now()}`,
        name,
        email,
        role: 'USER',
        defaultVehicle: 'FOUR_WHEELER',
        preferredObjective: 'BALANCED',
        units: 'METRIC',
        language: 'en',
      },
      'jwt_new_registered_token'
    );
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-950 relative">
      <div className="w-full max-w-md space-y-6 text-left relative z-10">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-surface-100">Create Q-MAP Account</h1>
          <p className="text-xs text-surface-400">Join the Quantum-Inspired Route Optimization Network</p>
        </div>

        {error && (
          <Alert variant="error" title="Registration Error">
            {error}
          </Alert>
        )}

        <Card variant="glass">
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-5">
              <Input
                label="Full Name"
                placeholder="Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-4 h-4" />}
                required
              />
              <Input
                label="Work Email"
                type="email"
                placeholder="alex@mobility.org"
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
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
            </CardContent>

            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" variant="primary" size="md" className="w-full">
                Register & Initialize
              </Button>
              <div className="text-center text-xs text-surface-400">
                Already registered?{' '}
                <Link to="/login" className="text-brand-400 hover:text-brand-300">
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
