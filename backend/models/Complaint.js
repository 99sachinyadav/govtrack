import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  // Complaint Information
  userId: {
    type: String,
    required: true,
  },
  userName: String,
  
  // Project Reference
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  projectName: String,
  
  // Complaint Details
  category: {
    type: String,
    enum: [
      'budget-misuse',
      'quality-issue',
      'delay',
      'corruption-suspicion',
      'other',
      'quality',
      'corruption',
      'safety',
    ],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: String,
  attachments: [String], // File URLs
  aiAnalysis: {
    summary: String,
    officialDescription: String,
    riskPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
    },
    observations: [String],
    recommendedActions: [String],
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'skipped'],
      default: 'pending',
    },
    analyzedAt: Date,
    model: String,
    error: String,
  },
  
  // Status Tracking
  status: {
    type: String,
    enum: ['pending', 'in-review', 'resolved', 'rejected', 'escalated'],
    default: 'pending',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  
  // Resolution
  resolution: String,
  resolvedAt: Date,
  resolvedBy: {
    type: String,
  },
  
  // Timestamps
  timestamp: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  
  // Analytics
  upvotes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
});

complaintSchema.index({ userId: 1, status: 1 });
complaintSchema.index({ projectId: 1 });
complaintSchema.index({ priority: 1, status: 1 });

export default mongoose.model('Complaint', complaintSchema);
