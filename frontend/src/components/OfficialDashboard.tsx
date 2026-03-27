import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Users, 
  FileText, 
  ArrowUpRight,
  Edit3,
  Trash2,
  UserPlus,
  Building2,
  MapPin,
  Calendar,
  Briefcase,
  X,
  ShieldCheck,
  Send,
  Siren
} from 'lucide-react';
import { Project, BudgetAllocation, Complaint } from '../types';
import { cn } from '../lib/utils';

interface OfficialDashboardProps {
  projects: Project[];
  budgets: BudgetAllocation[];
  complaints: Complaint[];
  onAddProject: (project: Project) => void;
  onUpdateProject: (projectId: string, updates: Partial<Project> | FormData) => void;
  onUpdateComplaint: (complaintId: string, updates: Partial<Complaint>) => void;
  onUpdateBudget: (budgetId: string, updates: Partial<BudgetAllocation>) => void;
  projectStats?: any;
  complaintStats?: any;
  budgetStats?: any;
  contractors?: Array<{ id: string; fullName: string; companyName?: string; rating?: number }>;
}

export const OfficialDashboard: React.FC<OfficialDashboardProps> = ({ 
  projects, 
  budgets, 
  complaints,
  onAddProject,
  onUpdateProject,
  onUpdateComplaint,
  onUpdateBudget,
  projectStats,
  complaintStats,
  budgetStats,
  contractors = []
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'budgets' | 'complaints' | 'contractors'>('projects');
  const [showSanctionModal, setShowSanctionModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContractorId, setSelectedContractorId] = useState('');

  const totalBudget = projectStats?.totalBudget ?? projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const activeProjects = projectStats?.activeProjects ?? projects.length;
  const riskAlerts = projectStats?.highRiskProjects ?? projects.filter(p => p.corruptionRisk === 'high').length;
  const resolutionRate = complaintStats?.resolutionRate ? Number(complaintStats.resolutionRate) : null;
  const formatCr = (amount: number) => `₹${(amount / 10000000).toFixed(1)} Cr`;
  const mediaEscalations = complaints
    .filter((complaint) => complaint.status === 'escalated' && complaint.priority === 'high')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const highPriorityProjectIds = new Set<string>(
    mediaEscalations
      .map((complaint) => complaint.projectId)
      .filter((projectId): projectId is string => Boolean(projectId))
  );
  const highPriorityProjects = projects.filter(
    (project) => project.corruptionRisk === 'high' || highPriorityProjectIds.has(project.id)
  );
  const sectorBudgetFallback = projects.reduce((acc, project) => {
    const key = project.sector || 'General';
    acc[key] = (acc[key] || 0) + ((project.budget || 0) / 10000000);
    return acc;
  }, {} as Record<string, number>);
  const sectorBudgetData = budgets.length > 0
    ? budgets.map((budget) => ({
        name: budget.sector,
        allocated: Math.round((budget.allocatedAmount || 0) / 10000000),
      }))
    : Object.entries(sectorBudgetFallback).map(([name, allocated]) => ({
        name,
        allocated: Math.round(Number(allocated)),
      }));
  const complaintStatusData = [
    { name: 'Pending', value: complaints.filter((complaint) => complaint.status === 'pending').length, color: '#F59E0B' },
    { name: 'In Review', value: complaints.filter((complaint) => complaint.status === 'in-review').length, color: '#1D4ED8' },
    { name: 'Resolved', value: complaints.filter((complaint) => complaint.status === 'resolved').length, color: '#16A34A' },
    { name: 'Escalated', value: complaints.filter((complaint) => complaint.status === 'escalated').length, color: '#DC2626' },
  ].filter((item) => item.value > 0);
  const projectProgressData = projects
    .slice(0, 6)
    .map((project) => ({
      name: project.title.length > 16 ? `${project.title.slice(0, 16)}…` : project.title,
      progress: project.progress || 0,
      spent: Math.round(((project.spent || 0) / Math.max(project.budget || 1, 1)) * 100),
    }));
  const stats = [
    { label: 'Total Budget', value: formatCr(totalBudget), change: 'Live', trend: 'up' },
    { label: 'Active Projects', value: activeProjects.toString(), change: 'Live', trend: 'up' },
    { label: 'Risk Alerts', value: riskAlerts.toString(), change: 'Live', trend: 'down' },
    { label: 'Resolution Rate', value: `${Math.round(resolutionRate ?? 0)}%`, change: 'Live', trend: 'up' },
  ];

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contractorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSanctionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const contractorId = (formData.get('contractorId') as string) || selectedContractorId;
    const contractor = contractors.find((c) => c.id === contractorId);
    if (!contractor) {
      alert('Please select a valid contractor');
      return;
    }

    const budgetCr = Number(formData.get('budget'));
    const budgetInr = Number.isFinite(budgetCr) ? budgetCr * 10000000 : 0;

    const newProject: Project = {
      id: editingProject?.id || Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      sector: formData.get('sector') as any,
      budget: budgetInr,
      spent: editingProject?.spent || 0,
      status: editingProject?.status || 'sanctioned',
      contractorId,
      contractorName: contractor.companyName || contractor.fullName,
      department: formData.get('department') as string,
      location: {
        lat: 28.6139,
        lng: 77.2090,
        address: formData.get('location') as string,
      },
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      progress: editingProject?.progress || 0,
      corruptionRisk: editingProject?.corruptionRisk || 'low',
      citizenFeedback: editingProject?.citizenFeedback || [],
      performanceScore: editingProject?.performanceScore || 100,
    };

    if (editingProject) {
      onUpdateProject(editingProject.id, newProject);
    } else {
      onAddProject(newProject);
    }
    
    setShowSanctionModal(false);
    setEditingProject(null);
    setSelectedContractorId('');
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gov-blue/10 pb-8">
        <div>
          <div className="flex items-center gap-2 text-gov-saffron text-xs font-bold uppercase tracking-widest mb-2">
            <Building2 className="w-4 h-4" />
            Government of India â€¢ Ministry of Public Works
          </div>
          <h1 className="text-4xl font-display font-bold text-gov-blue tracking-tight">
            Administrative Command Dashboard
          </h1>
          <p className="text-gov-blue/60 mt-1">Oversight, Sanctions, and Integrity Monitoring System</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setEditingProject(null);
              setShowSanctionModal(true);
            }}
            className="gov-button-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Sanction New Project
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
              <ShieldCheck className="w-5 h-5" />
              National Integrity Framework
            </div>
            <h2 className="text-3xl font-display font-bold">Official Oversight Portal</h2>
            <p className="text-white/60 text-sm max-w-xl leading-relaxed">
              Our vision is to ensure every rupee of public funds is utilized with absolute transparency. As an official, your oversight directly contributes to the national mission of corruption-free governance.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-gov-saffron">â‚¹4,200 Cr</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-white/40">Total Oversight</p>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-gov-green">94%</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-white/40">Integrity Score</p>
            </div>
          </div>
        </div>
      </motion.div>

      {(mediaEscalations.length > 0 || highPriorityProjects.length > 0) && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="gov-card p-6 border border-red-100 bg-red-50/50">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gov-blue">Media Escalation Inbox</h3>
                  <p className="text-xs text-gov-blue/50">Messages sent by media for urgent official attention.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">
                {mediaEscalations.length} active
              </span>
            </div>

            <div className="space-y-4">
              {mediaEscalations.length === 0 ? (
                <div className="p-4 rounded-xl bg-white border border-gov-blue/10 text-sm text-gov-blue/60">
                  No media escalation messages right now.
                </div>
              ) : (
                mediaEscalations.slice(0, 3).map((complaint) => (
                  <div key={complaint.id} className="p-4 rounded-xl bg-white border border-red-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-600 border border-red-100">
                        High Priority
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/30">
                        {new Date(complaint.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gov-blue">{complaint.projectName || 'General Grievance'}</p>
                    <p className="text-xs text-gov-blue/60">{complaint.resolution || complaint.description}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">
                      Citizen: {complaint.userName}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="gov-card p-6 border border-gov-saffron/20 bg-gov-saffron/5">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gov-saffron/20 text-gov-saffron flex items-center justify-center">
                  <Siren className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gov-blue">High Priority Projects</h3>
                  <p className="text-xs text-gov-blue/50">Projects flagged by AI risk or media escalation workflow.</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gov-saffron">
                {highPriorityProjects.length} flagged
              </span>
            </div>

            <div className="space-y-4">
              {highPriorityProjects.length === 0 ? (
                <div className="p-4 rounded-xl bg-white border border-gov-blue/10 text-sm text-gov-blue/60">
                  No high priority projects at the moment.
                </div>
              ) : (
                highPriorityProjects.slice(0, 3).map((project) => (
                  <div key={project.id} className="p-4 rounded-xl bg-white border border-gov-saffron/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-gov-saffron/10 text-gov-saffron border border-gov-saffron/20">
                        Immediate Review
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/30">
                        {project.progress}% complete
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gov-blue">{project.title}</p>
                    <p className="text-xs text-gov-blue/60">
                      {project.location.address} • {project.contractorName}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="gov-card p-6 border-l-4 border-l-gov-blue"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase font-bold text-gov-blue/40 tracking-wider">{stat.label}</p>
              <div className={cn(
                "px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1",
                stat.trend === 'up' ? "bg-gov-green/10 text-gov-green" : "bg-red-500/10 text-red-600"
              )}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-3xl font-display font-bold text-gov-blue">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="gov-card p-6">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-gov-blue">Budget Allocation By Sector</h3>
            <p className="text-xs text-gov-blue/50 mt-1">Approved allocation snapshot in crore.</p>
          </div>
          <div className="h-72 flex flex-col justify-end gap-4">
            {sectorBudgetData.length === 0 ? (
              <div className="text-sm text-gov-blue/60">No budget allocation data available.</div>
            ) : (
              sectorBudgetData.map((item) => {
                const maxAllocated = Math.max(...sectorBudgetData.map((entry) => entry.allocated), 1);
                const widthPct = Math.max(10, Math.round((item.allocated / maxAllocated) * 100));
                return (
                  <div key={item.name} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-gov-blue/70">
                      <span className="capitalize">{item.name}</span>
                      <span>{item.allocated} Cr</span>
                    </div>
                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-gov-blue" style={{ width: `${widthPct}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="gov-card p-6">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-gov-blue">Grievance Resolution Mix</h3>
            <p className="text-xs text-gov-blue/50 mt-1">Citizen complaint status distribution.</p>
          </div>
          <div className="h-72 flex flex-col items-center justify-center gap-6">
            {complaintStatusData.length === 0 ? (
              <div className="text-sm text-gov-blue/60">No grievance status data available.</div>
            ) : (
              <>
                <div
                  className="w-44 h-44 rounded-full"
                  style={{
                    background: `conic-gradient(${complaintStatusData
                      .map((item, index, arr) => {
                        const total = arr.reduce((sum, entry) => sum + entry.value, 0) || 1;
                        const start = Math.round(
                          (arr.slice(0, index).reduce((sum, entry) => sum + entry.value, 0) / total) * 360
                        );
                        const end = Math.round(
                          ((arr.slice(0, index + 1).reduce((sum, entry) => sum + entry.value, 0)) / total) * 360
                        );
                        return `${item.color} ${start}deg ${end}deg`;
                      })
                      .join(', ')})`,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-white border border-slate-200 flex items-center justify-center text-center">
                      <div>
                        <p className="text-2xl font-bold text-gov-blue">{complaints.length}</p>
                        <p className="text-[10px] uppercase tracking-widest text-gov-blue/40">Cases</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {complaintStatusData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs text-gov-blue/70">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="gov-card p-6">
          <div className="mb-5">
            <h3 className="text-lg font-bold text-gov-blue">Project Progress Snapshot</h3>
            <p className="text-xs text-gov-blue/50 mt-1">Execution vs spend efficiency for active work.</p>
          </div>
          <div className="h-72 overflow-y-auto pr-1 space-y-4">
            {projectProgressData.length === 0 ? (
              <div className="text-sm text-gov-blue/60">No project progress data available.</div>
            ) : (
              projectProgressData.map((project) => (
                <div key={project.name} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-gov-blue/70">
                    <span>{project.name}</span>
                    <span>{project.progress}% / {project.spent}%</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="w-14 text-[10px] uppercase tracking-widest text-gov-blue/40">Progress</span>
                      <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-gov-green" style={{ width: `${Math.min(project.progress, 100)}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-14 text-[10px] uppercase tracking-widest text-gov-blue/40">Spend</span>
                      <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                        <div className="h-full rounded-full bg-gov-saffron" style={{ width: `${Math.min(project.spent, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex items-center gap-5 mt-4 text-xs text-gov-blue/70">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-gov-green" /> Progress %</span>
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-gov-saffron" /> Spend %</span>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 bg-gov-blue/5 p-1 rounded-xl w-fit">
          {[
            { id: 'projects', label: 'Projects', icon: Briefcase },
            { id: 'budgets', label: 'Budgets', icon: DollarSign },
            { id: 'complaints', label: 'Grievances', icon: Users },
            { id: 'contractors', label: 'Contractors', icon: Building2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all text-sm font-bold uppercase tracking-wider",
                activeTab === tab.id 
                  ? "bg-white text-gov-blue shadow-sm" 
                  : "text-gov-blue/40 hover:text-gov-blue hover:bg-white/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'projects' && (
            <motion.div
              key="projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gov-blue/30" />
                  <input 
                    type="text" 
                    placeholder="Search by project title or contractor ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="gov-input pl-12"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="gov-button-secondary flex items-center gap-2 py-2">
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                  <button className="gov-button-secondary flex items-center gap-2 py-2">
                    <FileText className="w-4 h-4" />
                    Export Report
                  </button>
                </div>
              </div>

              {highPriorityProjects.length > 0 && (
                <div className="gov-card p-6 border border-red-100 bg-red-50/40">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gov-blue">Projects Requiring Immediate Action</h3>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-red-600">
                      Media + AI Priority
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {highPriorityProjects.slice(0, 4).map((project) => (
                      <div key={project.id} className="p-4 rounded-xl bg-white border border-red-100">
                        <div className="flex items-center justify-between mb-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-600 border border-red-100">
                            High Priority
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/30">
                            {project.status}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-gov-blue">{project.title}</p>
                        <p className="text-xs text-gov-blue/60 mt-1">{project.location.address}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="gov-card p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border",
                            project.status === 'delayed' ? "bg-red-50 text-red-600 border-red-100" : 
                            project.status === 'completed' ? "bg-gov-green/10 text-gov-green border-gov-green/20" :
                            "bg-blue-50 text-blue-600 border-blue-100"
                          )}>
                            {project.status}
                          </span>
                          <span className="text-gov-blue/10">|</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">{project.sector}</span>
                          {project.corruptionRisk === 'high' && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                              <AlertTriangle className="w-3 h-3" />
                              RISK ALERT
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gov-blue">{project.title}</h3>
                        <div className="flex flex-wrap gap-5 text-xs text-gov-blue/60">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5" />
                            {project.contractorName} <span className="text-[9px] bg-gov-blue/5 px-1.5 py-0.5 rounded ml-1">ID: {project.contractorId}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" />
                            {project.location.address}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            Deadline: {new Date(project.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:w-56 space-y-3">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-gov-blue/40">Execution</span>
                          <span className="text-gov-blue">{project.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gov-blue/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            className="h-full bg-gov-blue"
                          />
                        </div>
                        <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest">
                          <span className="text-gov-blue/40">Expenditure</span>
                          <span className="text-gov-blue">â‚¹{(project.spent / 10000000).toFixed(1)} / â‚¹{(project.budget / 10000000).toFixed(1)} Cr</span>
                        </div>
                        {project.proofUrl && (
                          <div className="mt-3 rounded-xl border border-gov-blue/10 overflow-hidden bg-gov-bg">
                            <img
                              src={project.proofUrl}
                              alt="Work verification proof"
                              className="gov-image-inset"
                              referrerPolicy="no-referrer"
                            />
                            <div className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-gov-blue/50">
                              Work Verification Proof
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            const newStatus = prompt("Update Project Status (sanctioned, in-progress, delayed, completed):", project.status);
                            if (newStatus) onUpdateProject(project.id, { status: newStatus as any });
                          }}
                          className="px-4 py-2 rounded-lg bg-gov-blue text-white text-xs font-bold hover:bg-gov-blue/90 transition-colors"
                        >
                          Update Status
                        </button>
                        <button 
                          onClick={() => {
                            setEditingProject(project);
                            setShowSanctionModal(true);
                          }}
                          className="p-2 rounded-lg border border-gov-blue/10 text-gov-blue/40 hover:text-gov-blue hover:bg-gov-blue/5 transition-all"
                          title="Edit Details"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 rounded-lg border border-gov-blue/10 text-gov-blue/40 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Archive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'budgets' && (
            <motion.div
              key="budgets"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {budgets.map((budget) => (
                  <div key={budget.id} className="gov-card p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gov-blue">{budget.sector}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gov-saffron bg-gov-saffron/10 px-2.5 py-1 rounded border border-gov-saffron/20">{budget.year}</span>
                    </div>
                    
                    <div className="space-y-5">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Allocated Funds</p>
                          <p className="text-2xl font-display font-bold text-gov-blue">â‚¹{(budget.allocatedAmount / 10000000).toFixed(1)} Cr</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Total Sector Pool</p>
                          <p className="text-lg font-display font-bold text-gov-blue/60">â‚¹{(budget.totalAmount / 10000000).toFixed(1)} Cr</p>
                        </div>
                      </div>

                      <div className="h-2.5 bg-gov-blue/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gov-blue" 
                          style={{ width: `${(budget.allocatedAmount / budget.totalAmount) * 100}%` }} 
                        />
                      </div>

                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">
                        <span>Utilization: {((budget.allocatedAmount / budget.totalAmount) * 100).toFixed(1)}%</span>
                        <span>Unallocated: â‚¹{((budget.totalAmount - budget.allocatedAmount) / 10000000).toFixed(1)} Cr</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        const newAmount = prompt("Enter new allocated amount (in Cr):", (budget.allocatedAmount / 10000000).toString());
                        if (newAmount) {
                          onUpdateBudget(budget.id, { allocatedAmount: Number(newAmount) * 10000000 });
                        }
                      }}
                      className="w-full py-3 rounded-xl border border-gov-blue/10 text-xs font-bold uppercase tracking-widest text-gov-blue hover:bg-gov-blue/5 transition-colors"
                    >
                      Modify Allocation
                    </button>
                  </div>
                ))}
              </div>

              <div className="gov-card p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gov-blue">Project Budgets (Overall)</h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">All Active Projects</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <div key={project.id} className="p-4 rounded-lg border border-gov-blue/10 bg-gov-bg">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">{project.sector}</p>
                          <p className="text-sm font-semibold text-gov-blue">{project.title}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Overall Budget</p>
                          <p className="text-base font-display font-bold text-gov-blue">{formatCr(project.budget || 0)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'complaints' && (
            <motion.div
              key="complaints"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {complaints.map((complaint) => (
                <div key={complaint.id} className="gov-card p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border",
                          complaint.status === 'pending' ? "bg-gov-saffron/10 text-gov-saffron border-gov-saffron/20" : 
                          complaint.status === 'resolved' ? "bg-gov-green/10 text-gov-green border-gov-green/20" : "bg-red-50 text-red-600 border-red-100"
                        )}>
                          {complaint.status}
                        </span>
                        <span className="text-gov-blue/10">|</span>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-gov-blue/40">{complaint.category}</span>
                        {complaint.priority && (
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border",
                            complaint.priority === 'high' || complaint.priority === 'critical'
                              ? "bg-red-50 text-red-600 border-red-100"
                              : "bg-gov-blue/5 text-gov-blue border-gov-blue/10"
                          )}>
                            {complaint.priority} priority
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-gov-blue">{complaint.projectName || 'General Grievance'}</h4>
                      <p className="text-gov-blue/70 text-sm leading-relaxed">{complaint.description}</p>
                      {complaint.resolution && (
                        <div className="p-4 rounded-xl bg-red-50/60 border border-red-100">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-2">Media Message / Official Note</p>
                          <p className="text-sm text-gov-blue/70">{complaint.resolution}</p>
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
                      <div className="flex items-center gap-4 text-[10px] font-bold text-gov-blue/30 uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {complaint.userName}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(complaint.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 justify-center min-w-[180px]">
                      {complaint.status !== 'resolved' && (
                        <>
                          <button 
                            onClick={() => onUpdateComplaint(complaint.id, { status: 'resolved', resolution: 'Issue addressed by department.' })}
                            className="w-full py-2.5 rounded-lg bg-gov-green/10 text-gov-green text-[10px] font-bold uppercase tracking-widest hover:bg-gov-green/20 transition-colors"
                          >
                            Resolve Grievance
                          </button>
                          <button 
                            onClick={() => onUpdateComplaint(complaint.id, { status: 'escalated' })}
                            className="w-full py-2.5 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-colors"
                          >
                            Escalate Issue
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'contractors' && (
            <motion.div
              key="contractors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {contractors.length === 0 ? (
                <div className="gov-card p-8 col-span-full text-center text-sm text-gov-blue/60">
                  No contractors found.
                </div>
              ) : (
                contractors.map((contractor) => {
                  const assignedProjects = projects.filter((p) => p.contractorId === contractor.id);
                  return (
                  <div key={contractor.id} className="gov-card p-6 space-y-5 group">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-lg bg-gov-blue/5 flex items-center justify-center text-gov-blue group-hover:bg-gov-blue group-hover:text-white transition-all">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border",
                          "bg-gov-green/10 text-gov-green border-gov-green/20"
                        )}>
                          Active
                        </span>
                        <span className="text-[8px] font-bold text-gov-blue/20 mt-1 uppercase tracking-tighter">Rating: {contractor.rating || 0}/5</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gov-blue">{contractor.companyName || contractor.fullName}</h4>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gov-blue/30">Contract ID: {contractor.id}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gov-blue/5">
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gov-blue/30 mb-1">Projects</p>
                        <p className="text-lg font-bold text-gov-blue">{assignedProjects.length}</p>
                      </div>
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gov-blue/30 mb-1">Rating</p>
                        <p className="text-lg font-bold text-gov-saffron">{contractor.rating || 0}/5.0</p>
                      </div>
                    </div>
                    {assignedProjects.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gov-blue/30">Assigned Projects</p>
                        <ul className="text-xs text-gov-blue/70 space-y-1">
                          {assignedProjects.slice(0, 2).map((proj) => (
                            <li key={proj.id} className="truncate">{proj.title}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <button 
                      onClick={() => {
                        setSelectedContractorId(contractor.id);
                        setEditingProject(null);
                        setShowSanctionModal(true);
                      }}
                      className="w-full py-3 rounded-xl bg-gov-blue text-white text-xs font-bold uppercase tracking-widest hover:bg-gov-blue/90 transition-all shadow-sm hover:shadow-md"
                    >
                      Assign New Project
                    </button>
                  </div>
                  );
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sanction/Edit Project Modal */}
      <AnimatePresence>
        {showSanctionModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowSanctionModal(false);
                setEditingProject(null);
              }}
              className="absolute inset-0 bg-gov-blue/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl gov-card p-10 max-h-[90vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-gov-blue">
                    {editingProject ? 'Modify Project Sanction' : 'Sanction New Project'}
                  </h2>
                  <p className="text-gov-blue/60 text-sm">Official authorization and contractor assignment portal.</p>
                </div>
                <button 
                  onClick={() => {
                    setShowSanctionModal(false);
                    setEditingProject(null);
                  }}
                  className="p-2 rounded-lg hover:bg-gov-blue/5 text-gov-blue/40 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSanctionSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Project Title</label>
                    <input 
                      name="title" 
                      defaultValue={editingProject?.title}
                      required 
                      className="gov-input" 
                      placeholder="e.g. National Highway Expansion"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Description</label>
                    <textarea 
                      name="description" 
                      defaultValue={editingProject?.description}
                      required 
                      rows={3}
                      className="gov-input resize-none" 
                      placeholder="Project scope and objectives..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Sector</label>
                      <select name="sector" defaultValue={editingProject?.sector} className="gov-input appearance-none">
                        <option value="infrastructure">Infrastructure</option>
                        <option value="welfare">Public Welfare</option>
                        <option value="procurement">Procurement</option>
                        <option value="delivery">Service Delivery</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Department</label>
                      <input name="department" defaultValue={editingProject?.department} required className="gov-input" placeholder="e.g. PWD" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Budget (Cr)</label>
                      <input
                        name="budget"
                        type="number"
                        step="0.1"
                        defaultValue={editingProject?.budget ? (editingProject.budget / 10000000) : ''}
                        required
                        className="gov-input"
                        placeholder="Amount in Cr"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Location</label>
                      <input name="location" defaultValue={editingProject?.location.address} required className="gov-input" placeholder="City, State" />
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-gov-blue/5 border border-gov-blue/10 space-y-3">
                    <div className="flex items-center gap-2 text-gov-blue mb-1">
                      <UserPlus className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Contractor Assignment</span>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-gov-blue/40">Contractor ID</label>
                        <select
                          name="contractorId"
                          required
                          className="gov-input py-2.5"
                          value={selectedContractorId || editingProject?.contractorId || ''}
                          onChange={(e) => setSelectedContractorId(e.target.value)}
                        >
                          <option value="">Select Contractor</option>
                          {contractors.map((contractor) => (
                            <option key={contractor.id} value={contractor.id}>
                              {contractor.id} {contractor.companyName ? `- ${contractor.companyName}` : `- ${contractor.fullName}`}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-gov-blue/40">Contractor Name</label>
                        <input
                          name="contractorName"
                          value={
                            contractors.find((c) => c.id === (selectedContractorId || editingProject?.contractorId))?.companyName ||
                            contractors.find((c) => c.id === (selectedContractorId || editingProject?.contractorId))?.fullName ||
                            editingProject?.contractorName ||
                            ''
                          }
                          readOnly
                          className="gov-input py-2.5"
                          placeholder="Organization Name"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Start Date</label>
                      <input name="startDate" type="date" defaultValue={editingProject?.startDate} required className="gov-input" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">End Date</label>
                      <input name="endDate" type="date" defaultValue={editingProject?.endDate} required className="gov-input" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-4">
                  <button 
                    type="submit" 
                    className="gov-button-primary w-full py-4 text-base"
                  >
                    {editingProject ? 'Update Sanction Details' : 'Authorize & Sanction Project'}
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


