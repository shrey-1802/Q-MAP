import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, Input, Button, Alert } from '@/components/ui';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-surface-950">
      <div className="w-full max-w-md space-y-6 text-left">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-surface-100">Password Recovery</h1>
          <p className="text-xs text-surface-400">Receive secure authorization link</p>
        </div>

        <Card variant="glass">
          {submitted ? (
            <CardContent className="space-y-4 pt-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-xs text-surface-300 leading-relaxed">
                If an account exists for <span className="font-mono text-brand-300">{email}</span>, a password reset link has been dispatched.
              </p>
              <Link to="/login">
                <Button variant="secondary" size="sm" className="w-full mt-2">
                  Return to Sign In
                </Button>
              </Link>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-6">
                <Input
                  label="Registered Email"
                  type="email"
                  placeholder="operator@mobility.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                />
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button type="submit" variant="primary" size="md" className="w-full">
                  Send Recovery Link
                </Button>
                <Link to="/login" className="inline-flex items-center justify-center gap-1 text-xs text-surface-400 hover:text-surface-200">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};
