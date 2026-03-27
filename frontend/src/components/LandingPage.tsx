
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  User,
  HardHat,
  Search,
  ArrowUpRight,
  Target,
  Eye,
  Zap,
  CheckCircle2,
  X,
  Building2,
  Lock,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { UserRole } from '../types';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

interface LandingPageProps {
  onLogin: (role: UserRole, id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const { register, login, isLoading, error, clearError } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<'register' | 'login'>('login');
  const [role, setRole] = useState<UserRole | null>(null);
  const [id, setId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [localError, setLocalError] = useState('');

  // Cleanup when modal closes
  useEffect(() => {
    if (!showLogin) {
      setLocalError('');
      clearError();
      setStep(1);
      setMode('login');
      setRole(null);
      setId('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
    }
  }, [showLogin, clearError]);

  const roles: { id: UserRole; title: string; icon: any; desc: string; placeholderId: string }[] = [
    { id: 'citizen', title: 'Citizen', icon: User, desc: 'Monitor projects and file grievances.', placeholderId: 'CIT-XXXXX' },
    { id: 'official', title: 'Govt. Official', icon: ShieldCheck, desc: 'Manage budgets and oversee projects.', placeholderId: 'GOV-XXXXX' },
    { id: 'contractor', title: 'Contractor', icon: HardHat, desc: 'Update progress and manage contracts.', placeholderId: 'CON-XXXXX' },
    { id: 'media', title: 'Media/Audit', icon: Search, desc: 'Investigate and audit public spending.', placeholderId: 'AUD-XXXXX' },
  ];

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!role) {
      setLocalError('Please select a role');
      return;
    }

    if (!id.trim()) {
      setLocalError('ID is required');
      return;
    }

    if (!password.trim()) {
      setLocalError('Password is required');
      return;
    }

    if (mode === 'register' && password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      if (mode === 'register') {
        if (!email.trim()) {
          setLocalError('Email is required');
          return;
        }
        if (!name.trim()) {
          setLocalError('Name is required');
          return;
        }

        await register({
          name,
          email,
          role,
          id,
          password,
          confirmPassword,
        });
      } else {
        await login(id, password, role);
      }

      // Reset form on success
      setShowLogin(false);
      setStep(1);
      setMode('login');
      setRole(null);
      setId('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');

      // Call onLogin callback with mock values since auth is handled by context
      onLogin(role, id);
    } catch (err: any) {
      setLocalError(err.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-gov-saffron/30 font-sans text-slate-900">
      {/* Government Utility Bar */}
      <div className="w-full bg-gov-blue text-white text-[11px] tracking-widest uppercase">
        <div className="max-w-7xl mx-auto px-8 py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-semibold">Government of India</span>
            <span className="text-white/60">-</span>
            <span className="text-white/70">Ministry of Digital Governance</span>
          </div>
          <div className="flex items-center gap-6 text-white/70">
            <span>Helpdesk: 1800-000-000</span>
            <span>EN | HI</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sticky top-0 z-[100] bg-white/95 backdrop-blur-lg border-b border-slate-200/60 px-8 py-5 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gov-blue flex items-center justify-center text-white shadow-md shadow-gov-blue/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-display font-bold text-gov-blue text-base leading-tight">Civic Integrity AI</h4>
              <p className="text-[11px] text-gov-blue/60 font-semibold tracking-widest uppercase">National Transparency Platform</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[11px] font-semibold uppercase tracking-widest text-gov-blue/60">
            <a href="#vision" className="hover:text-gov-blue transition-colors duration-300">Vision</a>
            <a href="#services" className="hover:text-gov-blue transition-colors duration-300">Services</a>
            <a href="#process" className="hover:text-gov-blue transition-colors duration-300">Process</a>
            <a href="#impact" className="hover:text-gov-blue transition-colors duration-300">Impact</a>
            <button
              onClick={() => setShowLogin(true)}
              className="px-8 py-2.5 rounded-md bg-gov-blue text-white font-semibold tracking-wide hover:bg-blue-900 transition-all duration-300 shadow-lg shadow-gov-blue/20 active:scale-95"
            >
              Access Portal
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-20 pb-24 px-8 overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="absolute top-0 left-0 w-full h-1 bg-gov-saffron" />
        <div className="absolute top-1 left-0 w-full h-1 bg-white" />
        <div className="absolute top-2 left-0 w-full h-1 bg-gov-green" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 text-gov-saffron font-semibold text-xs uppercase tracking-widest">
              <ShieldCheck className="w-5 h-5" />
              National Integrity Framework
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-gov-blue leading-tight">
              Official Platform for
              <span className="block text-gov-saffron">Transparency and Integrity</span>
            </h1>
            <p className="text-lg text-gov-blue/70 leading-[1.8] max-w-xl font-medium">
              A secure, auditable system for public project oversight, budget visibility, and AI-led risk detection across all departments.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <button
                onClick={() => setShowLogin(true)}
                className="px-8 py-3.5 rounded-md bg-gov-blue text-white font-semibold uppercase tracking-wide text-sm hover:bg-blue-900 transition-all duration-300 shadow-lg shadow-gov-blue/25 active:scale-95 flex items-center gap-2"
              >
                Access Secure Portal
                <ChevronRight className="w-4 h-4" />
              </button>
              <a href="#services" className="text-sm font-semibold text-gov-blue/60 hover:text-gov-blue transition-colors duration-300 flex items-center gap-2">
                View Services
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="gov-card p-8 bg-white border-slate-200 shadow-xl">
              <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
                <div className="w-12 h-12 rounded-full bg-gov-blue/10 text-gov-blue flex items-center justify-center">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gov-blue/50">National Oversight Brief</p>
                  <h3 className="text-xl font-display font-bold text-gov-blue">Quarterly Integrity Snapshot</h3>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-6">
                {[
                  { label: 'Funds Tracked', value: 'INR 4.2T+' },
                  { label: 'Active Projects', value: '18,240' },
                  { label: 'Compliance Rate', value: '96.4%' },
                  { label: 'Risk Alerts', value: '412' },
                ].map((item) => (
                  <div key={item.label} className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-gov-blue/50">{item.label}</p>
                    <p className="text-2xl font-display font-bold text-gov-blue">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 rounded-lg bg-slate-50 border border-slate-200 text-sm text-gov-blue/70">
                Official dashboards for citizens, officials, contractors, and auditors with role-based access controls.
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      {/* Vision */}
      <section id="vision" className="py-24 bg-white px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-gov-blue font-semibold text-xs uppercase tracking-widest">
              <Target className="w-5 h-5 text-gov-saffron" />
              Our Vision
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gov-blue leading-tight">
              A public system where trust is measurable, transparent, and enforceable.
            </h2>
            <p className="text-lg text-gov-blue/70 leading-[1.8] max-w-xl font-medium">
              Every program and project is tracked end-to-end with accountable decision trails and open performance reporting.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Open Budgeting',
                  desc: 'Public access to allocations, releases, and utilization statements.',
                  icon: Eye,
                },
                {
                  title: 'AI Risk Signals',
                  desc: 'Proactive detection of anomalies and non-compliance trends.',
                  icon: Zap,
                },
              ].map((item) => (
                <div key={item.title} className="gov-card p-6 border-slate-200">
                  <div className="w-10 h-10 rounded-lg bg-gov-blue/10 flex items-center justify-center text-gov-blue mb-4">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-semibold text-gov-blue text-lg">{item.title}</h4>
                  <p className="text-sm text-gov-blue/60 leading-relaxed mt-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="gov-card p-10 bg-gov-blue text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative space-y-6">
              <div className="flex items-center gap-3 text-gov-saffron font-semibold text-xs uppercase tracking-widest">
                <ShieldCheck className="w-5 h-5" />
                Trust Framework
              </div>
              <h3 className="text-3xl font-display font-bold text-white">Satyameva Jayate</h3>
              <p className="text-white/75 leading-[1.7] text-sm">
                The platform aligns with national standards for digital governance and ensures auditable trails across all stages of public expenditure.
              </p>
              <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-white/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gov-green" />
                  Section 4(1)(b) Compliance
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gov-saffron" />
                  ISO 27001 Ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-24 px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-gov-blue/50">Key Services</p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gov-blue">A unified experience for every stakeholder</h2>
            <p className="text-base text-gov-blue/60 max-w-2xl mx-auto font-medium">
              Role-based dashboards with secure workflows and verified reporting across departments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Citizen Services',
                desc: 'Track local projects, submit grievances, and follow resolution timelines.',
                icon: User,
                color: 'bg-gov-saffron',
              },
              {
                title: 'Official Command Center',
                desc: 'Manage budgets, approvals, and performance metrics with audit trails.',
                icon: Building2,
                color: 'bg-gov-blue',
              },
              {
                title: 'Contractor Portal',
                desc: 'Upload progress updates, verify milestones, and handle compliance.',
                icon: HardHat,
                color: 'bg-gov-green',
              },
              {
                title: 'Media and Audit',
                desc: 'Investigate anomalies and access verified public datasets.',
                icon: Search,
                color: 'bg-slate-600',
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="gov-card p-7 bg-white border-slate-200"
              >
                <div className={cn('w-12 h-12 rounded-md flex items-center justify-center text-white mb-6 shadow-sm', item.color)}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-display font-bold text-gov-blue mb-3">{item.title}</h3>
                <p className="text-sm text-gov-blue/60 leading-[1.7]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Process */}
      <section id="process" className="py-24 px-8 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-gov-green font-semibold text-xs uppercase tracking-widest">
              <CheckCircle2 className="w-5 h-5" />
              Process
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gov-blue">
              From approval to outcomes, every step is verified.
            </h2>
            <p className="text-lg text-gov-blue/70 leading-[1.8] font-medium">
              Structured workflows ensure accountability from project initiation through completion.
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="px-8 py-3 rounded-md bg-gov-blue text-white font-semibold uppercase tracking-wide text-sm hover:bg-blue-900 transition-all duration-300 shadow-lg shadow-gov-blue/25 active:scale-95 inline-flex items-center gap-2"
            >
              Launch Dashboard
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-6">
            {[
              { title: 'Sanction and Allocation', desc: 'Budget approvals are logged with responsible officers and timelines.' },
              { title: 'Procurement and Vendor Checks', desc: 'Contractor credentials are verified and tender compliance is validated.' },
              { title: 'Execution Monitoring', desc: 'Progress, expenditures, and site evidence are updated in real time.' },
              { title: 'Audit and Public Disclosure', desc: 'Final outputs are published with immutable audit trails.' },
            ].map((stepItem, index) => (
              <div key={stepItem.title} className="gov-card p-6 border-slate-200 bg-slate-50">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gov-blue text-white flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gov-blue">{stepItem.title}</h4>
                    <p className="text-sm text-gov-blue/60 leading-relaxed mt-1">{stepItem.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="py-24 px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="grid grid-cols-2 gap-6">
            {[
              { label: 'Risk Reduction', value: '65%', icon: ShieldCheck },
              { label: 'Project Delivery', value: '40%', icon: Zap },
              { label: 'Citizen Engagement', value: '12X', icon: User },
              { label: 'Budget Efficiency', value: '22%', icon: TrendingUp },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="gov-card p-6 bg-white border-slate-200"
              >
                <stat.icon className="w-5 h-5 text-gov-blue/40" />
                <p className="text-2xl font-display font-bold text-gov-blue mt-4">{stat.value}</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-gov-blue/50 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
          <div className="space-y-8">
            <div className="flex items-center gap-3 text-gov-green font-semibold text-xs uppercase tracking-widest">
              <CheckCircle2 className="w-5 h-5" />
              Measurable Outcomes
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gov-blue leading-tight">
              Data-led governance, visible to every citizen.
            </h2>
            <p className="text-lg text-gov-blue/70 leading-[1.8] font-medium">
              The platform builds continuous accountability by connecting budgets, progress reporting, and public disclosures.
            </p>
            <button
              onClick={() => setShowLogin(true)}
              className="px-8 py-3 rounded-md bg-gov-blue text-white font-semibold uppercase tracking-wide text-sm hover:bg-blue-900 transition-all duration-300 shadow-lg shadow-gov-blue/25 active:scale-95 inline-flex items-center gap-2"
            >
              Request Access
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
      {/* Login Portal Modal */}
      <AnimatePresence>
        {showLogin && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowLogin(false);
                setStep(1);
              }}
              className="absolute inset-0 bg-gov-blue/50 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl gov-card border-slate-200 p-0 shadow-2xl bg-white overflow-hidden"
            >
              {/* Ashoka Chakra Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none">
                <svg width="400" height="400" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
                  {[...Array(24)].map((_, i) => (
                    <line key={i} x1="50" y1="50" x2={50 + 45 * Math.cos((i * 15 * Math.PI) / 180)} y2={50 + 45 * Math.sin((i * 15 * Math.PI) / 180)} stroke="currentColor" strokeWidth="0.5" />
                  ))}
                </svg>
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-center p-8 border-b border-slate-200">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-gov-blue">
                      {step === 1 ? 'Access Portal' : `${role ? role.charAt(0).toUpperCase() + role.slice(1) : 'Portal'}`}
                    </h2>
                    <p className="text-sm text-gov-blue/60 mt-1 font-medium">
                      {step === 1 ? 'Select your role to continue' : (mode === 'login' ? 'Enter your credentials' : 'Complete your registration')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowLogin(false);
                      setStep(1);
                    }}
                    className="p-2 rounded-lg hover:bg-slate-100 text-gov-blue/50 hover:text-gov-blue transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-8">
                  {step === 1 ? (
                    <div className="space-y-8">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setMode('login')}
                          className={cn(
                            'flex-1 px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-widest transition-all',
                            mode === 'login' ? 'bg-gov-blue text-white shadow-lg shadow-gov-blue/30' : 'bg-slate-100 text-gov-blue/60 hover:bg-slate-200'
                          )}
                        >
                          Secure Login
                        </button>
                        <button
                          onClick={() => setMode('register')}
                          className={cn(
                            'flex-1 px-6 py-3 rounded-lg text-sm font-semibold uppercase tracking-widest transition-all',
                            mode === 'register' ? 'bg-gov-blue text-white shadow-lg shadow-gov-blue/30' : 'bg-slate-100 text-gov-blue/60 hover:bg-slate-200'
                          )}
                        >
                          New Registration
                        </button>
                      </div>

                      <div className="space-y-4">
                        {roles.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => handleRoleSelect(r.id)}
                            className="w-full flex items-center gap-5 p-5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 transition-all text-left group"
                          >
                            <div className="w-12 h-12 rounded-lg bg-gov-blue/10 flex items-center justify-center text-gov-blue group-hover:bg-gov-blue group-hover:text-white transition-colors shadow-sm">
                              <r.icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-gov-blue text-sm">{r.title}</h4>
                              <p className="text-xs text-gov-blue/50 mt-0.5">{r.desc}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gov-blue/20 group-hover:text-gov-blue transition-colors" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      <button
                        onClick={() => setStep(1)}
                        className="text-sm font-semibold text-gov-blue/50 uppercase tracking-widest flex items-center gap-2 hover:text-gov-blue transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Roles
                      </button>

                      <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Error Display */}
                        {(localError || error) && (
                          <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-red-900">{localError || error}</p>
                            </div>
                          </div>
                        )}

                        {mode === 'register' && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gov-blue/60">Full Legal Name</label>
                            <input
                              type="text"
                              className="gov-input"
                              placeholder="As per official ID"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wider text-gov-blue/60">
                            {role === 'citizen' ? 'Aadhaar / Voter ID' :
                             role === 'official' ? 'Employee ID' :
                             role === 'contractor' ? 'Contractor License ID' : 'Audit License ID'}
                          </label>
                          <input
                            type="text"
                            className="gov-input"
                            placeholder={role === 'citizen' ? 'CIT-XXXXX' : role === 'official' ? 'GOV-XXXXX' : role === 'contractor' ? 'CON-XXXXX' : 'AUD-XXXXX'}
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            required
                          />
                        </div>

                        {mode === 'register' && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gov-blue/60">Official Email Address</label>
                            <input
                              type="email"
                              className="gov-input"
                              placeholder="name@organization.gov.in"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        )}

                        {/* Login uses ID + Password only */}
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-wider text-gov-blue/60">Security PIN / Password</label>
                          <input
                            type="password"
                            title="Enter your password"
                            placeholder="********"
                            className="gov-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>

                        {mode === 'register' && (
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gov-blue/60">Confirm Password</label>
                            <input
                              type="password"
                              title="Confirm your password"
                              placeholder="********"
                              className="gov-input"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                            />
                          </div>
                        )}

                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full gov-button-primary py-4 text-sm font-semibold shadow-lg shadow-gov-blue/25 flex items-center justify-center gap-2 hover:bg-blue-900 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                          >
                            {isLoading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4" />
                                {mode === 'login' ? 'Access Secure Dashboard' : 'Complete Registration'}
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-xs text-center text-gov-blue/50 leading-relaxed">
                          {mode === 'login' ?
                            'Unauthorized access is strictly prohibited under the IT Act 2000.' :
                            'By registering, you agree to the National Data Privacy Policy and the Civic Integrity Code of Conduct.'}
                        </p>

                        {mode === 'login' && (
                          <button
                            type="button"
                            onClick={() => { setMode('register'); setLocalError(''); setEmail(''); setPassword(''); setConfirmPassword(''); }}
                            className="w-full py-3 text-sm font-semibold text-gov-blue hover:bg-gov-blue/5 transition-colors rounded-lg"
                          >
                            Do not have an account? Register here
                          </button>
                        )}

                        {mode === 'register' && (
                          <button
                            type="button"
                            onClick={() => { setMode('login'); setLocalError(''); setEmail(''); setPassword(''); setConfirmPassword(''); setName(''); }}
                            className="w-full py-3 text-sm font-semibold text-gov-blue hover:bg-gov-blue/5 transition-colors rounded-lg"
                          >
                            Already have an account? Login here
                          </button>
                        )}
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <footer className="bg-gov-blue text-white py-16 px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-display font-bold text-lg">Civic Integrity AI</h4>
            </div>
            <p className="text-white/60 text-sm leading-[1.7] max-w-sm font-medium">
              A national initiative to ensure transparency, accountability, and integrity in public resource utilization through secure AI oversight.
            </p>
            <div className="text-xs text-white/40 pt-2">
              Copyright 2026 National Digital Governance Platform. All rights reserved.
            </div>
          </div>
          <div className="space-y-5">
            <h5 className="text-xs font-bold uppercase tracking-widest text-gov-saffron">Resources</h5>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="hover:text-white cursor-pointer transition-colors duration-300 font-medium">RTI Portal</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-300 font-medium">Audit Reports</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-300 font-medium">Public Ledger</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-300 font-medium">Grievance Cell</li>
            </ul>
          </div>
          <div className="space-y-5">
            <h5 className="text-xs font-bold uppercase tracking-widest text-gov-saffron">Legal</h5>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="hover:text-white cursor-pointer transition-colors duration-300 font-medium">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-300 font-medium">Terms of Use</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-300 font-medium">IT Act 2000</li>
              <li className="hover:text-white cursor-pointer transition-colors duration-300 font-medium">Data Security</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-widest text-white/30">
          <span>2026 Ministry of Digital Governance - Government of India</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gov-green animate-pulse" />
            System Status: Operational
          </div>
        </div>
      </footer>
    </div>
  );
};
