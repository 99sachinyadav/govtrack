import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Newspaper, 
  Search, 
  Download, 
  TrendingUp, 
  AlertCircle, 
  FileText, 
  Globe,
  ArrowUpRight,
  BarChart3,
  MessageSquare,
  Send,
  CheckCircle2,
  Siren,
  MapPin,
  Clock
} from 'lucide-react';
import { Complaint, Project, RTIRequest } from '../types';
import { cn } from '../lib/utils';

interface MediaDashboardProps {
  projects: Project[];
  rtiStats?: any;
  rtiRequests?: RTIRequest[];
  complaints: Complaint[];
  onUpdateComplaint: (complaintId: string, updates: Partial<Complaint>) => Promise<void> | void;
}

export const MediaDashboard: React.FC<MediaDashboardProps> = ({ projects, rtiStats, rtiRequests = [], complaints, onUpdateComplaint }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [mediaNote, setMediaNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const highRiskProjects = projects.filter(p => p.corruptionRisk === 'high');
  const highPriorityProjectIds = new Set(
    complaints
      .filter((complaint) => complaint.priority === 'high' || complaint.priority === 'critical')
      .map((complaint) => complaint.projectId)
      .filter(Boolean)
  );
  const highPriorityProjectsCount = projects.filter(
    (project) => project.corruptionRisk === 'high' || highPriorityProjectIds.has(project.id)
  ).length;
  const totalRti = rtiStats?.totalRequests ?? rtiRequests.length;
  const totalCitizenGrievances = complaints.length;
  const openComplaints = complaints
    .filter((complaint) => complaint.status !== 'resolved' && complaint.status !== 'rejected')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const visibleComplaints = openComplaints.filter((complaint) => {
    const query = searchQuery.toLowerCase();
    return (
      complaint.projectName?.toLowerCase().includes(query) ||
      complaint.description.toLowerCase().includes(query) ||
      complaint.userName.toLowerCase().includes(query) ||
      complaint.category.toLowerCase().includes(query) ||
      complaint.location?.toLowerCase().includes(query)
    );
  });
  const dataPoints = (projects.length * 1000).toLocaleString();
  const stats = [
    { label: 'High Risk Projects', value: highPriorityProjectsCount.toString(), icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Citizen Grievances', value: totalCitizenGrievances.toString(), icon: FileText, color: 'text-gov-blue', bg: 'bg-gov-blue/5' },
    { label: 'Data Points', value: `${dataPoints}`, icon: BarChart3, color: 'text-gov-saffron', bg: 'bg-gov-saffron/5' },
    { label: 'Public Interest', value: totalRti > 100 ? 'High' : 'Moderate', icon: TrendingUp, color: 'text-gov-green', bg: 'bg-gov-green/5' },
  ];

  const handleEscalateComplaint = async () => {
    if (!selectedComplaint || !mediaNote.trim()) return;

    setIsSubmitting(true);
    try {
      await onUpdateComplaint(selectedComplaint.id, {
        status: 'escalated',
        priority: 'high',
        resolution: `Media escalation sent to officials: ${mediaNote.trim()}`,
      });
      setSelectedComplaint(null);
      setMediaNote('');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <p className="text-gov-blue/60 mt-1">Public interest monitoring and investigative reporting workspace.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-2xl font-bold text-gov-blue">Investigative Leads</h3>
            <div className="relative w-full sm:w-64">
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

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gov-blue">Citizen Grievance Feed</h3>
                <p className="text-sm text-gov-blue/50 mt-1">Recent public complaints that media can review and escalate to officials.</p>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">
                Live Complaints: {visibleComplaints.length}
              </div>
            </div>

            {visibleComplaints.length === 0 ? (
              <div className="gov-card p-8 text-sm text-gov-blue/60">
                No citizen grievances matched the current search.
              </div>
            ) : (
              visibleComplaints.slice(0, 6).map((complaint, i) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="gov-card p-6 border border-gov-blue/10"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border",
                          complaint.status === 'escalated'
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-gov-saffron/10 text-gov-saffron border-gov-saffron/20"
                        )}>
                          {complaint.status}
                        </span>
                        <span className={cn(
                          "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border",
                          complaint.priority === 'high' || complaint.priority === 'critical'
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-gov-blue/5 text-gov-blue border-gov-blue/10"
                        )}>
                          {complaint.priority || 'medium'} priority
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">
                          {complaint.category}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xl font-bold text-gov-blue">{complaint.projectName || 'General Grievance'}</h4>
                        <p className="text-sm text-gov-blue/60 mt-2 leading-relaxed">{complaint.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-4 text-[11px] font-medium text-gov-blue/50">
                        <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> {complaint.userName}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(complaint.timestamp).toLocaleDateString()}</span>
                        {complaint.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {complaint.location}</span>}
                      </div>

                      {complaint.resolution && (
                        <div className="p-4 rounded-xl bg-gov-blue/5 text-sm text-gov-blue/70 border border-gov-blue/10">
                          {complaint.resolution}
                        </div>
                      )}
                    </div>

                    <div className="w-full lg:w-64 space-y-3">
                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setMediaNote(`Urgent review requested for citizen grievance from ${complaint.userName}.`);
                        }}
                        className="w-full py-3 rounded-xl bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Siren className="w-4 h-4" />
                        Mark High Priority
                      </button>
                      {complaint.imageUrl && (
                        <img
                          src={complaint.imageUrl}
                          alt="Citizen grievance evidence"
                          className="gov-image"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-12">
          <div className="gov-card p-8 space-y-6 border border-red-100 bg-red-50/40">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gov-blue">Media Escalation Desk</h3>
                <p className="text-sm text-gov-blue/50">Forward verified citizen grievances to officials as high priority.</p>
              </div>
            </div>

            {selectedComplaint ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white border border-red-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2">Selected Grievance</p>
                  <p className="text-sm font-bold text-gov-blue">{selectedComplaint.projectName || 'General Grievance'}</p>
                  <p className="text-xs text-gov-blue/60 mt-2 line-clamp-3">{selectedComplaint.description}</p>
                </div>
                <textarea
                  value={mediaNote}
                  onChange={(e) => setMediaNote(e.target.value)}
                  rows={5}
                  className="gov-input resize-none text-sm"
                  placeholder="Add media investigation note for officials..."
                />
                <button
                  onClick={handleEscalateComplaint}
                  disabled={isSubmitting || !mediaNote.trim()}
                  className="w-full py-3 rounded-xl bg-gov-blue text-white text-xs font-bold uppercase tracking-widest hover:bg-gov-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isSubmitting ? 'Sending...' : 'Send High Priority To Official'}
                </button>
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-white border border-gov-blue/10 text-sm text-gov-blue/60">
                Select any citizen grievance from the feed to prepare a high-priority escalation for officials.
              </div>
            )}
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
