import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// File API
export const fileApi = {
  // Get file list
  getFiles: async (path?: string) => {
    const response = await api.get('/files', { params: { path } });
    return response.data;
  },
  
  // Get file content
  getFileContent: async (path: string) => {
    const response = await api.get(`/files/${encodeURIComponent(path)}`);
    return response.data;
  },
  
  // Update file content
  updateFileContent: async (path: string, content: string) => {
    const response = await api.put(`/files/${encodeURIComponent(path)}`, { content });
    return response.data;
  },
};

// Task API
export const taskApi = {
  // Get all tasks
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },
  
  // Get task by ID
  getTaskById: async (id: string) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  
  // Create a new task
  createTask: async (taskData: any) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },
  
  // Delete/cancel a task
  deleteTask: async (id: string) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
  
  // Interrupt a running task
  interruptTask: async (id: string) => {
    const response = await api.post(`/tasks/${id}/interrupt`);
    return response.data;
  },
  
  // Rollback changes made by a task
  rollbackTask: async (id: string) => {
    const response = await api.post(`/tasks/${id}/rollback`);
    return response.data;
  },
  
  // Respond to an interaction request
  interactWithTask: async (id: string, interactionId: string, response: any) => {
    const payload = { interactionId, response };
    const apiResponse = await api.post(`/tasks/${id}/interact`, payload);
    return apiResponse.data;
  },
};

export default api;