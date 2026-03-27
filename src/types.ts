/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'citizen' | 'official' | 'media' | 'contractor';

export interface Project {
  id: string;
  title: string;
  description: string;
  sector: 'infrastructure' | 'welfare' | 'procurement' | 'delivery';
  budget: number;
  spent: number;
  status: 'sanctioned' | 'in-progress' | 'completed' | 'delayed';
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
  category: 'quality' | 'delay' | 'corruption' | 'safety' | 'other';
  description: string;
  imageUrl?: string;
  status: 'pending' | 'in-review' | 'resolved' | 'escalated';
  resolution?: string;
  timestamp: string;
  location?: string;
}

export interface BudgetAllocation {
  id: string;
  sector: string;
  totalAmount: number;
  allocatedAmount: number;
  year: string;
}
