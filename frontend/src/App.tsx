/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, Project, BudgetAllocation, Complaint, RTIRequest } from './types';
import { Sidebar, Navbar } from './components/Layout';
import { CitizenDashboard } from './components/CitizenDashboard';
import { OfficialDashboard } from './components/OfficialDashboard';
import { MediaDashboard } from './components/MediaDashboard';
import { ContractorDashboard } from './components/ContractorDashboard';
import { LandingPageWithAuth } from './components/LandingPageWithAuth';
import { RTIPortal } from './components/RTIPortal';
import { Community } from './components/Community';
import { PlatformInfo } from './components/PlatformInfo';
import { ShieldAlert, LogOut } from 'lucide-react';
import { cn } from './lib/utils';
import { AuthProvider, useAuth } from './context/AuthContext';
import apiClient from './lib/apiClient';
import { mapBudget, mapComplaint, mapComplaintCategoryToApi, mapProject, mapRTIRequest } from './lib/apiAdapters';

type ViewState = 'landing' | 'login' | 'dashboard';

// Inner App component that uses auth context
function AppContent() {
  const { user, logout } = useAuth();
  const [view, setView] = useState<ViewState>(user ? 'dashboard' : 'landing');
  const [role, setRole] = useState<UserRole | null>(user?.role as UserRole || null);
  const [userId, setUserId] = useState<string | null>(user?.identificationId || user?.id || null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  // Global State
  const [projects, setProjects] = useState<Project[]>([]);
  const [budgets, setBudgets] = useState<BudgetAllocation[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [projectStats, setProjectStats] = useState<any>(null);
  const [complaintStats, setComplaintStats] = useState<any>(null);
  const [budgetStats, setBudgetStats] = useState<any>(null);
  const [rtiStats, setRtiStats] = useState<any>(null);
  const [rtiRequests, setRtiRequests] = useState<RTIRequest[]>([]);
  const [contractors, setContractors] = useState<any[]>([]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (user) {
      setView('dashboard');
      setRole(user.role as UserRole);
      setUserId(user.identificationId || user.id || null);
    } else {
      setView('landing');
      setRole(null);
      setUserId(null);
      setProjects([]);
      setBudgets([]);
      setComplaints([]);
    }
  }, [user]);

  const loadData = useCallback(async () => {
    if (!user) return;
    setIsDataLoading(true);
    setDataError(null);
    try {
      const userIdentifier = user.identificationId || user.id;
      const projectFilters: Record<string, string> = {};
      const complaintFilters: Record<string, string> = {};
      const budgetFilters: Record<string, string> = {};

      if (user.role === 'official') {
        projectFilters.officialId = userIdentifier;
        budgetFilters.officialId = userIdentifier;
      }

      if (user.role === 'contractor') {
        projectFilters.contractorId = userIdentifier;
      }

      if (user.role === 'citizen') {
        complaintFilters.userId = userIdentifier;
      }

      const [projectsRes, complaintsRes, budgetsRes] = await Promise.all([
        apiClient.getProjects(projectFilters),
        apiClient.getComplaints(complaintFilters),
        apiClient.getBudgets(budgetFilters),
      ]);

      const projectData = Array.isArray(projectsRes.data) ? projectsRes.data : [];
      const complaintData = Array.isArray(complaintsRes.data) ? complaintsRes.data : [];
      const budgetData = Array.isArray(budgetsRes.data) ? budgetsRes.data : [];

      setProjects(projectData.map(mapProject));
      setComplaints(complaintData.map(mapComplaint));
      setBudgets(budgetData.map(mapBudget));

      const projectIds = projectData.map((p: any) => p._id || p.id).filter(Boolean);
      const rtiFilters: Record<string, string> = {};
      if (user.role === 'citizen') {
        rtiFilters.requesterId = userIdentifier;
      } else if (user.role === 'official' && projectIds.length > 0) {
        rtiFilters.projectIds = projectIds.join(',');
      }

      const rtiStatsFilters: Record<string, string> = {};

      const [projectStatsRes, complaintStatsRes, budgetStatsRes, rtiStatsRes, rtiRequestsRes, contractorsRes] = await Promise.all([
        apiClient.getProjectStats(projectFilters),
        apiClient.getComplaintStats(complaintFilters),
        apiClient.getBudgetStats(budgetFilters),
        apiClient.getRTIStats(rtiStatsFilters),
        apiClient.getRTIRequests(rtiFilters),
        user.role === 'official' ? apiClient.getContractors() : Promise.resolve({ data: [] }),
      ]);

      setProjectStats(projectStatsRes.data || null);
      setComplaintStats(complaintStatsRes.data || null);
      setBudgetStats(budgetStatsRes.data || null);
      setRtiStats(rtiStatsRes.data || null);
      const rtiRequestData = Array.isArray(rtiRequestsRes.data) ? rtiRequestsRes.data : [];
      setRtiRequests(rtiRequestData.map(mapRTIRequest));
      setContractors(contractorsRes.data || []);
    } catch (err: any) {
      setDataError(err?.message || 'Failed to load data');
    } finally {
      setIsDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!user) return;

    const intervalId = window.setInterval(() => {
      loadData();
    }, 15000);

    return () => window.clearInterval(intervalId);
  }, [loadData, user]);

  // Backend already supplies risk metrics.

  const handleLogout = () => {
    logout(); // Call auth context logout
    setView('landing');
    setRole(null);
    setUserId(null);
  };

  // Actions
  const addProject = async (project: Project) => {
    if (!user) return;
    try {
      const userIdentifier = user.identificationId || user.id;
      const response = await apiClient.createProject({
        title: project.title,
        description: project.description,
        sector: project.sector,
        budget: project.budget,
        location: project.location,
        startDate: project.startDate,
        endDate: project.endDate,
        department: project.department,
        contractorId: project.contractorId,
        contractorName: project.contractorName,
        officialId: userIdentifier,
      });
      const created = mapProject(response.data);
      setProjects((prev) => [created, ...prev]);
    } catch (err: any) {
      setDataError(err?.message || 'Failed to create project');
    }
  };

  const updateProject = async (id: string, updates: Partial<Project> | FormData) => {
    if (!user) return;
    try {
      const statusFields = ['status', 'progress', 'expenses', 'resourceUsage'];
      const updateKeys = updates instanceof FormData ? Array.from(updates.keys()) : Object.keys(updates);
      const hasOnlyStatusFields = updateKeys.every((key) => statusFields.includes(key));
      const isStatusUpdate =
        hasOnlyStatusFields &&
        (updates instanceof FormData ||
          typeof (updates as any).progress === 'number' ||
          typeof (updates as any).expenses === 'number' ||
          typeof (updates as any).resourceUsage === 'string' ||
          typeof (updates as any).status === 'string');

      const response = isStatusUpdate
        ? await apiClient.updateProjectStatus(
            id,
            updates instanceof FormData
              ? updates
              : {
                  status: updates.status,
                  progress: updates.progress,
                  expenses: updates.expenses,
                  resourceUsage: updates.resourceUsage,
                }
          )
        : await apiClient.updateProject(id, {
            title: (updates as any).title,
            description: (updates as any).description,
            sector: (updates as any).sector,
            budget: (updates as any).budget,
            spent: (updates as any).spent,
            contractorId: (updates as any).contractorId,
            contractorName: (updates as any).contractorName,
            department: (updates as any).department,
            location: (updates as any).location,
            startDate: (updates as any).startDate,
            endDate: (updates as any).endDate,
            corruptionRisk: (updates as any).corruptionRisk,
            riskFactors: (updates as any).riskFactors,
          });

      const updated = mapProject(response.data);
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch (err: any) {
      setDataError(err?.message || 'Failed to update project');
    }
  };

  const addComplaint = async (complaint: Complaint | FormData) => {
    if (!user) return;
    try {
      const userIdentifier = user.identificationId || user.id;
      const payload = complaint instanceof FormData
        ? complaint
        : {
            userId: userIdentifier,
            userName: user.fullName,
            projectId: complaint.projectId,
            projectName: complaint.projectName,
            category: mapComplaintCategoryToApi(complaint.category),
            description: complaint.description,
            location: complaint.location,
          };

      if (payload instanceof FormData) {
        payload.set('userId', userIdentifier);
        payload.set('userName', user.fullName);
      }

      const response = await apiClient.createComplaint(payload);
      const created = mapComplaint(response.data);
      setComplaints((prev) => [created, ...prev]);
      await loadData();
    } catch (err: any) {
      setDataError(err?.message || 'Failed to file complaint');
    }
  };

  const updateComplaint = async (id: string, updates: Partial<Complaint> | FormData) => {
    try {
      const payload = updates instanceof FormData
        ? updates
        : {
            status: updates.status,
            priority: updates.priority,
            resolution: updates.resolution,
            description: updates.description,
            location: updates.location,
            category: updates.category,
            imageUrl: updates.imageUrl,
          };

      const response = await apiClient.updateComplaintStatus(id, payload);
      const updated = mapComplaint(response.data);
      setComplaints((prev) => prev.map((c) => (c.id === id ? updated : c)));
      await loadData();
    } catch (err: any) {
      setDataError(err?.message || 'Failed to update complaint');
    }
  };

  const updateBudget = async (id: string, updates: Partial<BudgetAllocation>) => {
    try {
      const response = await apiClient.updateBudget(id, {
        allocatedAmount: updates.allocatedAmount,
        totalAmount: updates.totalAmount,
        year: updates.year,
        sector: updates.sector,
      });
      const updated = mapBudget(response.data);
      setBudgets((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (err: any) {
      setDataError(err?.message || 'Failed to update budget');
    }
  };

  const renderContent = () => {
    if (activeTab === 'transparency') {
      return <RTIPortal projects={projects} rtiStats={rtiStats} rtiRequests={rtiRequests} complaintStats={complaintStats} />;
    }
    if (activeTab === 'community') {
      return <Community projects={projects} />;
    }
    if (activeTab === 'info') {
      return <PlatformInfo />;
    }
    
    switch (role) {
      case 'citizen':
        return (
          <CitizenDashboard 
            userId={userId}
            projects={projects} 
            budgets={budgets} 
            complaints={complaints.filter(c => c.userId === userId)}
            onAddComplaint={addComplaint}
            onUpdateComplaint={updateComplaint}
            projectStats={projectStats}
            complaintStats={complaintStats}
            budgetStats={budgetStats}
          />
        );
      case 'official':
        return (
            <OfficialDashboard 
              projects={projects} 
              budgets={budgets} 
              complaints={complaints}
              onUpdateProject={updateProject}
              onAddProject={addProject}
              onUpdateComplaint={updateComplaint}
              onUpdateBudget={updateBudget}
              projectStats={projectStats}
              complaintStats={complaintStats}
              budgetStats={budgetStats}
              contractors={contractors}
            />
        );
      case 'media':
        return <MediaDashboard projects={projects} rtiStats={rtiStats} rtiRequests={rtiRequests} complaints={complaints} onUpdateComplaint={updateComplaint} />;
      case 'contractor':
        return (
          <ContractorDashboard 
            projects={projects.filter(p => p.contractorId === userId)} 
            onUpdateProject={updateProject}
          />
        );
      default:
        return <CitizenDashboard userId={userId} projects={projects} budgets={budgets} complaints={[]} onAddComplaint={addComplaint} />;
    }
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-gov-bg text-gov-blue selection:bg-gov-saffron/30">
      {/* Subtle Flag Gradient Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gov-saffron" />
        <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white" />
        <div className="absolute top-2/3 left-0 w-full h-1/3 bg-gov-green" />
      </div>

      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPageWithAuth />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex"
          >
            {isDataLoading && (
              <div className="fixed inset-0 z-[200] bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <div className="bg-white rounded-lg p-6 shadow-xl text-gov-blue font-semibold">
                  Loading live data...
                </div>
              </div>
            )}
            {role && (
              <>
                <Sidebar 
                  role={role} 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                />
                <div className="flex-1">
                  <Navbar role={role} />
                  <main className="min-h-screen pt-28 pb-24 lg:pl-64 lg:pt-20 lg:pb-0">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:p-8">
                      {dataError && (
                        <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
                          {dataError}
                        </div>
                      )}
                      <div className="mb-8 gov-card bg-white p-4 sm:p-6">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start gap-4">
                          <div className="p-3 rounded-xl bg-gov-blue/5 text-gov-blue">
                            <ShieldAlert className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gov-blue/40">Official Secure Session</p>
                            <p className="text-sm sm:text-lg text-gov-blue font-bold">
                              Welcome back, <span className="text-gov-saffron capitalize">{role}</span>
                              <span className="ml-2 block sm:inline text-[10px] text-gov-blue/30 font-mono">({userId})</span>
                            </p>
                          </div>
                          </div>
                          <button 
                            onClick={handleLogout}
                            className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all text-xs font-bold uppercase tracking-widest border border-red-100 w-full sm:w-auto"
                          >
                            <LogOut className="w-4 h-4" />
                            Terminate Session
                          </button>
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${role}-${activeTab}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {renderContent()}
                        </motion.div>
                      </AnimatePresence>

                      <footer className="mt-16 sm:mt-24 pt-10 sm:pt-12 pb-6 sm:pb-12 border-t border-gov-blue/10">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                          <div className="flex items-center gap-4 sm:gap-6">
                            <div className="w-12 h-12 rounded-full bg-gov-blue flex items-center justify-center text-white">
                              <ShieldAlert className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-display font-bold text-gov-blue uppercase tracking-[0.2em]">Civic Integrity AI</h4>
                              <p className="text-xs text-gov-blue/40">National Smart Governance Initiative • Ministry of Transparency</p>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-12 text-left sm:text-right w-full md:w-auto">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gov-saffron mb-1">Right to Information</p>
                              <p className="text-xs text-gov-blue/60 font-medium">Section 4(1)(b) Compliance Dashboard</p>
                            </div>
                            <div className="hidden sm:block w-px h-10 bg-gov-blue/10" />
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full bg-gov-green animate-pulse" />
                              <span className="text-[10px] font-bold text-gov-green uppercase tracking-widest">System Online</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-12 pt-8 border-t border-gov-blue/5 text-center">
                          <p className="text-[10px] text-gov-blue/30 uppercase tracking-[0.5em]">Satyameva Jayate</p>
                        </div>
                      </footer>
                    </div>
                  </main>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Wrapper component with AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
