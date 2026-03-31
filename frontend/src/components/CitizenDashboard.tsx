import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  MapPin, 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  ChevronRight,
  Camera,
  MessageSquare,
  TrendingUp,
  Globe,
  ArrowUpRight,
  Clock,
  Info
} from 'lucide-react';
import { Project, BudgetAllocation, Complaint } from '../types';
import { cn } from '../lib/utils';

interface CitizenDashboardProps {
  userId: string | null;
  projects: Project[];
  budgets: BudgetAllocation[];
  complaints: Complaint[];
  onAddComplaint: (complaint: Complaint | FormData) => Promise<void> | void;
  onUpdateComplaint: (complaintId: string, updates: Partial<Complaint> | FormData) => Promise<void> | void;
  projectStats?: any;
  complaintStats?: any;
  budgetStats?: any;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({ 
  userId,
  projects, 
  budgets, 
  complaints,
  onAddComplaint,
  onUpdateComplaint,
  projectStats,
  complaintStats,
  budgetStats
}) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [editingComplaint, setEditingComplaint] = useState<Complaint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const totalProjects = projectStats?.totalProjects ?? projects.length;
  const activeProjects = projectStats?.activeProjects ?? projects.length;
  const highRiskProjects = projectStats?.highRiskProjects ?? projects.filter(p => p.corruptionRisk === 'high').length;
  const totalBudget = projectStats?.totalBudget ?? 0;
  const totalSpent = projectStats?.totalSpent ?? 0;
  const resolutionRate = complaintStats?.resolutionRate ? Number(complaintStats.resolutionRate) : null;
  const integrityScore = totalProjects > 0
    ? Math.max(0, Math.round(100 - (highRiskProjects / totalProjects) * 100))
    : 100;

  const computedBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const computedSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);
  const totalAllocated = Math.max(projectStats?.totalBudget ?? 0, computedBudget, budgets.reduce((sum, b) => sum + (b.allocatedAmount || 0), 0));
  const totalUtilized = Math.max(projectStats?.totalSpent ?? 0, computedSpent, totalSpent);
  const taxUtilizationPct = totalAllocated > 0 ? Math.round((totalUtilized / totalAllocated) * 100) : 0;

  const formatCr = (amount: number) => `₹${(amount / 10000000).toFixed(1)} Cr`;

  const sectorBuckets: Record<string, number> = budgets.reduce((acc: Record<string, number>, budget) => {
    const key = budget.sector || 'General';
    acc[key] = (acc[key] || 0) + (budget.allocatedAmount || 0);
    return acc;
  }, {});
  const sectorData: Array<{ label: string; amount: number; percent: number }> = Object.entries(sectorBuckets)
    .map(([label, amount]) => ({
      label,
      amount: Number(amount),
      percent: totalAllocated > 0 ? Math.round((amount / totalAllocated) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const fundsTracked = totalAllocated || totalBudget;
  const trustScore = resolutionRate ?? integrityScore;
  const taxItems = sectorData.length > 0
    ? sectorData
    : [{ label: 'General Allocation', amount: totalAllocated, percent: totalAllocated > 0 ? 100 : 0 }];
  const taxColors = ['bg-gov-blue', 'bg-gov-green', 'bg-gov-saffron', 'bg-blue-400', 'bg-slate-400'];
  const highRiskProject = projects.find(p => p.corruptionRisk === 'high');
  const lowRiskProject = projects.find(p => p.corruptionRisk === 'low');
  const getRiskTone = (risk?: number) => {
    if ((risk || 0) >= 75) return 'bg-red-100 text-red-700 border-red-200';
    if ((risk || 0) >= 45) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };

  const stats = [
    { label: 'Active Projects', value: activeProjects.toString(), icon: Globe, color: 'text-blue-600' },
    { label: 'Tax Utilization', value: `${taxUtilizationPct}%`, icon: BarChart3, color: 'text-gov-green' },
    { label: 'Public Grievances', value: (complaintStats?.totalComplaints ?? complaints.length).toString(), icon: MessageSquare, color: 'text-gov-saffron' },
    { label: 'Integrity Score', value: `${integrityScore}/100`, icon: ShieldAlert, color: 'text-gov-blue' },
  ];

  const handleReportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const project = projects.find(p => p.id === formData.get('projectId'));
    if (project?.title) {
      formData.set('projectName', project.title);
    }
    const imageFile = formData.get('image') as File;
    if (!imageFile || imageFile.size === 0) {
      formData.delete('image');
    }

    await onAddComplaint(formData);
    setShowReportModal(false);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingComplaint) return;
    const formData = new FormData(e.currentTarget);

    const imageFile = formData.get('image') as File;
    if (!imageFile || imageFile.size === 0) {
      formData.delete('image');
    }

    await onUpdateComplaint(editingComplaint.id, formData);

    setEditingComplaint(null);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gov-blue">Citizen Oversight Portal</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor public spending and project integrity in real-time.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowReportModal(true)}
            className="gov-button-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            File a Grievance
          </button>
        </div>
      </div>

      {/* Mission & Vision Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gov-blue text-white p-8 rounded-2xl shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/4" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gov-saffron font-bold text-xs uppercase tracking-[0.3em]">
              <Globe className="w-5 h-5" />
              Public Oversight Mission
            </div>
            <h2 className="text-3xl font-display font-bold">Your Voice, Our Integrity</h2>
            <p className="text-white/60 text-sm max-w-xl leading-relaxed">
              Every citizen is a stakeholder in the nation's progress. Use this portal to monitor how your taxes are being utilized in local projects and report any discrepancies to ensure absolute accountability.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-gov-saffron">{formatCr(fundsTracked)}</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-white/40">Public Funds Tracked</p>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-gov-green">{Math.round(trustScore)}%</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-white/40">National Trust Score</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="gov-card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg bg-slate-50", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Data</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Tax Utilization Section */}
          <div className="gov-card p-8 bg-gradient-to-br from-white to-slate-50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-gov-blue">Tax Revenue Utilization</h3>
                <p className="text-xs text-slate-500 mt-1">Breakdown of how citizen taxes are being deployed across sectors.</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-gov-green/10 text-gov-green rounded-full text-[10px] font-bold uppercase tracking-widest">
                <CheckCircle2 className="w-3 h-3" />
                Audited
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gov-blue/50">
              <span>Total Allocated: {formatCr(totalAllocated)}</span>
              <span className="text-gov-blue/20">|</span>
              <span className="text-gov-blue">Utilized by Contractors: {formatCr(totalUtilized)}</span>
            </div>

            <div className="space-y-6">
              {taxItems.map((item, index) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-slate-700">{item.label}</span>
                    <span className="font-bold text-gov-blue">{formatCr(item.amount)}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percent}%` }}
                      className={cn("h-full rounded-full", taxColors[index % taxColors.length])} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-xl font-bold text-gov-blue">Active Public Projects</h3>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by location or sector..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="gov-input pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase())).map((project, i) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="gov-card p-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
                        project.status === 'delayed' ? "bg-red-50 text-red-600" : "bg-green-50 text-gov-green"
                      )}>
                        {project.status}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{project.sector}</span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800">{project.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{project.description}</p>
                    {project.proofUrl && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 bg-white">
                        <img
                          src={project.proofUrl}
                          alt="Work verification proof"
                          className="gov-image-inset"
                          referrerPolicy="no-referrer"
                        />
                        <div className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                          Work Verification Proof
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-4 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {project.location.address}</span>
                      <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" /> {project.progress}% Complete</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 justify-center min-w-[140px]">
                    <button className="gov-button-secondary py-2 text-xs">View Audit</button>
                    <button 
                      onClick={() => setShowReportModal(true)}
                      className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
                    >
                      Report Anomaly
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Corruption Risk Analysis */}
          <div className="gov-card p-6 border-l-4 border-l-red-500 bg-red-50/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-red-900">Integrity Watch</h3>
            </div>
            <p className="text-sm text-red-800/70 leading-relaxed mb-6">
              AI-driven analysis of project spending patterns and contractor history.
            </p>
            <div className="space-y-4">
              {highRiskProject ? (
                <div className="p-4 bg-white rounded-lg border border-red-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">High Risk Alert</span>
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">{highRiskProject.title}</p>
                  <p className="text-[10px] text-slate-500">
                    {highRiskProject.riskFactors?.length ? highRiskProject.riskFactors.join(', ') : 'Potential risk detected based on recent activity.'}
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-white rounded-lg border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gov-green uppercase tracking-widest">All Clear</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-gov-green" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">No high-risk projects detected</p>
                  <p className="text-[10px] text-slate-500">Current projects show normal spending and timelines.</p>
                </div>
              )}

              {lowRiskProject ? (
                <div className="p-4 bg-white rounded-lg border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gov-green uppercase tracking-widest">Positive Trend</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-gov-green" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">{lowRiskProject.title}</p>
                  <p className="text-[10px] text-slate-500">Transparent utilization and steady progress verified.</p>
                </div>
              ) : (
                <div className="p-4 bg-white rounded-lg border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gov-blue uppercase tracking-widest">Monitoring</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-gov-blue" />
                  </div>
                  <p className="text-xs font-bold text-slate-800">Awaiting project updates</p>
                  <p className="text-[10px] text-slate-500">Risk analysis updates will appear once data is available.</p>
                </div>
              )}
            </div>
          </div>

          <div className="gov-card p-6">
            <h3 className="text-lg font-bold text-gov-blue mb-6">My Grievances</h3>
            <div className="space-y-4">
                {complaints.length > 0 ? complaints.map((complaint) => (
                  <div key={complaint.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest",
                      complaint.status === 'pending' ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-gov-green"
                    )}>
                      {complaint.status}
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{new Date(complaint.timestamp).toLocaleDateString()}</span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-800">{complaint.projectName || 'General Issue'}</h5>
                    <p className="text-[11px] text-slate-500 line-clamp-2 italic">"{complaint.description}"</p>
                    {typeof complaint.aiAnalysis?.riskPercentage === 'number' && (
                      <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-slate-400">AI Evidence Review</p>
                            <p className="text-[11px] text-slate-600 mt-1">
                              {complaint.aiAnalysis.summary || complaint.aiAnalysis.officialDescription}
                            </p>
                          </div>
                          <span className={cn(
                            'shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest',
                            getRiskTone(complaint.aiAnalysis.riskPercentage)
                          )}>
                            {complaint.aiAnalysis.riskPercentage}% risk
                          </span>
                        </div>
                        {typeof complaint.aiAnalysis.confidence === 'number' && (
                          <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-500">
                            <Info className="w-3.5 h-3.5" />
                            Confidence {complaint.aiAnalysis.confidence}%
                          </div>
                        )}
                      </div>
                    )}
                    {complaint.imageUrl && (
                      <img
                        src={complaint.imageUrl}
                      alt="Grievance evidence"
                      className="gov-image"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setEditingComplaint(complaint)}
                    className="text-[9px] font-bold uppercase tracking-widest text-gov-blue/50 hover:text-gov-blue transition-colors"
                  >
                    Edit Grievance
                  </button>
                </div>
              )) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 italic">No active grievances.</p>
                </div>
              )}
            </div>
            <button className="w-full mt-6 py-3 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors">
              View All History
            </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReportModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gov-blue">File a Public Grievance</h3>
                  <p className="text-slate-500 text-xs mt-1">Provide details for official investigation.</p>
                </div>
                <button 
                  onClick={() => setShowReportModal(false)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Plus className="w-5 h-5 rotate-45 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleReportSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Associated Project</label>
                    <select name="projectId" required className="gov-input text-xs">
                      <option value="">Select a project (Optional)</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Category</label>
                      <select name="category" required className="gov-input text-xs">
                        <option value="quality">Quality Issue</option>
                        <option value="delay">Project Delay</option>
                        <option value="corruption">Corruption Suspected</option>
                        <option value="safety">Safety Concern</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Location</label>
                      <input name="location" required className="gov-input text-xs" placeholder="e.g. Ward 12, Main St" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Grievance Description</label>
                    <textarea 
                      name="description" 
                      required 
                      rows={4}
                      className="gov-input text-xs resize-none" 
                      placeholder="Please provide specific details about the issue..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Upload Evidence Image (Optional)</label>
                    <input name="image" type="file" accept="image/*" className="gov-input text-xs" />
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Image upload hone par AI us photo ko evaluate karega aur official dashboard par automated summary aur risk percentage dikhega.
                    </p>
                  </div>

                  <div className="p-6 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-gov-blue/40 hover:bg-slate-100 transition-all">
                    <Camera className="w-6 h-6 text-slate-300 group-hover:text-gov-blue transition-colors" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Upload Evidence (Photos/Docs)</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="flex-1 gov-button-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 gov-button-primary"
                  >
                    Submit Grievance
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Grievance Modal */}
      <AnimatePresence>
        {editingComplaint && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingComplaint(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-gov-blue">Update Grievance</h3>
                  <p className="text-slate-500 text-xs mt-1">Edit your submitted grievance details.</p>
                </div>
                <button 
                  onClick={() => setEditingComplaint(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <Plus className="w-5 h-5 rotate-45 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Associated Project</label>
                    <select name="projectId" defaultValue={editingComplaint.projectId} className="gov-input text-xs" disabled>
                      <option value="">Select a project (Optional)</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Category</label>
                      <select name="category" defaultValue={editingComplaint.category} required className="gov-input text-xs">
                        <option value="quality">Quality Issue</option>
                        <option value="delay">Project Delay</option>
                        <option value="corruption">Corruption Suspected</option>
                        <option value="safety">Safety Concern</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Location</label>
                      <input name="location" defaultValue={editingComplaint.location} required className="gov-input text-xs" placeholder="e.g. Ward 12, Main St" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Grievance Description</label>
                    <textarea 
                      name="description" 
                      required 
                      rows={4}
                      defaultValue={editingComplaint.description}
                      className="gov-input text-xs resize-none" 
                      placeholder="Please provide specific details about the issue..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Replace Evidence Image (Optional)</label>
                    <input name="image" type="file" accept="image/*" className="gov-input text-xs" />
                    {editingComplaint.imageUrl && (
                      <img
                        src={editingComplaint.imageUrl}
                        alt="Current evidence"
                        className="mt-3 gov-image"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setEditingComplaint(null)}
                    className="flex-1 gov-button-secondary"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 gov-button-primary"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
