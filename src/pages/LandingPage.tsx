import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Badge } from '@/components/ui';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Cpu, Compass, Activity, CheckCircle2 } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-950 text-surface-50 flex flex-col relative overflow-hidden text-left">
      {/* Background Quantum Grid & Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[500px] h-[300px] bg-quantum-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <header className="border-b border-surface-800/80 backdrop-blur-md sticky top-0 z-50 bg-surface-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-quantum-500 flex items-center justify-center font-bold text-surface-950 shadow-glow-teal">
              <Sparkles className="w-5 h-5 text-surface-950" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-surface-100 to-surface-400 bg-clip-text text-transparent">
              Q-MAP Intelligence
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/home">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5 text-surface-950" />}>
                Launch Router
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <Badge variant="quantum" size="md" className="py-1 px-3">
            <Cpu className="w-3.5 h-3.5" /> Next-Gen Mobility Optimization Engine
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Quantum-Inspired Route Optimization for{' '}
            <span className="bg-gradient-to-r from-brand-400 via-teal-300 to-quantum-400 bg-clip-text text-transparent">
              Complex Urban Fleets
            </span>
          </h1>

          <p className="text-base sm:text-lg text-surface-300 leading-relaxed max-w-2xl mx-auto">
            Solve NP-hard multi-objective vehicle routing with Quantum-Inspired Genetic Algorithms (QIGA).
            Simultaneously minimize travel time, congestion bottlenecks, fuel usage, and carbon emissions.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link to="/home">
              <Button
                variant="primary"
                size="lg"
                leftIcon={<Sparkles className="w-5 h-5 text-surface-950" />}
                rightIcon={<ArrowRight className="w-4 h-4 text-surface-950" />}
              >
                Start Multi-Stop Planner
              </Button>
            </Link>
            <Link to="/analysis">
              <Button variant="secondary" size="lg">
                View Algorithmic Benchmarks
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <Card variant="glass" className="p-6 space-y-3 border-brand-500/20">
            <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-surface-100">Quantum Qubit Chromosomes</h3>
            <p className="text-xs text-surface-400 leading-relaxed">
              QIGA leverages quantum rotation gates and superposition probabilities to rapidly escape local minima where classical algorithms stall.
            </p>
          </Card>

          <Card variant="glass" className="p-6 space-y-3 border-quantum-500/20">
            <div className="w-10 h-10 rounded-xl bg-quantum-500/15 border border-quantum-500/30 flex items-center justify-center text-quantum-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-surface-100">Dynamic Multi-Objective Pareto</h3>
            <p className="text-xs text-surface-400 leading-relaxed">
              Dynamically balance arrival speed, heavy-load road constraints, toll minimization, and zero-emission corridors simultaneously.
            </p>
          </Card>

          <Card variant="glass" className="p-6 space-y-3 border-emerald-500/20">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-surface-100">Zero-Crash Production Safety</h3>
            <p className="text-xs text-surface-400 leading-relaxed">
              Provider-neutral GIS architecture with authoritative server-side execution, live re-routing incident handlers, and offline tolerance.
            </p>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-800/60 py-6 text-center text-xs text-surface-500 bg-surface-950/60">
        <p>© 2026 Q-MAP Intelligent Mobility Infrastructure. Production Build v2.0.</p>
      </footer>
    </div>
  );
};
