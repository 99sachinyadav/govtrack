import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  ShieldAlert, 
  FileText, 
  Settings, 
  Bell, 
  Search,
  Info,
  Globe,
  MessageSquare,
  Newspaper,
  Building2,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  role: UserRole;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transparency', label: 'RTI Portal', icon: FileText },
    { id: 'community', label: 'Community', icon: Globe },
    { id: 'info', label: 'Platform Info', icon: Info },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 z-50 flex flex-col shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10 group cursor-pointer">
          <div className="w-10 h-10 rounded-lg bg-gov-blue flex items-center justify-center text-white shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-sm font-bold text-gov-blue uppercase tracking-wider">Civic Integrity</span>
            <span className="block text-[10px] font-bold text-gov-saffron uppercase tracking-[0.2em]">Government of India</span>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                activeTab === item.id 
                  ? "bg-gov-blue/5 text-gov-blue border-l-4 border-gov-blue" 
                  : "text-slate-500 hover:text-gov-blue hover:bg-slate-50 border-l-4 border-transparent"
              )}
            >
              <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-gov-blue" : "text-slate-400")} />
              <span className="text-sm font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gov-green/10 flex items-center justify-center text-gov-green">
              <UserCheck className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gov-green">Verified Portal</p>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
            Official platform for public project oversight and accountability.
          </p>
        </div>
      </div>
    </div>
  );
};

interface NavbarProps {
  role: UserRole;
}

export const Navbar: React.FC<NavbarProps> = ({ role }) => {
  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-slate-200 z-40 px-8 shadow-sm">
      <div className="h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-gov-blue transition-colors" />
            <input 
              type="text" 
              placeholder="Search RTI, projects, or officials..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-gov-blue/10 focus:border-gov-blue outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="relative p-2 rounded-lg text-slate-400 hover:text-gov-blue hover:bg-slate-50 transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gov-saffron rounded-full border-2 border-white" />
          </button>
          
          <div className="h-6 w-[1px] bg-slate-200" />
          
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">Rahul Sharma</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{role}</p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
              <Users className="w-5 h-5 text-gov-blue" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
