import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, 
  Truck, 
  HardHat, 
  FileUp, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  IndianRupee,
  Plus,
  X,
  Save,
  Activity,
  DollarSign,
  Package,
  TrendingUp,
  ArrowUpRight,
  Clock,
  MapPin
} from 'lucide-react';
import { Project } from '../types';
import { formatCurrency, cn } from '../lib/utils';

interface ContractorDashboardProps {
  projects: Project[];
  onUpdateProject: (id: string, updates: Partial<Project> | FormData) => void;
}

export const ContractorDashboard: React.FC<ContractorDashboardProps> = ({ projects, onUpdateProject }) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [updateForm, setUpdateForm] = useState<Partial<Project>>({});
  const [proofFile, setProofFile] = useState<File | null>(null);

  const handleOpenUpdate = (project: Project) => {
    setEditingProject(project);
    setUpdateForm({
      progress: project.progress,
      expenses: project.expenses || 0,
      resourceUsage: project.resourceUsage || '',
    });
    setProofFile(null);
  };

  const handleSaveUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      const formData = new FormData();
      formData.set('progress', String(typeof updateForm.progress === 'string' ? Number(updateForm.progress) : updateForm.progress ?? 0));
      formData.set('expenses', String(typeof updateForm.expenses === 'string' ? Number(updateForm.expenses) : updateForm.expenses ?? 0));
      if (updateForm.resourceUsage) formData.set('resourceUsage', updateForm.resourceUsage);
      if (proofFile) formData.set('proof', proofFile);
      onUpdateProject(editingProject.id, formData as any);
      setEditingProject(null);
    }
  };

  return (
    <div className="space-y-10 pb-20">
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
              <HardHat className="w-5 h-5" />
              Execution & Integrity
            </div>
            <h2 className="text-3xl font-display font-bold">Building the Nation's Future</h2>
            <p className="text-white/60 text-sm max-w-xl leading-relaxed">
              As a verified contractor, your commitment to quality and transparency is the backbone of our infrastructure. Use this portal to report progress accurately and maintain your national trust score.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-gov-saffron">{projects.length}</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-white/40">Active Contracts</p>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-gov-green">92%</p>
              <p className="text-[8px] font-bold uppercase tracking-widest text-white/40">Compliance Rate</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gov-blue/10 pb-8">
        <div>
          <div className="flex items-center gap-2 text-gov-saffron text-xs font-bold uppercase tracking-widest mb-2">
            <HardHat className="w-4 h-4" />
            Project Execution & Compliance Portal
          </div>
          <h1 className="text-4xl font-display font-bold text-gov-blue tracking-tight">
            Contractor Dashboard
          </h1>
          <p className="text-gov-blue/60 mt-1">Manage assigned government contracts and report progress.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="gov-button-secondary flex items-center gap-2">
            <FileUp className="w-5 h-5" />
            Submit Daily Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gov-blue">Active Contracts</h3>
            <span className="text-xs font-bold text-gov-blue/40 uppercase tracking-widest">
              {projects.length} Projects Assigned
            </span>
          </div>

          {projects.map((project, i) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="gov-card p-8 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-16 h-16 rounded-xl bg-gov-blue/5 flex items-center justify-center text-gov-blue">
                  <HardHat className="w-8 h-8" />
                </div>
                
                <div className="flex-1 space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                      project.status === 'in-progress' ? "bg-blue-50 text-blue-600 border-blue-100" : 
                      project.status === 'delayed' ? "bg-red-50 text-red-600 border-red-100" :
                      "bg-gov-saffron/10 text-gov-saffron border-gov-saffron/20"
                    )}>
                      {project.status}
                    </span>
                    <span className="text-gov-blue/10">|</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">{project.department}</span>
                  </div>

                  <h4 className="text-2xl font-bold text-gov-blue">{project.title}</h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-5 border-y border-gov-blue/5">
                    <div className="space-y-1">
                      <p className="text-[9px] text-gov-blue/40 uppercase font-bold tracking-widest">Budget</p>
                      <p className="text-base font-bold text-gov-blue">{formatCurrency(project.budget)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] text-gov-blue/40 uppercase font-bold tracking-widest">Utilized</p>
                      <p className="text-base font-bold text-gov-blue/60">{formatCurrency(project.spent)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] text-gov-blue/40 uppercase font-bold tracking-widest">Deadline</p>
                      <p className="text-base font-bold text-gov-blue/60">{new Date(project.endDate).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] text-gov-blue/40 uppercase font-bold tracking-widest">Location</p>
                      <p className="text-base font-bold text-gov-blue/60 truncate">{project.location.address}</p>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Work Completion</span>
                      <span className="text-lg font-bold text-gov-blue">{project.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gov-blue/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        className="h-full bg-gov-blue"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1.5 text-gov-green">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Compliance Verified</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gov-blue/30">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-bold uppercase tracking-widest">Next Audit: 4 Days</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleOpenUpdate(project)}
                      className="gov-button-primary py-2.5 px-6 text-xs"
                    >
                      Update Project Status
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-8">
          <div className="gov-card p-8 space-y-6">
            <h3 className="text-lg font-bold text-gov-blue">Trust Score</h3>
            <div className="flex flex-col items-center py-2">
              <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                <svg className="w-full h-full -rotate-90">
                  <circle 
                    cx="80" cy="80" r="72" 
                    fill="none" stroke="currentColor" strokeWidth="10" 
                    className="text-gov-blue/5" 
                  />
                  <motion.circle 
                    initial={{ strokeDashoffset: 452.4 }}
                    animate={{ strokeDashoffset: 452.4 - (452.4 * 88) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="80" cy="80" r="72" 
                    fill="none" stroke="currentColor" strokeWidth="10" 
                    strokeDasharray="452.4" 
                    className="text-gov-green" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-display font-bold text-gov-blue">88</span>
                  <span className="text-[9px] text-gov-blue/40 uppercase font-bold tracking-widest">Grade A</span>
                </div>
              </div>
              <div className="text-center space-y-3">
                <p className="text-xs text-gov-blue/60 leading-relaxed">
                  Your score reflects project quality, timeline adherence, and transparency.
                </p>
                <div className="flex items-center justify-center gap-1.5 text-gov-green">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">+4.2% Growth</span>
                </div>
              </div>
            </div>
          </div>

          <div className="gov-card p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gov-blue">Citizen Feedback</h3>
              <ArrowUpRight className="w-5 h-5 text-gov-blue/20" />
            </div>
            <div className="space-y-4">
              {projects[0]?.citizenFeedback.map((feedback) => (
                <div key={feedback.id} className="p-4 rounded-xl bg-gov-blue/5 border border-gov-blue/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gov-blue">{feedback.userName}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={cn("w-1.5 h-1.5 rounded-full", i < feedback.rating ? "bg-gov-saffron" : "bg-gov-blue/10")} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gov-blue/60 italic leading-relaxed">"{feedback.comment}"</p>
                </div>
              ))}
            </div>
            <button className="w-full py-3 rounded-xl border border-gov-blue/10 text-[10px] font-bold uppercase tracking-widest text-gov-blue hover:bg-gov-blue/5 transition-colors">
              View All Feedback
            </button>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      <AnimatePresence>
        {editingProject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProject(null)}
              className="absolute inset-0 bg-gov-blue/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg gov-card p-10 border-gov-blue/10"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-display font-bold text-gov-blue">Update Progress</h3>
                  <p className="text-gov-blue/60 text-sm">{editingProject.title}</p>
                </div>
                <button 
                  onClick={() => setEditingProject(null)}
                  className="p-2 rounded-lg hover:bg-gov-blue/5 text-gov-blue/40 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSaveUpdate} className="space-y-6">
                <div className="space-y-5">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Completion Percentage</label>
                      <span className="text-xl font-bold text-gov-blue">{updateForm.progress}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={updateForm.progress}
                      onChange={(e) => setUpdateForm({ ...updateForm, progress: parseInt(e.target.value) })}
                      className="w-full accent-gov-blue h-1.5 bg-gov-blue/10 rounded-full appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Current Expenditure (INR)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gov-blue/30" />
                      <input 
                        type="number"
                        value={updateForm.expenses}
                        onChange={(e) => setUpdateForm({ ...updateForm, expenses: Number(e.target.value) })}
                        className="gov-input pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/40">Resource Utilization Details</label>
                    <textarea 
                      rows={3}
                      value={updateForm.resourceUsage}
                      onChange={(e) => setUpdateForm({ ...updateForm, resourceUsage: e.target.value })}
                      placeholder="Summary of materials, labor, and equipment..."
                      className="gov-input resize-none"
                    />
                  </div>

                  <label className="p-6 rounded-xl border-2 border-dashed border-gov-blue/10 bg-gov-blue/[0.02] flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-gov-blue/30 hover:bg-gov-blue/[0.04] transition-all">
                    <FileUp className="w-6 h-6 text-gov-blue/20 group-hover:text-gov-blue transition-colors" />
                    <p className="text-[9px] font-bold uppercase tracking-widest text-gov-blue/40">Upload Work Verification Proof</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    <span className="text-[10px] text-gov-blue/50">Click to choose image</span>
                    {proofFile && (
                      <p className="text-[9px] text-gov-green font-bold uppercase tracking-widest">{proofFile.name}</p>
                    )}
                  </label>
                  {editingProject?.proofUrl && (
                    <div className="rounded-xl overflow-hidden border border-gov-blue/10 bg-white">
                      <img
                        src={editingProject.proofUrl}
                        alt="Existing proof"
                        className="gov-image-inset"
                        referrerPolicy="no-referrer"
                      />
                      <div className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-gov-blue/50">
                        Current Proof On File
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-2">
                  <button 
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="flex-1 py-3 rounded-xl border border-gov-blue/10 text-xs font-bold uppercase tracking-widest text-gov-blue hover:bg-gov-blue/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 gov-button-primary py-3 text-sm flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Update
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
