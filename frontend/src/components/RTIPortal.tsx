import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldAlert, 
  FileText, 
  Download, 
  Search, 
  Info, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { Project, RTIRequest } from '../types';
import { formatCurrency, cn } from '../lib/utils';

interface RTIPortalProps {
  projects: Project[];
  rtiStats?: any;
  rtiRequests?: RTIRequest[];
  complaintStats?: any;
}

export const RTIPortal: React.FC<RTIPortalProps> = ({ projects, rtiStats, rtiRequests = [], complaintStats }) => {
  const derivedTotal = rtiRequests.length;
  const derivedPending = rtiRequests.filter((r) => r.status === 'pending' || r.status === 'in-review').length;
  const derivedResolved = rtiRequests.filter((r) => r.status === 'approved' || r.status === 'rejected').length;
  const derivedAppeals = rtiRequests.filter((r) => r.status === 'rejected').length;
  const totalRequests = complaintStats?.totalComplaints ?? rtiStats?.totalRequests ?? derivedTotal;
  const resolvedRequests =
    complaintStats?.resolvedComplaints ??
    rtiStats?.resolvedRequests ??
    ((rtiStats?.approvedRequests ?? 0) + (rtiStats?.rejectedRequests ?? 0)) ??
    derivedResolved;
  const pendingRequests = complaintStats?.pendingComplaints ?? rtiStats?.pendingRequests ?? derivedPending;
  const appealRequests =
    complaintStats?.escalatedComplaints ??
    rtiStats?.appealRequests ??
    rtiStats?.rejectedRequests ??
    derivedAppeals;
  const projectMap = new Map<string, Project>(projects.map((p) => [p.id, p]));

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold text-gov-blue mb-2 tracking-tight">Right to Information Portal</h2>
          <p className="text-gov-blue/50 font-medium">Public access to government records and project audits.</p>
        </div>
        <div className="flex gap-3">
          <button className="gov-button-secondary text-xs flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Annual Audit
          </button>
          <button className="gov-button-primary text-xs">File New RTI Request</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="gov-card p-6 bg-white">
            <h3 className="text-lg font-display font-bold text-gov-blue mb-4">RTI Statistics</h3>
            <div className="space-y-4">
              {[
                { label: 'Total Requests', value: totalRequests.toString(), icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'Resolved', value: resolvedRequests.toString(), icon: CheckCircle2, color: 'text-gov-green', bg: 'bg-gov-green/5' },
                { label: 'Pending', value: pendingRequests.toString(), icon: Clock, color: 'text-gov-saffron', bg: 'bg-gov-saffron/5' },
                { label: 'Appeals', value: appealRequests.toString(), icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-3 rounded-xl bg-gov-bg border border-gov-blue/5">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", stat.bg)}>
                      <stat.icon className={cn("w-4 h-4", stat.color)} />
                    </div>
                    <span className="text-xs text-gov-blue/60 font-bold">{stat.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gov-blue">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="gov-card p-6 bg-gov-blue text-white">
            <h3 className="text-lg font-display font-bold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-gov-saffron" />
              Section 4(1)(b)
            </h3>
            <p className="text-xs text-white/70 leading-relaxed font-light">
              Every public authority shall maintain all its records duly catalogued and indexed in a manner and the form which facilitates the right to information.
            </p>
            <button className="mt-6 text-[10px] font-bold uppercase tracking-widest text-gov-saffron flex items-center gap-2 hover:underline">
              Read Full Act <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-3 gov-card p-8 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <h3 className="text-xl font-display font-bold text-gov-blue">Public Record Database</h3>
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gov-blue/30" />
              <input 
                type="text" 
                placeholder="Search records by ID, Title or Dept..." 
                className="gov-input py-2 pl-10 pr-4 text-xs"
              />
            </div>
          </div>

          <div className="space-y-4">
            {rtiRequests.length === 0 && projects.length > 0 && projects.map((project) => (
              <div key={project.id} className="p-6 rounded-2xl bg-gov-bg border border-gov-blue/5 hover:border-gov-blue/20 transition-all group">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded bg-gov-blue/10 text-[10px] font-bold text-gov-blue uppercase tracking-widest">{project.department}</span>
                      <span className="w-1 h-1 rounded-full bg-gov-blue/20" />
                      <span className="text-[10px] text-gov-blue/40 font-bold uppercase tracking-widest">ID: RTI-{project.id}982</span>
                    </div>
                    <h4 className="text-lg font-bold text-gov-blue group-hover:text-gov-saffron transition-colors">{project.title}</h4>
                  </div>
                  <button className="p-2.5 rounded-xl bg-white border border-gov-blue/10 hover:bg-gov-blue hover:text-white transition-all shadow-sm">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div>
                    <p className="text-[10px] text-gov-blue/40 font-bold uppercase tracking-widest mb-1">Sanctioned Date</p>
                    <p className="text-xs font-bold text-gov-blue">{project.startDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gov-blue/40 font-bold uppercase tracking-widest mb-1">Total Budget</p>
                    <p className="text-xs font-bold text-gov-blue">{formatCurrency(project.budget)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gov-blue/40 font-bold uppercase tracking-widest mb-1">Contractor</p>
                    <p className="text-xs font-bold text-gov-blue">{project.contractorName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gov-blue/40 font-bold uppercase tracking-widest mb-1">Current Status</p>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        project.status === 'completed' ? 'bg-gov-green' : 'bg-gov-saffron'
                      )} />
                      <p className="text-xs font-bold text-gov-blue capitalize">{project.status}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-6 border-t border-gov-blue/10">
                  <button className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/60 hover:text-gov-blue transition-colors flex items-center gap-2">
                    View Full Audit Trail <ExternalLink className="w-3 h-3" />
                  </button>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/60 hover:text-gov-blue transition-colors flex items-center gap-2">
                    Download Vouchers <Download className="w-3 h-3" />
                  </button>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/60 hover:text-gov-blue transition-colors flex items-center gap-2">
                    Contractor Agreement <FileText className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}

            {rtiRequests.map((request) => {
              const project = request.projectId ? projectMap.get(request.projectId) : undefined;
              const requestDate = request.submittedAt ? new Date(request.submittedAt).toLocaleDateString() : '—';
              return (
              <div key={request.id} className="p-6 rounded-2xl bg-gov-bg border border-gov-blue/5 hover:border-gov-blue/20 transition-all group">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded bg-gov-blue/10 text-[10px] font-bold text-gov-blue uppercase tracking-widest">{project?.department || 'RTI'}</span>
                      <span className="w-1 h-1 rounded-full bg-gov-blue/20" />
                      <span className="text-[10px] text-gov-blue/40 font-bold uppercase tracking-widest">ID: {request.id}</span>
                    </div>
                    <h4 className="text-lg font-bold text-gov-blue group-hover:text-gov-saffron transition-colors">{request.title}</h4>
                  </div>
                  <button className="p-2.5 rounded-xl bg-white border border-gov-blue/10 hover:bg-gov-blue hover:text-white transition-all shadow-sm">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div>
                    <p className="text-[10px] text-gov-blue/40 font-bold uppercase tracking-widest mb-1">Sanctioned Date</p>
                    <p className="text-xs font-bold text-gov-blue">{requestDate}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gov-blue/40 font-bold uppercase tracking-widest mb-1">Total Budget</p>
                    <p className="text-xs font-bold text-gov-blue">{project ? formatCurrency(project.budget) : '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gov-blue/40 font-bold uppercase tracking-widest mb-1">Contractor</p>
                    <p className="text-xs font-bold text-gov-blue">{project?.contractorName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gov-blue/40 font-bold uppercase tracking-widest mb-1">Current Status</p>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        request.status === 'approved' ? 'bg-gov-green' : request.status === 'rejected' ? 'bg-red-500' : 'bg-gov-saffron'
                      )} />
                      <p className="text-xs font-bold text-gov-blue capitalize">{request.status}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-6 border-t border-gov-blue/10">
                  <button className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/60 hover:text-gov-blue transition-colors flex items-center gap-2">
                    View Full Audit Trail <ExternalLink className="w-3 h-3" />
                  </button>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/60 hover:text-gov-blue transition-colors flex items-center gap-2">
                    Download Vouchers <Download className="w-3 h-3" />
                  </button>
                  <button className="text-[10px] font-bold uppercase tracking-widest text-gov-blue/60 hover:text-gov-blue transition-colors flex items-center gap-2">
                    Contractor Agreement <FileText className="w-3 h-3" />
                  </button>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
