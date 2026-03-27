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
  ShieldCheck
} from 'lucide-react';
import { Project, BudgetAllocation, Complaint } from '../types';
import { cn } from '../lib/utils';

interface OfficialDashboardProps {
  projects: Project[];
  budgets: BudgetAllocation[];
  complaints: Complaint[];
  onAddProject: (project: Project) => void;
  onUpdateProject: (projectId: string, updates: Partial<Project>) => void;
  onUpdateComplaint: (complaintId: string, updates: Partial<Complaint>) => void;
  onUpdateBudget: (budgetId: string, updates: Partial<BudgetAllocation>) => void;
}

export const OfficialDashboard: React.FC<OfficialDashboardProps> = ({ 
  projects, 
  budgets, 
  complaints,
  onAddProject,
  onUpdateProject,
  onUpdateComplaint,
  onUpdateBudget
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'budgets' | 'complaints' | 'contractors'>('projects');
  const [showSanctionModal, setShowSanctionModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { label: 'Total Budget', value: '₹4,200 Cr', change: '+12%', trend: 'up' },
    { label: 'Active Projects', value: projects.length.toString(), change: '+5', trend: 'up' },
    { label: 'Risk Alerts', value: projects.filter(p => p.corruptionRisk === 'high').length.toString(), change: '-2', trend: 'down' },
    { label: 'Resolution Rate', value: '94%', change: '+3%', trend: 'up' },
  ];

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.contractorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSanctionSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newProject: Project = {
      id: editingProject?.id || Math.random().toString(36).substr(2, 9),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      sector: formData.get('sector') as any,
      budget: Number(formData.get('budget')),
      spent: editingProject?.spent || 0,
      status: editingProject?.status || 'sanctioned',
      contractorId: formData.get('contractorId') as string,
      contractorName: formData.get('contractorName') as string,
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
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gov-blue/10 pb-8">
        <div>
          <div className="flex items-center gap-2 text-gov-saffron text-xs font-bold uppercase tracking-widest mb-2">
            <Building2 className="w-4 h-4" />
            Government of India • Ministry of Public Works
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
              <p className="text-2xl font-display font-bold text-gov-saffron">₹4,200 Cr</p>
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
                          <span className="text-gov-blue">₹{(project.spent / 10000000).toFixed(1)} / ₹{(project.budget / 10000000).toFixed(1)} Cr</span>
                        </div>
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
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
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
                        <p className="text-2xl font-display font-bold text-gov-blue">₹{(budget.allocatedAmount / 10000000).toFixed(1)} Cr</p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Total Sector Pool</p>
                        <p className="text-lg font-display font-bold text-gov-blue/60">₹{(budget.totalAmount / 10000000).toFixed(1)} Cr</p>
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
                      <span>Unallocated: ₹{((budget.totalAmount - budget.allocatedAmount) / 10000000).toFixed(1)} Cr</span>
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
                      </div>
                      <h4 className="text-lg font-bold text-gov-blue">{complaint.projectName || 'General Grievance'}</h4>
                      <p className="text-gov-blue/70 text-sm leading-relaxed">{complaint.description}</p>
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
              {[
                { id: 'CON-001', name: 'Skyline Infrastructure', projects: 4, rating: 4.8, status: 'Active', trustScore: 92 },
                { id: 'CON-002', name: 'Global Tech Solutions', projects: 2, rating: 4.2, status: 'Active', trustScore: 85 },
                { id: 'CON-003', name: 'Urban Development Corp', projects: 7, rating: 3.9, status: 'Under Review', trustScore: 68 },
                { id: 'CON-004', name: 'Green Build India', projects: 1, rating: 4.5, status: 'Active', trustScore: 89 },
              ].map((contractor) => (
                <div key={contractor.id} className="gov-card p-6 space-y-5 group">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-gov-blue/5 flex items-center justify-center text-gov-blue group-hover:bg-gov-blue group-hover:text-white transition-all">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest border",
                        contractor.status === 'Active' ? "bg-gov-green/10 text-gov-green border-gov-green/20" : "bg-gov-saffron/10 text-gov-saffron border-gov-saffron/20"
                      )}>
                        {contractor.status}
                      </span>
                      <span className="text-[8px] font-bold text-gov-blue/20 mt-1 uppercase tracking-tighter">Trust Score: {contractor.trustScore}%</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gov-blue">{contractor.name}</h4>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gov-blue/30">Contract ID: {contractor.id}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-gov-blue/5">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gov-blue/30 mb-1">Projects</p>
                      <p className="text-lg font-bold text-gov-blue">{contractor.projects}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-gov-blue/30 mb-1">Rating</p>
                      <p className="text-lg font-bold text-gov-saffron">{contractor.rating}/5.0</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingProject(null);
                      setShowSanctionModal(true);
                      // Pre-fill contractor info if needed
                    }}
                    className="w-full py-3 rounded-xl bg-gov-blue text-white text-xs font-bold uppercase tracking-widest hover:bg-gov-blue/90 transition-all shadow-sm hover:shadow-md"
                  >
                    Assign New Project
                  </button>
                </div>
              ))}
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
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Budget (INR)</label>
                      <input name="budget" type="number" defaultValue={editingProject?.budget} required className="gov-input" placeholder="Amount in ₹" />
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
                        <input name="contractorId" defaultValue={editingProject?.contractorId} required className="gov-input py-2.5" placeholder="CON-XXXXX" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-widest text-gov-blue/40">Contractor Name</label>
                        <input name="contractorName" defaultValue={editingProject?.contractorName} required className="gov-input py-2.5" placeholder="Organization Name" />
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
