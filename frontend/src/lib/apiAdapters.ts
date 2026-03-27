import { BudgetAllocation, Complaint, Feedback, Project, RTIRequest } from '../types';

const safeDate = (value: any) => {
  if (!value) return new Date().toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
};

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const fileBase = apiBase.replace(/\/api\/?$/, '');
const resolveUploadUrl = (value?: string) => {
  if (!value) return value;
  return value.startsWith('/uploads/') ? `${fileBase}${value}` : value;
};

const mapSector = (sector: string | undefined): Project['sector'] => {
  switch (sector) {
    case 'infrastructure':
    case 'welfare':
    case 'procurement':
    case 'delivery':
    case 'healthcare':
    case 'education':
    case 'agriculture':
    case 'energy':
    case 'sanitation':
      return sector;
    default:
      return 'infrastructure';
  }
};

const mapComplaintCategory = (category: string | undefined): Complaint['category'] => {
  switch (category) {
    case 'quality':
    case 'delay':
    case 'corruption':
    case 'safety':
    case 'other':
    case 'budget-misuse':
    case 'quality-issue':
    case 'corruption-suspicion':
      return category;
    default:
      return 'other';
  }
};

const mapComplaintStatus = (status: string | undefined): Complaint['status'] => {
  switch (status) {
    case 'pending':
    case 'in-review':
    case 'resolved':
    case 'escalated':
    case 'rejected':
      return status;
    default:
      return 'pending';
  }
};

export const mapProject = (project: any): Project => {
  const feedback: Feedback[] = (project.citizenFeedback || []).map((item: any, index: number) => ({
    id: item.id || item._id || `${project._id || project.id}-feedback-${index}`,
    userId: item.userId || 'anonymous',
    userName: item.userName || 'Anonymous',
    comment: item.comment || '',
    rating: item.rating || 0,
    timestamp: safeDate(item.timestamp),
    verified: true,
  }));

  return {
    id: project._id || project.id,
    title: project.title || 'Untitled Project',
    description: project.description || '',
    sector: mapSector(project.sector),
    budget: project.budget || 0,
    spent: project.spent || 0,
    status: project.status || 'sanctioned',
    contractorId: project.contractorId || '',
    contractorName: project.contractorName || 'Unassigned',
    department: project.department || '',
    location: {
      lat: project.location?.lat || 0,
      lng: project.location?.lng || 0,
      address: project.location?.address || 'Unknown',
    },
    startDate: safeDate(project.startDate),
    endDate: safeDate(project.endDate),
    progress: project.progress || 0,
    corruptionRisk: project.corruptionRisk || 'low',
    riskFactors: project.riskFactors || [],
    citizenFeedback: feedback,
    performanceScore: project.performanceScore || 100,
    resourceUsage: project.resourceUsage,
    expenses: project.spent || 0,
    proofUrl: project.proofUrl,
  };
};

export const mapComplaint = (complaint: any): Complaint => ({
  id: complaint._id || complaint.id,
  userId: complaint.userId || 'anonymous',
  userName: complaint.userName || 'Anonymous',
  projectId: complaint.projectId,
  projectName: complaint.projectName,
  category: mapComplaintCategory(complaint.category),
  description: complaint.description || '',
  imageUrl: resolveUploadUrl(complaint.imageUrl || complaint.attachments?.[0]),
  status: mapComplaintStatus(complaint.status),
  priority: complaint.priority || 'medium',
  resolution: complaint.resolution,
  timestamp: safeDate(complaint.timestamp || complaint.createdAt),
  location: complaint.location,
});

export const mapBudget = (budget: any): BudgetAllocation => ({
  id: budget._id || budget.id,
  sector: budget.sector || budget.title || budget.category || 'General',
  totalAmount: budget.totalAmount || budget.allocatedAmount || budget.utilizedAmount || 0,
  allocatedAmount: budget.allocatedAmount || 0,
  year: budget.year || budget.fiscalYear || 'N/A',
});

export const mapRTIRequest = (request: any): RTIRequest => ({
  id: request._id || request.id,
  title: request.title || 'RTI Request',
  description: request.description || '',
  requesterId: request.requesterId,
  requesterName: request.requesterName,
  requesterEmail: request.requesterEmail,
  projectId: request.projectId,
  status: request.status || 'pending',
  priority: request.priority || 'normal',
  submittedAt: safeDate(request.submittedAt || request.createdAt),
  responseDocument: request.responseDocument,
  denialReason: request.denialReason,
});

export const mapComplaintCategoryToApi = (category: Complaint['category']) => {
  switch (category) {
    case 'quality':
      return 'quality-issue';
    case 'corruption':
      return 'corruption-suspicion';
    default:
      return category;
  }
};
