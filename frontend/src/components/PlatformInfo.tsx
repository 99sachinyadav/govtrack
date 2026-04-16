import React from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  ShieldCheck,
  UserCheck,
  Globe,
  CheckCircle2,
  TrendingUp,
  Landmark,
  Radar,
  Workflow,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export const PlatformInfo: React.FC = () => {
  const missionPoints = [
    {
      title: 'Financial Accountability',
      desc: 'Track every sanctioned rupee through allocation, execution, citizen verification, and final closure.',
      icon: BarChart3,
      accent: 'text-gov-blue',
      bg: 'bg-gov-blue/5',
    },
    {
      title: 'AI-Led Oversight',
      desc: 'Detect anomalies, delays, unusual spending, and contractor risk patterns before they become failures.',
      icon: Radar,
      accent: 'text-gov-saffron',
      bg: 'bg-gov-saffron/10',
    },
    {
      title: 'Citizen Verification',
      desc: 'Bring public participation into the governance loop through ground reports, grievances, and evidence-based validation.',
      icon: UserCheck,
      accent: 'text-gov-green',
      bg: 'bg-gov-green/10',
    },
  ];

  const impactStats = [
    { label: 'Projects Under Oversight', value: '12,000+', tone: 'text-gov-blue' },
    { label: 'Budget Integrity Monitored', value: 'Rs 1,275 Cr', tone: 'text-gov-saffron' },
    { label: 'Citizen Verification Points', value: '45,000+', tone: 'text-gov-green' },
    { label: 'Audit Readiness Score', value: '94%', tone: 'text-gov-blue' },
  ];

  const systemLayers = [
    {
      // hello
      title: 'Sanction Layer',
      desc: 'Project approvals, department ownership, contractor mapping, and baseline budget registration.',
      icon: Landmark,
    },
    {
      title: 'Monitoring Layer',
      desc: 'Real-time execution updates, proof uploads, public scrutiny, and AI risk scoring.',
      icon: Workflow,
    },
    {
      title: 'Trust Layer',
      desc: 'Open RTI access, grievance escalation, audit trails, and transparent resolution history.',
      icon: ShieldCheck,
    },
  ];

  const governancePillars = [
    'Real-time tax utilization visibility',
    'Automated corruption risk scoring',
    'Direct citizen grievance redressal',
    'Contractor performance analytics',
    'Media and audit escalation workflow',
    'Evidence-backed project verification',
  ];

  return (
    <div className="space-y-16 pb-20">
      <div className="relative overflow-hidden rounded-[36px] border border-gov-blue/10 bg-[radial-gradient(circle_at_top_left,_rgba(255,153,51,0.18),_transparent_28%),linear-gradient(135deg,#13205e_0%,#1a237e_55%,#0f172a_100%)] px-8 py-12 text-white shadow-2xl md:px-12 md:py-16">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 right-[-10%] h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-5%] h-56 w-56 rounded-full bg-gov-saffron/15 blur-3xl" />
          <div className="absolute inset-y-0 right-[18%] w-px bg-white/10" />
        </div>

        <div className="relative z-10 grid gap-12 xl:grid-cols-[1.35fr_0.9fr] xl:items-end">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.35em] text-gov-saffron">
              <Globe className="w-4 h-4" />
              Digital India Integrity Stack
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-4xl font-display font-bold leading-tight tracking-tight md:text-6xl">
                A Better Standard For
                <span className="block text-gov-saffron">Transparent Public Governance</span>
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-white/72 md:text-lg">
                Civic Integrity AI is designed as a professional public-governance operating layer where departments,
                citizens, contractors, media, and auditors work from the same evidence trail.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {impactStats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/6 px-5 py-4 backdrop-blur-sm">
                  <p className={`text-2xl font-display font-bold ${item.tone}`}>{item.value}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white/45">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-5 rounded-[28px] border border-white/10 bg-white/6 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gov-saffron">Mission Signal</p>
                <h3 className="mt-2 text-2xl font-display font-bold">Trust, Traceability, Accountability</h3>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 text-gov-saffron">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Policy Transparency', value: '92%', color: 'bg-gov-saffron' },
                { label: 'Citizen Confidence', value: '88%', color: 'bg-gov-green' },
                { label: 'Audit Readiness', value: '94%', color: 'bg-white' },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-white/75">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: item.value }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950/20 p-4 text-sm text-white/70">
              This platform is built to make governance feel measurable, reviewable, and publicly understandable.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {missionPoints.map((point, i) => (
          <motion.div
            key={point.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="gov-card group relative overflow-hidden border border-gov-blue/10 bg-white p-8"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gov-blue via-gov-saffron to-gov-green opacity-70" />
            <div className={`mb-6 inline-flex rounded-2xl p-4 ${point.bg} ${point.accent}`}>
              <point.icon className="w-7 h-7" />
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-gov-blue">{point.title}</h3>
              <p className="text-sm leading-7 text-gov-blue/60">{point.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid items-start gap-10 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8 rounded-[32px] border border-gov-blue/10 bg-white p-8 shadow-sm md:p-10">
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-gov-saffron">System Architecture</p>
            <h2 className="text-4xl font-display font-bold tracking-tight text-gov-blue">
              The Architecture of
              <span className="block text-gov-saffron">Public Trust</span>
            </h2>
            <p className="max-w-3xl text-sm leading-7 text-gov-blue/60">
              Civic Integrity AI combines data discipline, field verification, and institutional oversight into one
              operational chain. Every stakeholder sees the same source of truth, but through a role-specific workflow.
            </p>
          </div>

          <div className="grid gap-5">
            {systemLayers.map((layer, index) => (
              <div key={layer.title} className="relative rounded-2xl border border-gov-blue/10 bg-gov-bg/60 p-6">
                {index !== systemLayers.length - 1 && (
                  <div className="absolute left-9 top-full h-6 w-px bg-gov-blue/10" />
                )}
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-white p-3 text-gov-blue shadow-sm">
                    <layer.icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gov-blue/35">
                        Layer 0{index + 1}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gov-blue">{layer.title}</h3>
                    <p className="text-sm leading-7 text-gov-blue/60">{layer.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="overflow-hidden rounded-[32px] border border-gov-blue/10 bg-white shadow-sm">
            <div className="border-b border-gov-blue/10 bg-gov-blue px-6 py-5 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gov-saffron">Core Governance Pillars</p>
                  <h3 className="mt-2 text-2xl font-display font-bold">What The Platform Delivers</h3>
                </div>
                <ArrowUpRight className="w-6 h-6 text-white/40" />
              </div>
            </div>
            <div className="space-y-3 p-6">
              {governancePillars.map((item) => (
                <div key={item} className="flex items-center gap-4 rounded-2xl border border-gov-blue/8 bg-gov-bg/50 px-4 py-4 text-sm font-semibold text-gov-blue">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gov-green/10 text-gov-green">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-gov-saffron/20 bg-gradient-to-br from-gov-saffron/10 via-white to-gov-green/10 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-white p-3 text-gov-saffron shadow-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gov-saffron">Outcome Snapshot</p>
                <h3 className="text-2xl font-display font-bold text-gov-blue">Operational Gains Through Transparency</h3>
                <p className="text-sm leading-7 text-gov-blue/65">
                  Institutions become faster when trust becomes visible. Clear evidence trails reduce friction between
                  citizens, administrators, contractors, and external watchdogs.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-2xl font-display font-bold text-gov-green">24%</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gov-blue/40">Completion Gain</p>
                  </div>
                  <div className="rounded-2xl bg-white/80 p-4">
                    <p className="text-2xl font-display font-bold text-red-600">18%</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gov-blue/40">Anomaly Reduction</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
