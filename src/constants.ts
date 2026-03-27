import { Project, BudgetAllocation, Complaint } from './types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Smart City Road Infrastructure - Phase 1',
    description: 'Expansion and modernization of the main arterial roads in the central business district.',
    sector: 'infrastructure',
    budget: 50000000,
    spent: 35000000,
    status: 'in-progress',
    contractorId: 'c1',
    contractorName: 'BuildRight Construction Ltd.',
    department: 'Public Works Department',
    location: {
      lat: 28.6139,
      lng: 77.2090,
      address: 'Connaught Place, New Delhi'
    },
    startDate: '2023-01-15',
    endDate: '2024-06-30',
    progress: 70,
    corruptionRisk: 'low',
    citizenFeedback: [
      {
        id: 'f1',
        userId: 'u1',
        userName: 'Rahul Sharma',
        comment: 'Work is progressing well, but traffic management could be better.',
        rating: 4,
        timestamp: '2023-10-05T10:00:00Z',
        verified: true
      }
    ],
    performanceScore: 88
  },
  {
    id: '2',
    title: 'Rural Healthcare Center Modernization',
    description: 'Upgrading 15 rural healthcare centers with modern diagnostic equipment and solar power.',
    sector: 'welfare',
    budget: 12000000,
    spent: 11500000,
    status: 'delayed',
    contractorId: 'c2',
    contractorName: 'MediTech Solutions',
    department: 'Health & Family Welfare',
    location: {
      lat: 26.8467,
      lng: 80.9462,
      address: 'Lucknow Rural District'
    },
    startDate: '2023-03-01',
    endDate: '2023-12-31',
    progress: 95,
    corruptionRisk: 'high',
    riskFactors: ['Abnormal budget increase', 'Repeated deadline extensions'],
    citizenFeedback: [
      {
        id: 'f2',
        userId: 'u2',
        userName: 'Priya Singh',
        comment: 'Equipment arrived but not yet installed. Building looks finished though.',
        rating: 2,
        timestamp: '2024-01-10T14:30:00Z',
        verified: true
      }
    ],
    performanceScore: 45
  },
  {
    id: '3',
    title: 'Digital Literacy Program for Schools',
    description: 'Providing tablets and high-speed internet to 100 government schools.',
    sector: 'delivery',
    budget: 8000000,
    spent: 2000000,
    status: 'sanctioned',
    contractorId: 'c3',
    contractorName: 'EduFuture Systems',
    department: 'Education Department',
    location: {
      lat: 19.0760,
      lng: 72.8777,
      address: 'Mumbai Metropolitan Region'
    },
    startDate: '2024-02-01',
    endDate: '2024-12-31',
    progress: 10,
    corruptionRisk: 'medium',
    citizenFeedback: [],
    performanceScore: 75
  }
];

export const MOCK_BUDGETS: BudgetAllocation[] = [
  { id: 'b1', sector: 'Infrastructure', totalAmount: 1000000000, allocatedAmount: 850000000, year: '2023-24' },
  { id: 'b2', sector: 'Healthcare', totalAmount: 500000000, allocatedAmount: 420000000, year: '2023-24' },
  { id: 'b3', sector: 'Education', totalAmount: 400000000, allocatedAmount: 380000000, year: '2023-24' },
  { id: 'b4', sector: 'Public Welfare', totalAmount: 300000000, allocatedAmount: 290000000, year: '2023-24' }
];

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'c1',
    userId: 'u1',
    userName: 'Rahul Sharma',
    projectId: '1',
    projectName: 'Smart City Road Infrastructure - Phase 1',
    category: 'safety',
    description: 'No proper barricading at the construction site near the main junction. Dangerous for pedestrians.',
    status: 'in-review',
    timestamp: '2024-03-20T09:00:00Z',
    location: 'Connaught Place'
  },
  {
    id: 'c2',
    userId: 'u2',
    userName: 'Priya Singh',
    projectId: '2',
    projectName: 'Rural Healthcare Center Modernization',
    category: 'delay',
    description: 'The center was supposed to be operational by December, but it is still closed.',
    status: 'escalated',
    timestamp: '2024-03-22T11:30:00Z',
    location: 'Lucknow Rural'
  }
];
