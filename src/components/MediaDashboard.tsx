import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Newspaper, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  TrendingUp, 
  AlertCircle, 
  FileText, 
  Globe,
  ArrowUpRight,
  ShieldAlert,
  BarChart3,
  MessageSquare
} from 'lucide-react';
import { Project } from '../types';
import { cn } from '../lib/utils';

interface MediaDashboardProps {
  projects: Project[];
}

export const MediaDashboard: React.FC<MediaDashboardProps> = ({ projects }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const highRiskProjects = projects.filter(p => p.corruptionRisk === 'high');

  const stats = [
    { label: 'High Risk Projects', value: highRiskProjects.length.toString(), icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'RTI Requests', value: '42', icon: FileText, color: 'text-gov-blue', bg: 'bg-gov-blue/5' },
    { label: 'Data Points', value: '1.2M', icon: BarChart3, color: 'text-gov-saffron', bg: 'bg-gov-saffron/5' },
    { label: 'Public Interest', value: 'High', icon: TrendingUp, color: 'text-gov-green', bg: 'bg-gov-green/5' },
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-gov-blue/10 pb-8">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-gov-saffron text-[10px] font-bold uppercase tracking-[0.3em] mb-3"
          >
            <Newspaper className="w-4 h-4" />
            Investigative & Audit Suite
          </motion.div>
          <h1 className="text-4xl font-display font-bold text-gov-blue tracking-tight">
            Media & Audit Portal
          </h1>
          <p className="text-gov-blue/60 mt-1">Public interest monitoring and investigative data access.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="gov-button-secondary flex items-center gap-3 py-3">
            <Download className="w-4 h-4" />
            Export Raw Audit Data
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="gov-card p-8 group hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={cn("p-3 rounded-xl group-hover:scale-110 transition-transform duration-500", stat.bg, stat.color)}>
                <stat.icon className="w-6 h-6" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-gov-blue/10 group-hover:text-gov-saffron transition-colors" />
            </div>
            <p className="text-4xl font-display font-bold text-gov-blue mb-1">{stat.value}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-gov-blue/40 font-bold">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gov-blue">Investigative Leads</h3>
            <div className="relative w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gov-blue/30" />
              <input 
                type="text" 
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="gov-input pl-10 py-2"
              />
            </div>
          </div>

          <div className="space-y-4">
            {highRiskProjects.map((project, i) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="gov-card p-8 group border-red-500/10 hover:border-red-500/30"
              >
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-red-100">
                        <AlertCircle className="w-3 h-3" />
                        Critical Risk Alert
                      </span>
                      <span className="text-gov-blue/10">|</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">{project.sector}</span>
                    </div>
                    
                    <div>
                      <h4 className="text-2xl font-bold text-gov-blue mb-2 group-hover:text-red-600 transition-colors">{project.title}</h4>
                      <p className="text-gov-blue/60 text-sm leading-relaxed">{project.description}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-5 border-y border-gov-blue/5">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/30">Budget</p>
                        <p className="text-sm font-bold text-gov-blue">₹{(project.budget / 10000000).toFixed(1)} Cr</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/30">Spent</p>
                        <p className="text-sm font-bold text-red-600">₹{(project.spent / 10000000).toFixed(1)} Cr</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/30">Progress</p>
                        <p className="text-sm font-bold text-gov-blue">{project.progress}%</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/30">Contractor</p>
                        <p className="text-sm font-bold text-gov-saffron">{project.contractorName || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-red-50/50 border border-red-100 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-red-600">AI Risk Factors Identified</p>
                      <ul className="space-y-2">
                        {project.riskFactors?.map((factor, idx) => (
                          <li key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="w-full md:w-48 flex flex-col gap-3">
                    <button className="w-full py-4 rounded-xl bg-gov-blue text-white font-bold text-[10px] uppercase tracking-widest hover:bg-gov-blue/90 transition-all shadow-sm">
                      File RTI Request
                    </button>
                    <button className="w-full py-4 rounded-xl bg-white border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-gov-blue hover:bg-slate-50 transition-all">
                      View Audit Trail
                    </button>
                    <button className="w-full py-4 rounded-xl bg-white border border-slate-200 text-[10px] font-bold uppercase tracking-widest text-gov-blue hover:bg-slate-50 transition-all">
                      Share Report
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          <div className="gov-card p-10 space-y-8">
            <h3 className="text-2xl font-bold text-gov-blue">RTI Portal Status</h3>
            <div className="space-y-6">
              {[
                { title: 'Highway Expansion Audit', status: 'In Review', date: '2024-03-15' },
                { title: 'Smart City Fund Allocation', status: 'Approved', date: '2024-03-10' },
                { title: 'Bridge Safety Report', status: 'Pending', date: '2024-03-05' },
              ].map((rti, i) => (
                <div key={i} className="p-6 rounded-xl bg-gov-blue/5 border border-gov-blue/5 space-y-3 group hover:bg-gov-blue/10 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn(
                      "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border",
                      rti.status === 'Approved' ? "bg-gov-green/10 text-gov-green border-gov-green/20" : "bg-gov-saffron/10 text-gov-saffron border-gov-saffron/20"
                    )}>
                      {rti.status}
                    </span>
                    <span className="text-[10px] text-gov-blue/30 font-bold uppercase tracking-widest">{rti.date}</span>
                  </div>
                  <h5 className="font-bold text-sm text-gov-blue group-hover:text-gov-saffron transition-colors">{rti.title}</h5>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40 hover:text-gov-blue transition-colors flex items-center gap-2">
                    View Document <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full py-5 rounded-xl border border-gov-blue/10 text-xs font-bold uppercase tracking-widest text-gov-blue hover:bg-gov-blue/5 transition-colors">
              New RTI Request
            </button>
          </div>

          <div className="gov-card p-10 space-y-8 bg-gov-blue/5 border-gov-blue/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gov-blue/10 flex items-center justify-center text-gov-blue">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gov-blue">Public Sentiment</h3>
            </div>
            <p className="text-sm text-gov-blue/60 leading-relaxed">
              Analyzing <span className="text-gov-blue font-bold">45,000+</span> social media mentions and citizen reports. 
              Public trust in infrastructure projects has <span className="text-gov-green font-bold">increased by 12%</span> this month.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-gov-blue/40">Sentiment Score</span>
                <span className="text-gov-blue">72/100</span>
              </div>
              <div className="h-2 bg-gov-blue/10 rounded-full overflow-hidden">
                <div className="h-full bg-gov-blue w-[72%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
