import Complaint from '../models/Complaint.js';
import AuditLog from '../models/AuditLog.js';
import { sendResponse } from '../utils/helpers.js';
import { uploadImageBuffer, isCloudinaryConfigured } from '../utils/cloudinary.js';
import { analyzeComplaintImage } from '../utils/gemini.js';

const buildFallbackAiAnalysis = ({ description, category, error, hasImage }) => ({
  summary: hasImage
    ? 'Evidence image received and queued for official review.'
    : 'No evidence image attached. Manual review required.',
  officialDescription: description || `Citizen grievance submitted under ${category || 'other'} category.`,
  riskPercentage: hasImage ? 42 : 28,
  severity: category === 'safety' ? 'high' : category === 'corruption-suspicion' || category === 'corruption' ? 'high' : 'medium',
  confidence: hasImage ? 45 : 30,
  observations: hasImage
    ? ['Image attached by citizen.', 'Automated review unavailable, manual verification advised.']
    : ['No visual evidence attached.'],
  recommendedActions: [
    'Review the complaint context.',
    'Assign field verification if the issue impacts public safety or project quality.',
  ],
  status: error ? 'failed' : 'skipped',
  analyzedAt: new Date(),
  model: 'fallback-manual-review',
  error,
});

const resolveAiAnalysis = async ({ imageBuffer, mimeType, description, category, projectName, location }) => {
  if (!imageBuffer || !mimeType) {
    return buildFallbackAiAnalysis({
      description,
      category,
      hasImage: false,
    });
  }

  try {
    return await analyzeComplaintImage({
      imageBuffer,
      mimeType,
      description,
      category,
      projectName,
      location,
    });
  } catch (error) {
    console.error('Gemini complaint analysis error:', error);
    return buildFallbackAiAnalysis({
      description,
      category,
      error: error.message,
      hasImage: true,
    });
  }
};

// Get all complaints with filters
export const getComplaints = async (req, res) => {
  try {
    const { status, priority, userId, projectId, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (userId) filter.userId = userId;
    if (projectId) filter.projectId = projectId;
    
    if (search) {
      filter.$or = [
        { description: { $regex: search, $options: 'i' } },
        { projectName: { $regex: search, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(filter)
      .sort({ timestamp: -1 })
      .limit(100);

    return sendResponse(res, 200, true, 'Complaints fetched successfully', complaints);
  } catch (error) {
    console.error('Get complaints error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to fetch complaints');
  }
};

// Get single complaint
export const getComplaintById = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const complaint = await Complaint.findById(complaintId);
    
    if (!complaint) {
      return sendResponse(res, 404, false, 'Complaint not found');
    }

    complaint.views = (complaint.views || 0) + 1;
    await complaint.save();

    return sendResponse(res, 200, true, 'Complaint fetched successfully', complaint);
  } catch (error) {
    console.error('Get complaint error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to fetch complaint');
  }
};

// Create new complaint
export const createComplaint = async (req, res) => {
  try {
    const { userId, userName, projectId, projectName, category, description, location } = req.body;
    let imageUrl = null;
    let aiAnalysis = buildFallbackAiAnalysis({
      description,
      category,
      hasImage: false,
    });
    if (req.file?.buffer) {
      if (!isCloudinaryConfigured()) {
        return sendResponse(res, 500, false, 'Cloudinary is not configured. Please set CLOUDINARY_* env vars.');
      }
      const uploadResult = await uploadImageBuffer(req.file.buffer, 'civic/grievances');
      imageUrl = uploadResult.secure_url;
      aiAnalysis = await resolveAiAnalysis({
        imageBuffer: req.file.buffer,
        mimeType: req.file.mimetype,
        description,
        category,
        projectName,
        location,
      });
    }

    if (!userId || !category || !description) {
      return sendResponse(res, 400, false, 'Missing required fields');
    }

    const newComplaint = new Complaint({
      userId,
      userName,
      projectId,
      projectName,
      category,
      description,
      location,
      attachments: imageUrl ? [imageUrl] : [],
      aiAnalysis,
      status: 'pending',
      priority: aiAnalysis.severity === 'critical' ? 'critical' : aiAnalysis.severity === 'high' ? 'high' : 'medium',
      timestamp: new Date(),
    });

    await newComplaint.save();

    // Log audit trail
    await AuditLog.create({
      userId,
      userRole: 'citizen',
      action: 'complaint.filed',
      resourceType: 'complaint',
      resourceId: newComplaint._id,
      resourceName: `Complaint on ${projectName || 'General'}`,
    });

    return sendResponse(res, 201, true, 'Complaint filed successfully', newComplaint);
  } catch (error) {
    console.error('Create complaint error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to file complaint');
  }
};

// Update complaint status
export const updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status, priority, resolution, description, location, category, attachments, imageUrl } = req.body;
    let uploadedImageUrl = null;
    if (req.file?.buffer) {
      if (!isCloudinaryConfigured()) {
        return sendResponse(res, 500, false, 'Cloudinary is not configured. Please set CLOUDINARY_* env vars.');
      }
      const uploadResult = await uploadImageBuffer(req.file.buffer, 'civic/grievances');
      uploadedImageUrl = uploadResult.secure_url;
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return sendResponse(res, 404, false, 'Complaint not found');
    }

    complaint.status = status || complaint.status;
    complaint.priority = priority || complaint.priority;
    complaint.resolution = resolution || complaint.resolution;
    if (description) complaint.description = description;
    if (location) complaint.location = location;
    if (category) complaint.category = category;
    if (attachments?.length) complaint.attachments = attachments;
    if (imageUrl) complaint.attachments = [imageUrl];
    if (uploadedImageUrl) complaint.attachments = [uploadedImageUrl];

    const nextDescription = description || complaint.description;
    const nextCategory = category || complaint.category;
    const nextLocation = location || complaint.location;
    const nextProjectName = complaint.projectName;

    if (req.file?.buffer) {
      complaint.aiAnalysis = await resolveAiAnalysis({
        imageBuffer: req.file.buffer,
        mimeType: req.file.mimetype,
        description: nextDescription,
        category: nextCategory,
        projectName: nextProjectName,
        location: nextLocation,
      });
    } else if (description || category || location) {
      complaint.aiAnalysis = {
        ...(complaint.aiAnalysis?.toObject?.() || complaint.aiAnalysis || {}),
        officialDescription: nextDescription,
        summary: complaint.aiAnalysis?.summary || 'Complaint details updated. Awaiting evidence review.',
        recommendedActions: complaint.aiAnalysis?.recommendedActions || [
          'Review updated citizen notes.',
          'Confirm whether field inspection is still required.',
        ],
      };
    }

    if (!priority && complaint.aiAnalysis?.severity && ['pending', 'in-review', 'escalated'].includes(status || complaint.status)) {
      complaint.priority = complaint.aiAnalysis.severity === 'critical'
        ? 'critical'
        : complaint.aiAnalysis.severity === 'high'
          ? 'high'
          : complaint.priority;
    }
    
    if (status === 'resolved') {
      complaint.resolvedAt = new Date();
      complaint.resolvedBy = req.user?.userId;
    }

    complaint.updatedAt = new Date();
    await complaint.save();

    // Log audit trail
    await AuditLog.create({
      userId: req.user?.userId,
      userRole: req.user?.role,
      action: 'complaint.resolved',
      resourceType: 'complaint',
      resourceId: complaintId,
      changes: { after: { status, resolution } },
    });

    return sendResponse(res, 200, true, 'Complaint updated successfully', complaint);
  } catch (error) {
    console.error('Update complaint error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to update complaint');
  }
};

// Upvote complaint
export const upvoteComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return sendResponse(res, 404, false, 'Complaint not found');
    }

    complaint.upvotes = (complaint.upvotes || 0) + 1;
    await complaint.save();

    return sendResponse(res, 200, true, 'Upvote added successfully', complaint);
  } catch (error) {
    console.error('Upvote error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to upvote complaint');
  }
};

// Delete complaint
export const deleteComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const complaint = await Complaint.findByIdAndDelete(complaintId);

    if (!complaint) {
      return sendResponse(res, 404, false, 'Complaint not found');
    }

    // Log audit trail
    await AuditLog.create({
      userId: req.user?.userId,
      userRole: req.user?.role,
      action: 'complaint.deleted',
      resourceType: 'complaint',
      resourceId: complaintId,
    });

    return sendResponse(res, 200, true, 'Complaint deleted successfully');
  } catch (error) {
    console.error('Delete complaint error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to delete complaint');
  }
};

// Get complaint statistics
export const getComplaintStats = async (req, res) => {
  try {
    const { userId, projectId } = req.query;
    const baseFilter = {};

    if (userId) baseFilter.userId = userId;
    if (projectId) baseFilter.projectId = projectId;

    const totalComplaints = await Complaint.countDocuments(baseFilter);
    const pendingComplaints = await Complaint.countDocuments({
      ...baseFilter,
      status: { $in: ['pending', 'in-review'] },
    });
    const resolvedComplaints = await Complaint.countDocuments({
      ...baseFilter,
      status: 'resolved',
    });
    const escalatedComplaints = await Complaint.countDocuments({
      ...baseFilter,
      status: 'escalated',
    });
    const criticalComplaints = await Complaint.countDocuments({
      ...baseFilter,
      priority: 'critical',
    });

    const stats = {
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      escalatedComplaints,
      criticalComplaints,
      resolutionRate: totalComplaints > 0 ? (resolvedComplaints / totalComplaints * 100).toFixed(2) : '0.00',
    };

    return sendResponse(res, 200, true, 'Stats fetched successfully', stats);
  } catch (error) {
    console.error('Get stats error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to fetch stats');
  }
};
