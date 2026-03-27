/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole, Project, BudgetAllocation, Complaint } from './types';
import { MOCK_PROJECTS, MOCK_BUDGETS, MOCK_COMPLAINTS } from './constants';
import { Sidebar, Navbar } from './components/Layout';
import { CitizenDashboard } from './components/CitizenDashboard';
import { OfficialDashboard } from './components/OfficialDashboard';
import { MediaDashboard } from './components/MediaDashboard';
import { ContractorDashboard } from './components/ContractorDashboard';
import { LandingPage } from './components/LandingPage';
import { RTIPortal } from './components/RTIPortal';
import { Community } from './components/Community';
import { PlatformInfo } from './components/PlatformInfo';
import { ShieldAlert, Info, LogOut, Users, UserPlus } from 'lucide-react';
import { cn } from './lib/utils';

type ViewState = 'landing' | 'login' | 'dashboard';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [role, setRole] = useState<UserRole | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);

  // Global State
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [budgets, setBudgets] = useState<BudgetAllocation[]>(MOCK_BUDGETS);
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // AI Analysis Simulation
  useEffect(() => {
    const analyzeProjects = () => {
      setProjects(prev => prev.map(p => {
        let risk: 'low' | 'medium' | 'high' = 'low';
        const factors: string[] = [];

        if (p.spent > p.budget) {
          risk = 'high';
          factors.push('Overspending detected');
        } else if (p.progress < 50 && new Date(p.endDate) < new Date()) {
          risk = 'high';
          factors.push('Critical delay risk');
        } else if (p.citizenFeedback.some(f => f.rating <= 2)) {
          risk = 'medium';
          factors.push('Poor citizen feedback');
        }

        return { ...p, corruptionRisk: risk, riskFactors: factors };
      }));
    };

    analyzeProjects();
  }, [projects.length, projects.map(p => p.spent).join(','), projects.map(p => p.progress).join(',')]);

  const handleLogin = (selectedRole: UserRole, id: string) => {
    setRole(selectedRole);
    setUserId(id);
    setView('dashboard');
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setView('landing');
    setRole(null);
    setUserId(null);
  };

  // Actions
  const addProject = (project: Project) => setProjects([...projects, project]);
  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
  };
  const addComplaint = (complaint: Complaint) => setComplaints([complaint, ...complaints]);
  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(complaints.map(c => c.id === id ? { ...c, ...updates } : c));
  };
  const updateBudget = (id: string, updates: Partial<BudgetAllocation>) => {
    setBudgets(budgets.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const renderContent = () => {
    if (activeTab === 'transparency') {
      return <RTIPortal projects={projects} />;
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
          />
        );
      case 'media':
        return <MediaDashboard projects={projects} />;
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
            <LandingPage 
              onLogin={handleLogin} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex"
          >
            {role && (
              <>
                <Sidebar 
                  role={role} 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                />
                <div className="flex-1">
                  <Navbar role={role} />
                  <main className="pl-64 pt-20 min-h-screen">
                    <div className="p-8 max-w-7xl mx-auto">
                      <div className="mb-8 flex items-center justify-between p-6 gov-card bg-white">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gov-blue/5 text-gov-blue">
                            <ShieldAlert className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gov-blue/40">Official Secure Session</p>
                            <p className="text-lg text-gov-blue font-bold">
                              Welcome back, <span className="text-gov-saffron capitalize">{role}</span>
                              <span className="ml-2 text-[10px] text-gov-blue/30 font-mono">({userId})</span>
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={handleLogout}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all text-xs font-bold uppercase tracking-widest border border-red-100"
                        >
                          <LogOut className="w-4 h-4" />
                          Terminate Session
                        </button>
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

                      <footer className="mt-24 pt-12 pb-12 border-t border-gov-blue/10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                          <div className="flex items-center gap-6">
                            <div className="w-12 h-12 rounded-full bg-gov-blue flex items-center justify-center text-white">
                              <ShieldAlert className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="font-display font-bold text-gov-blue uppercase tracking-[0.2em]">Civic Integrity AI</h4>
                              <p className="text-xs text-gov-blue/40">National Smart Governance Initiative • Ministry of Transparency</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-12 text-right">
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-gov-saffron mb-1">Right to Information</p>
                              <p className="text-xs text-gov-blue/60 font-medium">Section 4(1)(b) Compliance Dashboard</p>
                            </div>
                            <div className="w-px h-10 bg-gov-blue/10" />
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
