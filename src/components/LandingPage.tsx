import React, { useState } from 'react';
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
  TrendingUp
} from 'lucide-react';
import { UserRole } from '../types';
import { cn } from '../lib/utils';

interface LandingPageProps {
  onLogin: (role: UserRole, id: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<'register' | 'login'>('login');
  const [role, setRole] = useState<UserRole | null>(null);
  const [id, setId] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role) {
      onLogin(role, id || 'default-id');
    }
  };

  return (
    <div className="min-h-screen bg-white selection:bg-gov-saffron/30 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-white/80 backdrop-blur-md border-b border-gov-blue/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gov-blue flex items-center justify-center text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-display font-bold text-gov-blue uppercase tracking-[0.2em] text-xs">Civic Integrity AI</h4>
            <p className="text-[8px] text-gov-blue/40 font-bold uppercase tracking-widest">National Smart Governance</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-10 text-[10px] font-bold uppercase tracking-widest text-gov-blue/60">
          <a href="#vision" className="hover:text-gov-blue transition-colors">Vision</a>
          <a href="#mission" className="hover:text-gov-blue transition-colors">Mission</a>
          <a href="#impact" className="hover:text-gov-blue transition-colors">Impact</a>
          <button 
            onClick={() => setShowLogin(true)}
            className="px-8 py-3 rounded-xl bg-gov-blue text-white hover:bg-gov-blue/90 transition-all shadow-lg shadow-gov-blue/20"
          >
            Access Portal
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gov-saffron z-50" />
        <div className="absolute top-1.5 left-0 w-full h-1.5 bg-white z-50" />
        <div className="absolute top-3 left-0 w-full h-1.5 bg-gov-green z-50" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-gov-saffron font-bold text-xs uppercase tracking-[0.3em]">
                <ShieldCheck className="w-5 h-5" />
                National Integrity Framework
              </div>
              <h1 className="text-7xl md:text-8xl font-display font-bold text-gov-blue leading-[0.9] tracking-tight">
                Redefining <br />
                <span className="text-gov-saffron italic">Trust.</span>
              </h1>
              <p className="text-xl text-gov-blue/60 leading-relaxed max-w-xl">
                A unified digital ecosystem for transparent governance, real-time resource tracking, and AI-driven corruption risk mitigation.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <button 
                onClick={() => setShowLogin(true)}
                className="px-10 py-5 rounded-2xl bg-gov-blue text-white font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl shadow-gov-blue/30 flex items-center gap-3"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </button>
              <a href="#vision" className="text-xs font-bold uppercase tracking-widest text-gov-blue/40 hover:text-gov-blue transition-colors flex items-center gap-2">
                Learn More
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="gov-card p-4 bg-white/50 backdrop-blur-xl border-gov-blue/5 shadow-2xl overflow-hidden">
              <img 
                src="https://picsum.photos/seed/gov-vision/1200/800" 
                alt="Governance Vision" 
                className="rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gov-blue/40 to-transparent pointer-events-none" />
              <div className="absolute bottom-10 left-10 text-white">
                <p className="text-[10px] font-bold uppercase tracking-widest mb-2 opacity-60">Real-time Monitoring</p>
                <h3 className="text-2xl font-display font-bold">Smart Infrastructure Oversight</h3>
              </div>
            </div>
            {/* Floating Stats */}
            <div className="absolute -bottom-10 -right-10 gov-card p-8 bg-white shadow-2xl border-gov-blue/5 hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gov-green/10 flex items-center justify-center text-gov-green">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-gov-blue">₹4.2T+</p>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-gov-blue/40">Funds Tracked</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section id="vision" className="py-32 bg-gov-blue text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gov-saffron/5 skew-x-12 translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-gov-saffron font-bold text-xs uppercase tracking-[0.3em]">
                <Target className="w-5 h-5" />
                Our Vision
              </div>
              <h2 className="text-5xl md:text-6xl font-display font-bold leading-[1.1]">
                Transparency is not a goal, <br />
                <span className="text-gov-saffron italic">it's a foundation.</span>
              </h2>
              <p className="text-lg text-white/60 leading-relaxed max-w-xl">
                We envision a nation where every rupee of public money is accounted for, every project is delivered with integrity, and every citizen has the power to oversee the development of their community.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-gov-saffron">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold uppercase tracking-widest text-xs">Radical Visibility</h4>
                  <p className="text-[10px] text-white/40 leading-relaxed">Real-time public access to budget allocations and expenditure data.</p>
                </div>
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-gov-green">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold uppercase tracking-widest text-xs">AI-Driven Integrity</h4>
                  <p className="text-[10px] text-white/40 leading-relaxed">Predictive algorithms to detect corruption risks before they manifest.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-full border border-white/10 flex items-center justify-center p-10">
                <div className="aspect-square rounded-full border border-white/20 flex items-center justify-center p-10 w-full">
                  <div className="aspect-square rounded-full bg-white/5 flex flex-col items-center justify-center text-center p-10 w-full">
                    <ShieldCheck className="w-16 h-16 text-gov-saffron mb-4" />
                    <h3 className="text-xl font-bold uppercase tracking-widest">Satyameva <br /> Jayate</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-32 px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6 mb-24">
            <p className="text-xs font-bold uppercase tracking-[0.5em] text-gov-blue/40">The Mission</p>
            <h2 className="text-5xl font-display font-bold text-gov-blue">Empowering the Public Ecosystem</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                title: "For Citizens",
                desc: "Direct oversight of local projects, tax utilization reports, and a secure channel for reporting anomalies.",
                icon: User,
                color: "bg-gov-saffron"
              },
              {
                title: "For Officials",
                desc: "Streamlined budget management, contractor performance tracking, and automated compliance auditing.",
                icon: Building2,
                color: "bg-gov-blue"
              },
              {
                title: "For Contractors",
                desc: "Transparent bidding, real-time progress reporting, and a merit-based trust scoring system.",
                icon: HardHat,
                color: "bg-gov-green"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="gov-card p-10 hover:shadow-2xl transition-all group"
              >
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 group-hover:scale-110 transition-transform", item.color)}>
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gov-blue mb-4">{item.title}</h3>
                <p className="text-gov-blue/60 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-32 px-8 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Corruption Risk Reduction", value: "65%", icon: ShieldCheck },
                { label: "Project Delivery Speed", value: "40%", icon: Zap },
                { label: "Citizen Engagement", value: "12X", icon: User },
                { label: "Budget Efficiency", value: "22%", icon: TrendingUp },
              ].map((stat, i) => (
                <div key={i} className="gov-card p-8 bg-white space-y-4">
                  <stat.icon className="w-6 h-6 text-gov-blue/20" />
                  <div>
                    <p className="text-3xl font-display font-bold text-gov-blue">{stat.value}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gov-blue/40">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <div className="flex items-center gap-3 text-gov-green font-bold text-xs uppercase tracking-[0.3em]">
              <CheckCircle2 className="w-5 h-5" />
              Measurable Impact
            </div>
            <h2 className="text-5xl font-display font-bold text-gov-blue leading-tight">
              Driving Change Through <br />
              <span className="text-gov-green italic">Data-Led Integrity.</span>
            </h2>
            <p className="text-lg text-gov-blue/60 leading-relaxed">
              Our platform doesn't just monitor; it transforms. By creating a closed-loop system of accountability, we ensure that every public project serves its intended purpose.
            </p>
            <button 
              onClick={() => setShowLogin(true)}
              className="px-10 py-5 rounded-2xl bg-gov-blue text-white font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl shadow-gov-blue/30"
            >
              Join the Movement
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
              className="absolute inset-0 bg-gov-blue/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl gov-card p-12 border-gov-blue/10 shadow-2xl bg-white overflow-hidden"
            >
              {/* Ashoka Chakra Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                <svg width="400" height="400" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1" />
                  {[...Array(24)].map((_, i) => (
                    <line key={i} x1="50" y1="50" x2={50 + 45 * Math.cos((i * 15 * Math.PI) / 180)} y2={50 + 45 * Math.sin((i * 15 * Math.PI) / 180)} stroke="currentColor" strokeWidth="0.5" />
                  ))}
                </svg>
              </div>

              <div className="relative z-10">
                <div className="flex justify-end mb-4">
                  <button 
                    onClick={() => {
                      setShowLogin(false);
                      setStep(1);
                    }}
                    className="p-2 rounded-lg hover:bg-gov-blue/5 text-gov-blue/40 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {step === 1 ? (
                  <div className="space-y-10">
                    <div className="text-center space-y-2">
                      <div className="flex items-center justify-center gap-4 mb-6">
                        <button 
                          onClick={() => setMode('login')}
                          className={cn(
                            "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                            mode === 'login' ? "bg-gov-blue text-white shadow-md" : "text-gov-blue/40 hover:text-gov-blue"
                          )}
                        >
                          Secure Login
                        </button>
                        <button 
                          onClick={() => setMode('register')}
                          className={cn(
                            "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all",
                            mode === 'register' ? "bg-gov-blue text-white shadow-md" : "text-gov-blue/40 hover:text-gov-blue"
                          )}
                        >
                          New Registration
                        </button>
                      </div>
                      <h3 className="text-3xl font-display font-bold text-gov-blue">
                        {mode === 'login' ? 'Access Portal' : 'Join the Network'}
                      </h3>
                      <p className="text-sm text-gov-blue/60">Select your official role to proceed.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { id: 'citizen', title: 'Citizen', icon: User, desc: 'Monitor projects and file grievances.', placeholderId: 'CIT-XXXXX' },
                        { id: 'official', title: 'Govt. Official', icon: ShieldCheck, desc: 'Manage budgets and oversee projects.', placeholderId: 'GOV-XXXXX' },
                        { id: 'contractor', title: 'Contractor', icon: HardHat, desc: 'Update progress and manage contracts.', placeholderId: 'CON-XXXXX' },
                        { id: 'media', title: 'Media/Audit', icon: Search, desc: 'Investigate and audit public spending.', placeholderId: 'AUD-XXXXX' },
                      ].map((r) => (
                        <button
                          key={r.id}
                          onClick={() => {
                            setRole(r.id as UserRole);
                            setStep(2);
                          }}
                          className="flex items-center gap-5 p-5 rounded-2xl border border-gov-blue/5 bg-gov-blue/[0.02] hover:bg-gov-blue/5 hover:border-gov-blue/20 transition-all text-left group"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gov-blue/5 flex items-center justify-center text-gov-blue group-hover:bg-gov-blue group-hover:text-white transition-colors">
                            <r.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gov-blue">{r.title}</h4>
                            <p className="text-xs text-gov-blue/40">{r.desc}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 ml-auto text-gov-blue/20 group-hover:text-gov-blue transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <button 
                      onClick={() => setStep(1)}
                      className="text-xs font-bold text-gov-blue/40 uppercase tracking-widest flex items-center gap-2 hover:text-gov-blue transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Roles
                    </button>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-display font-bold text-gov-blue">
                        {mode === 'login' ? `Login as ${role}` : `Register as ${role}`}
                      </h3>
                      <p className="text-sm text-gov-blue/60">
                        {mode === 'login' ? 'Enter your credentials to access your dashboard.' : 'Complete the verification to join the network.'}
                      </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                      {mode === 'register' && (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Full Legal Name</label>
                          <input type="text" className="gov-input" placeholder="As per official ID" required />
                        </div>
                      )}
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">
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
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Official Email Address</label>
                          <input type="email" className="gov-input" placeholder="name@organization.gov.in" required />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Security PIN / Password</label>
                        <input type="password" title="Enter your password" placeholder="••••••••" className="gov-input" required />
                      </div>
                      
                      <div className="pt-4">
                        <button type="submit" className="w-full gov-button-primary py-4 text-sm shadow-lg shadow-gov-blue/20 flex items-center justify-center gap-2">
                          <Lock className="w-4 h-4" />
                          {mode === 'login' ? 'Access Secure Dashboard' : 'Complete Registration'}
                        </button>
                      </div>
                      
                      <p className="text-[10px] text-center text-gov-blue/40 leading-relaxed">
                        {mode === 'login' ? 
                          'Unauthorized access is strictly prohibited under the IT Act 2000.' : 
                          'By registering, you agree to the National Data Privacy Policy and the Civic Integrity Code of Conduct.'}
                      </p>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <footer className="bg-gov-blue text-white py-20 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold uppercase tracking-[0.2em] text-sm">Civic Integrity AI</h4>
            </div>
            <p className="text-white/40 text-xs leading-relaxed max-w-sm">
              An initiative by the Ministry of Digital Governance to ensure transparency, accountability, and integrity in public resource utilization through advanced AI oversight.
            </p>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-gov-saffron">Resources</h5>
            <ul className="space-y-2 text-xs text-white/60">
              <li className="hover:text-white cursor-pointer transition-colors">RTI Portal</li>
              <li className="hover:text-white cursor-pointer transition-colors">Audit Reports</li>
              <li className="hover:text-white cursor-pointer transition-colors">Public Ledger</li>
              <li className="hover:text-white cursor-pointer transition-colors">Grievance Cell</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h5 className="text-[10px] font-bold uppercase tracking-widest text-gov-saffron">Legal</h5>
            <ul className="space-y-2 text-xs text-white/60">
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Terms of Use</li>
              <li className="hover:text-white cursor-pointer transition-colors">IT Act 2000</li>
              <li className="hover:text-white cursor-pointer transition-colors">Data Security</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-bold uppercase tracking-widest text-white/20">
          <span>© 2026 Ministry of Digital Governance • Government of India</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gov-green animate-pulse" />
            System Status: Operational
          </div>
        </div>
      </footer>
    </div>
  );
};
