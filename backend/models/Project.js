import mongoose from 'mongoose';

const projectStatusUpdateSchema = new mongoose.Schema({
  updatedById: String,
  updatedByName: String,
  updatedByRole: {
    type: String,
    enum: ['official', 'contractor', 'system', 'citizen', 'media'],
    default: 'system',
  },
  previousStatus: String,
  status: {
    type: String,
    enum: ['sanctioned', 'in-progress', 'completed', 'delayed', 'on-hold'],
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
  },
  expenses: {
    type: Number,
    min: 0,
  },
  resourceUsage: String,
  contractorNote: String,
  proofUrl: String,
  aiDescription: {
    summary: String,
    officialDescription: String,
    observations: [String],
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'skipped'],
      default: 'skipped',
    },
    analyzedAt: Date,
    model: String,
    error: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { _id: true });

const projectSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Please provide a project title'],
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  sector: {
    type: String,
    enum: [
      'healthcare',
      'education',
      'infrastructure',
      'agriculture',
      'energy',
      'sanitation',
      'welfare',
      'procurement',
      'delivery',
    ],
    required: true,
  },
  
  // Budget & Finance
  budget: {
    type: Number,
    required: true,
    min: 0,
  },
  spent: {
    type: Number,
    default: 0,
    min: 0,
  },
  
  // Status & Progress
  status: {
    type: String,
    enum: ['sanctioned', 'in-progress', 'completed', 'delayed', 'on-hold'],
    default: 'sanctioned',
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  
  // Location
  location: {
    address: String,
    lat: Number,
    lng: Number,
    state: String,
    district: String,
  },
  
  // Dates
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  
  // Contractor Information
  contractorId: {
    type: String,
  },
  contractorName: String,
  
  // Official Information
  officialId: {
    type: String,
  },
  department: String,
  
  // Risk Assessment
  corruptionRisk: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low',
  },
  riskFactors: [String],
  performanceScore: {
    type: Number,
    default: 100,
    min: 0,
    max: 100,
  },
  
  // Citizen Feedback
  citizenFeedback: [{
    userId: mongoose.Schema.Types.ObjectId,
    userName: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }],
  
  // Resource Usage
  resourceUsage: String,
  workCompletion: {
    type: Number,
    default: 0,
  },
  proofUrl: String,
  statusUpdates: [projectStatusUpdateSchema],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
projectSchema.index({ status: 1, corruptionRisk: 1 });
projectSchema.index({ officialId: 1 });
projectSchema.index({ contractorId: 1 });

export default mongoose.model('Project', projectSchema);
