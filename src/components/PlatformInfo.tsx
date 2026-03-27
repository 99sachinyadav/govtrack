import React from 'react';
import { motion } from 'motion/react';
import { 
  BarChart3, 
  ShieldCheck, 
  UserCheck, 
  Globe, 
  CheckCircle2, 
  TrendingUp 
} from 'lucide-react';

export const PlatformInfo: React.FC = () => {
  const missionPoints = [
    {
      title: "Financial Accountability",
      desc: "Ensuring every rupee of public funds is tracked from sanction to execution with zero leakage.",
      icon: BarChart3
    },
    {
      title: "AI-Driven Oversight",
      desc: "Utilizing advanced neural networks to identify anomalies, corruption risks, and project delays.",
      icon: ShieldCheck
    },
    {
      title: "Public Verification",
      desc: "Empowering citizens to act as direct auditors of infrastructure and welfare projects.",
      icon: UserCheck
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <div className="relative py-20 px-10 rounded-[40px] overflow-hidden bg-gov-blue text-white">
        {/* Ashoka Chakra Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="grid grid-cols-6 gap-20 p-10">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-40 h-40 border border-white rounded-full flex items-center justify-center">
                <div className="w-1 h-full bg-white absolute rotate-0" />
                <div className="w-1 h-full bg-white absolute rotate-45" />
                <div className="w-1 h-full bg-white absolute rotate-90" />
                <div className="w-1 h-full bg-white absolute rotate-135" />
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-3xl space-y-8">
          <div className="flex items-center gap-3 text-gov-saffron font-bold text-xs uppercase tracking-[0.3em]">
            <Globe className="w-5 h-5" />
            Digital India Initiative
          </div>
          <h1 className="text-6xl font-display font-bold leading-tight tracking-tight">
            Advancing Governance <br />
            Through <span className="text-gov-saffron">Transparency.</span>
          </h1>
          <p className="text-xl text-white/70 leading-relaxed font-light">
            Civic Integrity AI is the national standard for public resource management, 
            designed to bridge the trust gap between the state and its citizens.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {missionPoints.map((point, i) => (
          <motion.div
            key={point.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="gov-card p-10 space-y-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-gov-blue/5 flex items-center justify-center text-gov-blue">
              <point.icon className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-gov-blue">{point.title}</h3>
            <p className="text-gov-blue/60 leading-relaxed text-sm">{point.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Detailed Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          <div className="space-y-6">
            <h2 className="text-4xl font-display font-bold text-gov-blue tracking-tight">
              The Architecture of <br />
              <span className="text-gov-saffron">Public Trust</span>
            </h2>
            <p className="text-gov-blue/60 leading-relaxed">
              Our platform operates on a multi-layered verification protocol. Every project sanctioned 
              undergoes a rigorous AI analysis to ensure budget feasibility and contractor reliability. 
              Once execution begins, real-time data feeds from contractors and geo-tagged verifications 
              from citizens create a tamper-proof record of progress.
            </p>
          </div>

          <div className="space-y-4">
            {[
              "Real-time Tax Utilization Tracking",
              "Automated Corruption Risk Scoring",
              "Direct Citizen Grievance Redressal",
              "Contractor Performance Analytics"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-gov-blue font-bold text-sm">
                <div className="w-6 h-6 rounded-full bg-gov-green/10 flex items-center justify-center text-gov-green">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="aspect-square rounded-[40px] overflow-hidden border border-gov-blue/10 shadow-2xl">
            <img 
              src="https://picsum.photos/seed/integrity/800/800" 
              alt="Governance" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -left-10 gov-card p-8 shadow-2xl max-w-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gov-green/10 flex items-center justify-center text-gov-green">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-gov-blue">Integrity Growth</span>
            </div>
            <p className="text-xs text-gov-blue/60 leading-relaxed">
              Since implementation, project completion rates have increased by 24% while budget anomalies decreased by 18%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
