import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Cpu, Activity, ShieldCheck, Zap, Globe, Lock } from 'lucide-react';

/* ─── Animated floating particle ─── */
const Particle: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={style}
  />
);

/* ─── Animated counter ─── */
const AnimatedStat: React.FC<{ value: string; label: string; delay: number }> = ({ value, label, delay }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className="text-center transition-all duration-700"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
    >
      <div className="text-2xl font-black bg-gradient-to-r from-brand-300 to-teal-300 bg-clip-text text-transparent font-mono">
        {value}
      </div>
      <div className="text-[11px] text-surface-400 mt-0.5 tracking-wide">{label}</div>
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [heroVisible, setHeroVisible] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  /* ─── Staggered entrance animations ─── */
  useEffect(() => {
    const t1 = setTimeout(() => setBadgeVisible(true), 200);
    const t2 = setTimeout(() => setHeroVisible(true), 500);
    const t3 = setTimeout(() => setCtaVisible(true), 900);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  /* ─── Animated canvas grid ─── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.004;

      const cols = Math.ceil(canvas.width / 60);
      const rows = Math.ceil(canvas.height / 60);

      for (let x = 0; x <= cols; x++) {
        for (let y = 0; y <= rows; y++) {
          const px = x * 60;
          const py = y * 60;
          const wave = Math.sin(time + x * 0.4 + y * 0.3) * 0.5 + 0.5;
          const alpha = wave * 0.12 + 0.02;
          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(20, 184, 166, ${alpha})`;
          ctx.fill();
        }
      }

      // Flowing diagonal lines
      for (let i = 0; i < 5; i++) {
        const lineX = ((time * 60 + i * (canvas.width / 5)) % (canvas.width + 200)) - 100;
        const grad = ctx.createLinearGradient(lineX, 0, lineX + 300, canvas.height);
        grad.addColorStop(0, 'rgba(20,184,166,0)');
        grad.addColorStop(0.5, `rgba(20,184,166,${0.04 + i * 0.01})`);
        grad.addColorStop(1, 'rgba(99,102,241,0)');
        ctx.beginPath();
        ctx.moveTo(lineX, 0);
        ctx.lineTo(lineX + 300, canvas.height);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      animFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  /* ─── Particles ─── */
  const particles = Array.from({ length: 18 }, (_, i) => ({
    width: `${Math.random() * 6 + 2}px`,
    height: `${Math.random() * 6 + 2}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: i % 2 === 0
      ? `rgba(20, 184, 166, ${Math.random() * 0.4 + 0.1})`
      : `rgba(99, 102, 241, ${Math.random() * 0.4 + 0.1})`,
    animation: `float${(i % 3) + 1} ${Math.random() * 8 + 6}s ease-in-out infinite`,
    animationDelay: `${Math.random() * 4}s`,
    borderRadius: '50%',
    filter: 'blur(1px)',
  }));

  return (
    <div className="min-h-screen bg-surface-950 text-surface-50 overflow-hidden relative flex flex-col">

      {/* ── Floating particle keyframes ── */}
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); }
          33% { transform: translateY(-30px) translateX(15px) scale(1.1); }
          66% { transform: translateY(15px) translateX(-10px) scale(0.9); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-40px) translateX(20px); }
        }
        @keyframes float3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          40% { transform: translateY(20px) scale(1.2); }
          80% { transform: translateY(-15px) scale(0.8); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(20,184,166,0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 18px rgba(20,184,166,0); }
          100% { transform: scale(0.85); box-shadow: 0 0 0 0 rgba(20,184,166,0); }
        }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(120px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
        }
        @keyframes orbit2 {
          from { transform: rotate(120deg) translateX(160px) rotate(-120deg); }
          to   { transform: rotate(480deg) translateX(160px) rotate(-480deg); }
        }
        @keyframes orbit3 {
          from { transform: rotate(240deg) translateX(100px) rotate(-240deg); }
          to   { transform: rotate(600deg) translateX(100px) rotate(-600deg); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .orbit-dot-1 { animation: orbit 7s linear infinite; }
        .orbit-dot-2 { animation: orbit2 11s linear infinite; }
        .orbit-dot-3 { animation: orbit3 9s linear infinite; }
        .spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>

      {/* ── Animated canvas background ── */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-60" />

      {/* ── Radial glows ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-brand-500/8 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-quantum-500/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-teal-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* ── Floating particles ── */}
      {particles.map((p, i) => <Particle key={i} style={p} />)}

      {/* ══════════ NAVBAR ══════════ */}
      <header className="relative z-20 border-b border-surface-800/50 backdrop-blur-xl bg-surface-950/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #0d9488, #6366f1)', boxShadow: '0 0 20px rgba(20,184,166,0.3)' }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-surface-100 to-surface-400 bg-clip-text text-transparent">
              Q-MAP
            </span>
          </div>

          {/* Sign In button — nav */}
          <button
            id="nav-signin-btn"
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-surface-100 border border-surface-700/80 hover:border-brand-500/60 hover:bg-brand-500/8 transition-all duration-200"
          >
            <Lock className="w-3.5 h-3.5 text-brand-400" />
            Sign In
          </button>
        </div>
      </header>

      {/* ══════════ HERO ══════════ */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">

        {/* ── Orbiting visual ── */}
        <div className="relative w-48 h-48 mx-auto mb-12 flex items-center justify-center">
          {/* Outer dashed ring */}
          <div
            className="absolute w-48 h-48 rounded-full border border-dashed border-brand-500/20 spin-slow"
            style={{ borderSpacing: '8px' }}
          />
          {/* Inner solid ring */}
          <div className="absolute w-32 h-32 rounded-full border border-brand-500/15" />

          {/* Center logo orb */}
          <div
            className="relative w-20 h-20 rounded-2xl flex items-center justify-center z-10"
            style={{
              background: 'linear-gradient(135deg, #0f766e, #4338ca)',
              boxShadow: '0 0 40px rgba(20,184,166,0.35), 0 0 80px rgba(99,102,241,0.15)',
              animation: 'pulse-ring 3s ease-in-out infinite',
            }}
          >
            <Globe className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>

          {/* Orbiting dots */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="orbit-dot-1">
              <div className="w-3 h-3 rounded-full bg-brand-400 shadow-lg" style={{ boxShadow: '0 0 12px rgba(45,212,191,0.8)' }} />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="orbit-dot-2">
              <div className="w-2 h-2 rounded-full bg-quantum-400 shadow-lg" style={{ boxShadow: '0 0 10px rgba(129,140,248,0.8)' }} />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="orbit-dot-3">
              <div className="w-2.5 h-2.5 rounded-full bg-teal-300 shadow-lg" style={{ boxShadow: '0 0 10px rgba(94,234,212,0.8)' }} />
            </div>
          </div>
        </div>

        {/* ── Badge ── */}
        <div
          className="mb-6 transition-all duration-700"
          style={{ opacity: badgeVisible ? 1 : 0, transform: badgeVisible ? 'translateY(0)' : 'translateY(-16px)' }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/8 text-brand-300 text-xs font-semibold tracking-wide">
            <Cpu className="w-3.5 h-3.5" />
            Quantum-Inspired Genetic Algorithm Engine · v2.0
          </span>
        </div>

        {/* ── Headline ── */}
        <div
          className="transition-all duration-1000"
          style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(32px)' }}
        >
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] max-w-4xl mx-auto">
            Intelligent Route
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(90deg, #2dd4bf, #818cf8, #2dd4bf)',
                backgroundSize: '200% auto',
                animation: 'shimmer 4s linear infinite',
              }}
            >
              Optimization
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-surface-400 max-w-xl mx-auto leading-relaxed">
            Solve NP-hard multi-objective vehicle routing with QIGA.
            Minimize travel time, fuel usage, and carbon emissions simultaneously.
          </p>
        </div>

        {/* ── Single CTA — Sign In ── */}
        <div
          className="mt-10 transition-all duration-700"
          style={{ opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)' }}
        >
          <button
            id="hero-signin-btn"
            onClick={() => navigate('/login')}
            className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-base font-bold text-surface-950 overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 50%, #6366f1 100%)',
              boxShadow: '0 0 40px rgba(20,184,166,0.35), 0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            {/* Shimmer overlay on hover */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)' }}
            />
            <Lock className="w-5 h-5 relative z-10" />
            <span className="relative z-10">Sign In to Platform</span>
            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          <p className="mt-4 text-xs text-surface-500">
            Secure operator authentication · Session encrypted
          </p>
        </div>

        {/* ── Stats row ── */}
        <div className="mt-16 flex items-center gap-12 flex-wrap justify-center">
          <AnimatedStat value="98.2%" label="Pareto Fitness Score" delay={1200} />
          <div className="w-px h-8 bg-surface-800 hidden sm:block" />
          <AnimatedStat value="< 2s" label="Optimization Runtime" delay={1400} />
          <div className="w-px h-8 bg-surface-800 hidden sm:block" />
          <AnimatedStat value="99.9%" label="Road-Snapped Accuracy" delay={1600} />
        </div>

        {/* ── Feature pills ── */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {[
            { icon: <Zap className="w-3.5 h-3.5" />, label: 'Real-time Re-routing' },
            { icon: <Activity className="w-3.5 h-3.5" />, label: 'Multi-Objective Pareto' },
            { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: 'Road-Snapped Navigation' },
            { icon: <Cpu className="w-3.5 h-3.5" />, label: 'Quantum Qubit Chromosomes' },
          ].map((feat, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-900/80 border border-surface-800/60 text-surface-400 text-xs font-medium backdrop-blur-sm"
              style={{
                opacity: ctaVisible ? 1 : 0,
                transform: ctaVisible ? 'translateY(0)' : 'translateY(12px)',
                transition: `all 0.5s ease ${1000 + i * 100}ms`,
              }}
            >
              <span className="text-brand-400">{feat.icon}</span>
              {feat.label}
            </span>
          ))}
        </div>
      </main>

      {/* ══════════ FOOTER ══════════ */}
      <footer className="relative z-10 border-t border-surface-800/40 py-5 text-center text-xs text-surface-600">
        © 2026 Q-MAP Intelligent Mobility Infrastructure · Production Build v2.0
      </footer>
    </div>
  );
};
