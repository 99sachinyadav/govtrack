import Project from '../models/Project.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import { sendResponse } from '../utils/helpers.js';
import { uploadImageBuffer, isCloudinaryConfigured } from '../utils/cloudinary.js';

const normalizeStatus = (status) => {
  // hello
  if (!status || typeof status !== 'string') return status;
  const normalized = status.trim().toLowerCase().replace(/\s+/g, '-');
  switch (normalized) {
    case 'inprogress':
    case 'in-progress':
    case 'active':
      return 'in-progress';
    case 'onhold':
    case 'on-hold':
      return 'on-hold';
    default:
      return normalized;
  }
};

// Get all projects with filters
export const getProjects = async (req, res) => {
  try {
    const { status, sector, risk, officialId, contractorId, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (sector) filter.sector = sector;
    if (risk) filter.corruptionRisk = risk;
    if (officialId) filter.officialId = officialId;
    if (contractorId) filter.contractorId = contractorId;
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { contractorName: { $regex: search, $options: 'i' } },
      ];
    }

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);

    return sendResponse(res, 200, true, 'Projects fetched successfully', projects);
  } catch (error) {
    console.error('Get projects error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to fetch projects');
  }
};

// Get single project by ID
export const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    
    if (!project) {
      return sendResponse(res, 404, false, 'Project not found');
    }

    return sendResponse(res, 200, true, 'Project fetched successfully', project);
  } catch (error) {
    console.error('Get project error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to fetch project');
  }
};

// Create new project
export const createProject = async (req, res) => {
  try {
    const { title, description, sector, budget, location, startDate, endDate, department, officialId, contractorId, contractorName } = req.body;

    // Validate required fields
    if (!title || !description || !sector || !budget) {
      return sendResponse(res, 400, false, 'Missing required fields');
    }

    const locationData = typeof location === 'string' ? { address: location } : (location || {});

    let resolvedContractorName = contractorName;
    if (contractorId) {
      const contractorUser = await User.findOne({ identificationId: contractorId, role: 'contractor' })
        .select('fullName contractor')
        .lean();
      if (!contractorUser) {
        return sendResponse(res, 400, false, 'Invalid contractor ID');
      }
      resolvedContractorName = contractorUser.contractor?.companyName || contractorUser.fullName;
    }

    const newProject = new Project({
      title,
      description,
      sector,
      budget,
      location: {
        address: locationData.address,
        lat: locationData.lat,
        lng: locationData.lng,
      },
      startDate,
      endDate,
      department,
      officialId: officialId || req.user?.userId,
      contractorId,
      contractorName: resolvedContractorName,
      status: 'sanctioned',
      progress: 0,
    });

    await newProject.save();

    // Log audit trail
    await AuditLog.create({
      userId: req.user?.userId,
      userRole: 'official',
      action: 'project.created',
      resourceType: 'project',
      resourceId: newProject._id,
      resourceName: newProject.title,
    });

    return sendResponse(res, 201, true, 'Project created successfully', newProject);
  } catch (error) {
    console.error('Create project error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to create project');
  }
};

// Update project
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const updates = req.body;

    if (updates.status) {
      updates.status = normalizeStatus(updates.status);
    }

    if (updates.contractorId) {
      const contractorUser = await User.findOne({ identificationId: updates.contractorId, role: 'contractor' })
        .select('fullName contractor')
        .lean();
      if (!contractorUser) {
        return sendResponse(res, 400, false, 'Invalid contractor ID');
      }
      updates.contractorName = contractorUser.contractor?.companyName || contractorUser.fullName;
    }

    const project = await Project.findByIdAndUpdate(projectId, updates, { new: true, runValidators: true });

    if (!project) {
      return sendResponse(res, 404, false, 'Project not found');
    }

    // Log audit trail
    await AuditLog.create({
      userId: req.user?.userId,
      userRole: req.user?.role,
      action: 'project.updated',
      resourceType: 'project',
      resourceId: projectId,
      resourceName: project.title,
      changes: { after: updates },
    });

    return sendResponse(res, 200, true, 'Project updated successfully', project);
  } catch (error) {
    console.error('Update project error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to update project');
  }
};

// Update project status
export const updateProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, progress, expenses, resourceUsage } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return sendResponse(res, 404, false, 'Project not found');
    }

    if (status) project.status = normalizeStatus(status);
    const progressValue = typeof progress === 'string' ? Number(progress) : progress;
    const expensesValue = typeof expenses === 'string' ? Number(expenses) : expenses;
    if (Number.isFinite(progressValue)) project.progress = progressValue;
    if (Number.isFinite(expensesValue)) project.spent = expensesValue;
    if (typeof resourceUsage === 'string') project.resourceUsage = resourceUsage;
    if (req.file) {
      if (!isCloudinaryConfigured()) {
        return sendResponse(res, 500, false, 'Cloudinary is not configured. Please set CLOUDINARY_* env vars.');
      }
      const uploaded = await uploadImageBuffer(req.file.buffer, 'civic/project-proof');
      project.proofUrl = uploaded?.secure_url || uploaded?.url;
    }
    if (!status && Number.isFinite(progressValue) && progressValue > 0 && project.status === 'sanctioned') {
      project.status = 'in-progress';
    }
    if (!status && Number.isFinite(progressValue) && progressValue >= 100) {
      project.status = 'completed';
    }
    project.updatedAt = new Date();

    await project.save();

    // Log audit trail
    await AuditLog.create({
      userId: req.user?.userId,
      userRole: req.user?.role,
      action: 'project.status.changed',
      resourceType: 'project',
      resourceId: projectId,
      resourceName: project.title,
      changes: { after: { status, progress, expenses } },
    });

    return sendResponse(res, 200, true, 'Project status updated successfully', project);
  } catch (error) {
    console.error('Update project status error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to update project status');
  }
};

// Add citizen feedback
export const addCitizenFeedback = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { rating, comment, userId, userName } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return sendResponse(res, 404, false, 'Project not found');
    }

    project.citizenFeedback.push({
      userId,
      userName,
      rating,
      comment,
      timestamp: new Date(),
    });

    await project.save();

    return sendResponse(res, 200, true, 'Feedback added successfully', project);
  } catch (error) {
    console.error('Add feedback error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to add feedback');
  }
};

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
      return sendResponse(res, 404, false, 'Project not found');
    }

    // Log audit trail
    await AuditLog.create({
      userId: req.user?.userId,
      userRole: req.user?.role,
      action: 'project.deleted',
      resourceType: 'project',
      resourceId: projectId,
      resourceName: project.title,
    });

    return sendResponse(res, 200, true, 'Project deleted successfully');
  } catch (error) {
    console.error('Delete project error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to delete project');
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const { officialId, contractorId, userId } = req.query;
    const filter = {};

    if (officialId) filter.officialId = officialId;
    if (contractorId) filter.contractorId = contractorId;

    const totalProjects = await Project.countDocuments(filter);
    const activeProjects = await Project.countDocuments({
      ...filter,
      status: { $in: ['in-progress', 'in progress', 'active'] },
    });
    const delayedProjects = await Project.countDocuments({ ...filter, status: 'delayed' });
    const highRiskProjects = await Project.countDocuments({ ...filter, corruptionRisk: 'high' });

    const totalBudget = await Project.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$budget' } } },
    ]);

    const totalSpent = await Project.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$spent' } } },
    ]);

    const stats = {
      totalProjects,
      activeProjects,
      delayedProjects,
      highRiskProjects,
      totalBudget: totalBudget[0]?.total || 0,
      totalSpent: totalSpent[0]?.total || 0,
      averageProgress: await getAverageProgress(filter),
    };

    return sendResponse(res, 200, true, 'Stats fetched successfully', stats);
  } catch (error) {
    console.error('Get stats error:', error);
    return sendResponse(res, 500, false, error.message || 'Failed to fetch stats');
  }
};

async function getAverageProgress(filter) {
  const result = await Project.aggregate([
    { $match: filter },
    { $group: { _id: null, avgProgress: { $avg: '$progress' } } },
  ]);
  return result[0]?.avgProgress || 0;
}
