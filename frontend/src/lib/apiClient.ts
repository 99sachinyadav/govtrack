// API client for connecting frontend to backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    identificationId: string;
  };
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      throw {
        status: response.status,
        ...data,
      };
    }
    
    return data;
  }

  // ==================== AUTH ENDPOINTS ====================
  async register(userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    id: string;
  }) {
    const response = await fetch(`${this.baseUrl}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });

    return this.handleResponse<AuthResponse>(response);
  }

  async login(credentials: {
    email?: string;
    identificationId?: string;
    id?: string;
    password: string;
    role?: string;
  }) {
    const identificationId = credentials.identificationId || credentials.id;
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        email: credentials.email,
        identificationId,
        password: credentials.password,
        role: credentials.role,
      }),
    });

    return this.handleResponse<AuthResponse>(response);
  }

  async verifyToken() {
    const response = await fetch(`${this.baseUrl}/auth/verify`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getCurrentUser() {
    const response = await fetch(`${this.baseUrl}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // ==================== PROJECTS ENDPOINTS ====================
  async getProjects(filters?: Record<string, string>) {
    const queryString = new URLSearchParams(filters || {}).toString();
    const response = await fetch(`${this.baseUrl}/projects?${queryString}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getProjectById(projectId: string) {
    const response = await fetch(`${this.baseUrl}/projects/${projectId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async createProject(projectData: any) {
    const response = await fetch(`${this.baseUrl}/projects`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(projectData),
    });

    return this.handleResponse(response);
  }

  async updateProject(projectId: string, projectData: any) {
    const response = await fetch(`${this.baseUrl}/projects/${projectId}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(projectData),
    });

    return this.handleResponse(response);
  }

  async updateProjectStatus(projectId: string, statusData: any) {
    const isFormData = typeof FormData !== 'undefined' && statusData instanceof FormData;
    const headers = isFormData ? { ...(this.getHeaders() as any), 'Content-Type': undefined } : this.getHeaders();
    if (isFormData && 'Content-Type' in headers) delete headers['Content-Type'];
    const response = await fetch(`${this.baseUrl}/projects/${projectId}/status`, {
      method: 'PATCH',
      headers,
      body: isFormData ? statusData : JSON.stringify(statusData),
    });

    return this.handleResponse(response);
  }

  async addProjectFeedback(projectId: string, feedback: any) {
    const response = await fetch(`${this.baseUrl}/projects/${projectId}/feedback`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(feedback),
    });

    return this.handleResponse(response);
  }

  async getProjectStats(filters?: Record<string, string>) {
    const queryString = new URLSearchParams(filters || {}).toString();
    const response = await fetch(`${this.baseUrl}/projects/stats?${queryString}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // ==================== COMPLAINTS ENDPOINTS ====================
  async getComplaints(filters?: Record<string, string>) {
    const queryString = new URLSearchParams(filters || {}).toString();
    const response = await fetch(`${this.baseUrl}/complaints?${queryString}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getComplaintById(complaintId: string) {
    const response = await fetch(`${this.baseUrl}/complaints/${complaintId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async createComplaint(complaintData: any) {
    const isFormData = typeof FormData !== 'undefined' && complaintData instanceof FormData;
    const headers = isFormData ? { ...(this.getHeaders() as any), 'Content-Type': undefined } : this.getHeaders();
    if (isFormData && 'Content-Type' in headers) delete headers['Content-Type'];

    const response = await fetch(`${this.baseUrl}/complaints`, {
      method: 'POST',
      headers,
      body: isFormData ? complaintData : JSON.stringify(complaintData),
    });

    return this.handleResponse(response);
  }

  async updateComplaintStatus(complaintId: string, statusData: any) {
    const isFormData = typeof FormData !== 'undefined' && statusData instanceof FormData;
    const headers = isFormData ? { ...(this.getHeaders() as any), 'Content-Type': undefined } : this.getHeaders();
    if (isFormData && 'Content-Type' in headers) delete headers['Content-Type'];

    const response = await fetch(`${this.baseUrl}/complaints/${complaintId}/status`, {
      method: 'PATCH',
      headers,
      body: isFormData ? statusData : JSON.stringify(statusData),
    });

    return this.handleResponse(response);
  }

  async upvoteComplaint(complaintId: string) {
    const response = await fetch(`${this.baseUrl}/complaints/${complaintId}/upvote`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getComplaintStats(filters?: Record<string, string>) {
    const queryString = new URLSearchParams(filters || {}).toString();
    const response = await fetch(`${this.baseUrl}/complaints/stats?${queryString}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // ==================== BUDGETS ENDPOINTS ====================
  async getBudgets(filters?: Record<string, string>) {
    const queryString = new URLSearchParams(filters || {}).toString();
    const response = await fetch(`${this.baseUrl}/budgets?${queryString}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getBudgetById(budgetId: string) {
    const response = await fetch(`${this.baseUrl}/budgets/${budgetId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async createBudget(budgetData: any) {
    const response = await fetch(`${this.baseUrl}/budgets`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(budgetData),
    });

    return this.handleResponse(response);
  }

  async updateBudget(budgetId: string, budgetData: any) {
    const response = await fetch(`${this.baseUrl}/budgets/${budgetId}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(budgetData),
    });

    return this.handleResponse(response);
  }

  async approveBudget(budgetId: string) {
    const response = await fetch(`${this.baseUrl}/budgets/${budgetId}/approve`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getBudgetStats(filters?: Record<string, string>) {
    const queryString = new URLSearchParams(filters || {}).toString();
    const response = await fetch(`${this.baseUrl}/budgets/stats?${queryString}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // ==================== RTI REQUESTS ENDPOINTS ====================
  async getRTIRequests(filters?: Record<string, string>) {
    const queryString = new URLSearchParams(filters || {}).toString();
    const response = await fetch(`${this.baseUrl}/rti?${queryString}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async getRTIRequestById(rtiId: string) {
    const response = await fetch(`${this.baseUrl}/rti/${rtiId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async createRTIRequest(rtiData: any) {
    const response = await fetch(`${this.baseUrl}/rti`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(rtiData),
    });

    return this.handleResponse(response);
  }

  async approveRTIRequest(rtiId: string, approvalData: any) {
    const response = await fetch(`${this.baseUrl}/rti/${rtiId}/approve`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(approvalData),
    });

    return this.handleResponse(response);
  }

  async getRTIStats(filters?: Record<string, string>) {
    const queryString = new URLSearchParams(filters || {}).toString();
    const response = await fetch(`${this.baseUrl}/rti/stats?${queryString}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // ==================== UTILITY METHODS ====================
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  setToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  // ==================== WEBSOCKET (Real-time updates) ====================
  connectWebSocket(onMessage: (data: any) => void, onError?: (error: any) => void) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host.split(':')[0]}:5000/ws`;
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send(JSON.stringify({
        action: 'subscribe',
        events: ['project.updated', 'complaint.filed', 'budget.approved', 'rti.requested']
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      onError?.(error);
    };

    return ws;
  }

  async getContractors() {
    const response = await fetch(`${this.baseUrl}/users/contractors`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  // ==================== COMMUNITY ENDPOINTS ====================
  async getCommunityPosts() {
    const response = await fetch(`${this.baseUrl}/community/posts`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async createCommunityPost(postData: any) {
    const isFormData = typeof FormData !== 'undefined' && postData instanceof FormData;
    const headers = isFormData ? { ...(this.getHeaders() as any), 'Content-Type': undefined } : this.getHeaders();
    if (isFormData && 'Content-Type' in headers) delete headers['Content-Type'];

    const response = await fetch(`${this.baseUrl}/community/posts`, {
      method: 'POST',
      headers,
      body: isFormData ? postData : JSON.stringify(postData),
    });

    return this.handleResponse(response);
  }

  async likeCommunityPost(postId: string) {
    const response = await fetch(`${this.baseUrl}/community/posts/${postId}/like`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  async commentCommunityPost(postId: string, text: string) {
    const response = await fetch(`${this.baseUrl}/community/posts/${postId}/comment`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ text }),
    });

    return this.handleResponse(response);
  }
}

export const apiClient = new ApiClient();

// Export for use in components
export default apiClient;

