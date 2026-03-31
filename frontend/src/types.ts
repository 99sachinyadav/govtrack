/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'citizen' | 'official' | 'media' | 'contractor';

export interface Project {
  id: string;
  title: string;
  description: string;
  sector: 'infrastructure' | 'welfare' | 'procurement' | 'delivery' | 'healthcare' | 'education' | 'agriculture' | 'energy' | 'sanitation';
  budget: number;
  spent: number;
  status: 'sanctioned' | 'in-progress' | 'completed' | 'delayed' | 'on-hold';
  contractorId: string;
  contractorName: string;
  department: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  startDate: string;
  endDate: string;
  progress: number;
  corruptionRisk: 'low' | 'medium' | 'high';
  riskFactors?: string[];
  citizenFeedback: Feedback[];
  performanceScore: number;
  resourceUsage?: string;
  expenses?: number;
  proofUrl?: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  rating: number;
  imageUrl?: string;
  timestamp: string;
  verified: boolean;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  projectId?: string;
  projectName?: string;
  category: 'quality' | 'delay' | 'corruption' | 'safety' | 'other' | 'budget-misuse' | 'quality-issue' | 'corruption-suspicion';
  description: string;
  imageUrl?: string;
  status: 'pending' | 'in-review' | 'resolved' | 'escalated' | 'rejected';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  resolution?: string;
  timestamp: string;
  location?: string;
  aiAnalysis?: {
    summary?: string;
    officialDescription?: string;
    riskPercentage?: number;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    confidence?: number;
    observations?: string[];
    recommendedActions?: string[];
    status?: 'pending' | 'completed' | 'failed' | 'skipped';
    analyzedAt?: string;
    model?: string;
    error?: string;
  };
}

export interface BudgetAllocation {
  id: string;
  sector: string;
  totalAmount: number;
  allocatedAmount: number;
  year: string;
}

export interface RTIRequest {
  id: string;
  title: string;
  description: string;
  requesterId: string;
  requesterName?: string;
  requesterEmail?: string;
  projectId?: string;
  status: 'pending' | 'in-review' | 'approved' | 'partially-approved' | 'rejected';
  priority?: 'normal' | 'urgent';
  submittedAt?: string;
  responseDocument?: string;
  denialReason?: string;
}

export interface CommunityComment {
  id: string;
  authorId?: string;
  authorName: string;
  text: string;
  createdAt?: string;
}

export interface CommunityPost {
  id: string;
  authorId?: string;
  authorName: string;
  authorRole?: UserRole | string;
  content: string;
  location?: string;
  imageUrl?: string;
  videoUrl?: string;
  likes: number;
  likedBy?: string[];
  comments: CommunityComment[];
  createdAt?: string;
}
