import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Task {
  id: string;
  description: string;
  type: string;
  status: string;
  createdAt: string;
  scheduledFor: string | null;
  completedAt: string | null;
  output: string;
  changes: FileChange[];
}

interface FileChange {
  path: string;
  operation: 'create' | 'modify' | 'delete';
  diff?: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Interaction {
  id: string;
  type: 'confirmation' | 'input' | 'choice';
  message: string;
  options?: string[];
}

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'output' | 'changes' | 'interactions'>('output');
  const [currentInteraction, setCurrentInteraction] = useState<Interaction | null>(null);
  const [interactionResponse, setInteractionResponse] = useState<string>('');
  const outputRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (id) {
      fetchTaskDetails(id);
    }
  }, [id]);
  
  useEffect(() => {
    // Scroll to bottom of output when it updates
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [task?.output]);
  
  const fetchTaskDetails = async (taskId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it with mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockTask: Task = {
        id: taskId,
        description: 'Implement login functionality with email and password validation',
        type: 'code_generation',
        status: 'running',
        createdAt: '2023-05-22T10:30:00Z',
        scheduledFor: null,
        completedAt: null,
        output: `Analyzing project structure...
Found React application with TypeScript.
Identifying authentication requirements...
Creating login component with email and password fields.
Adding form validation for email format and password strength.
Implementing authentication service...
Creating API client for authentication endpoints.
Adding state management for user session.
Testing login functionality...
`,
        changes: [
          {
            path: 'src/components/Login.tsx',
            operation: 'create',
            diff: `+import React, { useState } from 'react';
+import { useAuth } from '../hooks/useAuth';
+
+interface LoginFormData {
+  email: string;
+  password: string;
+}
+
+const Login: React.FC = () => {
+  const [formData, setFormData] = useState<LoginFormData>({
+    email: '',
+    password: ''
+  });
+  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
+  const { login, loading, error } = useAuth();
+
+  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
+    const { name, value } = e.target;
+    setFormData(prev => ({
+      ...prev,
+      [name]: value
+    }));
+  };
+
+  const validateForm = (): boolean => {
+    const newErrors: Partial<LoginFormData> = {};
+    
+    // Validate email
+    if (!formData.email) {
+      newErrors.email = 'Email is required';
+    } else if (!/\\S+@\\S+\\.\\S+/.test(formData.email)) {
+      newErrors.email = 'Email is invalid';
+    }
+    
+    // Validate password
+    if (!formData.password) {
+      newErrors.password = 'Password is required';
+    } else if (formData.password.length < 6) {
+      newErrors.password = 'Password must be at least 6 characters';
+    }
+    
+    setErrors(newErrors);
+    return Object.keys(newErrors).length === 0;
+  };
+
+  const handleSubmit = async (e: React.FormEvent) => {
+    e.preventDefault();
+    
+    if (validateForm()) {
+      await login(formData.email, formData.password);
+    }
+  };
+
+  return (
+    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
+      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
+      
+      {error && (
+        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
+          {error}
+        </div>
+      )}
+      
+      <form onSubmit={handleSubmit}>
+        <div className="mb-4">
+          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
+            Email
+          </label>
+          <input
+            type="email"
+            id="email"
+            name="email"
+            value={formData.email}
+            onChange={handleChange}
+            className={\`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 \${
+              errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
+            }\`}
+          />
+          {errors.email && (
+            <p className="mt-1 text-red-500 text-sm">{errors.email}</p>
+          )}
+        </div>
+        
+        <div className="mb-6">
+          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
+            Password
+          </label>
+          <input
+            type="password"
+            id="password"
+            name="password"
+            value={formData.password}
+            onChange={handleChange}
+            className={\`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 \${
+              errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
+            }\`}
+          />
+          {errors.password && (
+            <p className="mt-1 text-red-500 text-sm">{errors.password}</p>
+          )}
+        </div>
+        
+        <button
+          type="submit"
+          disabled={loading}
+          className={\`w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 \${
+            loading ? 'opacity-70 cursor-not-allowed' : ''
+          }\`}
+        >
+          {loading ? 'Logging in...' : 'Login'}
+        </button>
+      </form>
+    </div>
+  );
+};
+
+export default Login;`,
            status: 'pending'
          },
          {
            path: 'src/services/authService.ts',
            operation: 'create',
            diff: `+import axios from 'axios';
+
+const API_URL = '/api/auth';
+
+export interface AuthResponse {
+  token: string;
+  user: {
+    id: string;
+    email: string;
+    name: string;
+  };
+}
+
+export const login = async (email: string, password: string): Promise<AuthResponse> => {
+  try {
+    const response = await axios.post(\`\${API_URL}/login\`, { email, password });
+    return response.data;
+  } catch (error) {
+    throw new Error(error.response?.data?.message || 'Failed to login');
+  }
+};
+
+export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
+  try {
+    const response = await axios.post(\`\${API_URL}/register\`, { name, email, password });
+    return response.data;
+  } catch (error) {
+    throw new Error(error.response?.data?.message || 'Failed to register');
+  }
+};
+
+export const logout = async (): Promise<void> => {
+  try {
+    await axios.post(\`\${API_URL}/logout\`);
+  } catch (error) {
+    console.error('Logout error:', error);
+  }
+};`,
            status: 'pending'
          }
        ]
      };
      
      setTask(mockTask);
      setLoading(false);
      
      // Simulate an interaction after 2 seconds
      setTimeout(() => {
        setCurrentInteraction({
          id: '1',
          type: 'confirmation',
          message: 'I need to create a new file for the authentication hook. Should I proceed?'
        });
      }, 2000);
    } catch (err) {
      setError('Failed to fetch task details. Please try again.');
      setLoading(false);
    }
  };
  
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'running':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'interrupted':
        return 'bg-orange-100 text-orange-800';
      case 'rolled_back':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleInteractionResponse = (response: string) => {
    if (!currentInteraction) return;
    
    // In a real app, this would send the response to the API
    console.log(`Sending response for interaction ${currentInteraction.id}:`, response);
    
    // Clear the current interaction
    setCurrentInteraction(null);
    setInteractionResponse('');
    
    // Simulate task continuing
    if (task) {
      setTask({
        ...task,
        output: task.output + `\nCreating authentication hook...\n`
      });
    }
  };
  
  const handleApproveChange = (path: string) => {
    if (!task) return;
    
    // Update the change status
    const updatedChanges = task.changes.map(change => 
      change.path === path ? { ...change, status: 'approved' as const } : change
    );
    
    setTask({
      ...task,
      changes: updatedChanges
    });
  };
  
  const handleRejectChange = (path: string) => {
    if (!task) return;
    
    // Update the change status
    const updatedChanges = task.changes.map(change => 
      change.path === path ? { ...change, status: 'rejected' as const } : change
    );
    
    setTask({
      ...task,
      changes: updatedChanges
    });
  };
  
  const handleInterruptTask = () => {
    if (!task) return;
    
    // In a real app, this would call the API to interrupt the task
    console.log(`Interrupting task ${task.id}`);
    
    // Update task status
    setTask({
      ...task,
      status: 'interrupted',
      completedAt: new Date().toISOString()
    });
  };
  
  const handleRollbackTask = () => {
    if (!task) return;
    
    // In a real app, this would call the API to rollback the task
    console.log(`Rolling back task ${task.id}`);
    
    // Update task status
    setTask({
      ...task,
      status: 'rolled_back',
      completedAt: new Date().toISOString()
    });
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={() => navigate('/tasks')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Tasks
          </button>
          <h1 className="text-3xl font-bold">{task?.description || 'Task Details'}</h1>
        </div>
        
        <div className="flex space-x-2">
          {task?.status === 'running' && (
            <button
              onClick={handleInterruptTask}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Interrupt
            </button>
          )}
          
          {(task?.status === 'completed' || task?.status === 'failed') && (
            <button
              onClick={handleRollbackTask}
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Rollback
            </button>
          )}
        </div>
      </div>
      
      {/* Task metadata */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="mt-1">
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task?.status || 'pending')}`}>
                {task?.status?.charAt(0).toUpperCase() + (task?.status?.slice(1) || '')}
              </span>
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Type</p>
            <p className="mt-1 font-medium">
              {task?.type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Created</p>
            <p className="mt-1">
              {task?.createdAt ? new Date(task.createdAt).toLocaleString() : '-'}
            </p>
          </div>
          
          {task?.scheduledFor && (
            <div>
              <p className="text-sm text-gray-500">Scheduled For</p>
              <p className="mt-1">
                {new Date(task.scheduledFor).toLocaleString()}
              </p>
            </div>
          )}
          
          {task?.completedAt && (
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="mt-1">
                {new Date(task.completedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Interaction dialog */}
      {currentInteraction && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800 font-medium">
                {currentInteraction.message}
              </p>
              
              {currentInteraction.type === 'confirmation' && (
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => handleInteractionResponse('yes')}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleInteractionResponse('no')}
                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                  >
                    No
                  </button>
                </div>
              )}
              
              {currentInteraction.type === 'input' && (
                <div className="mt-3 flex">
                  <input
                    type="text"
                    value={interactionResponse}
                    onChange={(e) => setInteractionResponse(e.target.value)}
                    className="flex-grow px-3 py-1 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Type your response..."
                  />
                  <button
                    onClick={() => handleInteractionResponse(interactionResponse)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-r hover:bg-blue-700"
                  >
                    Send
                  </button>
                </div>
              )}
              
              {currentInteraction.type === 'choice' && currentInteraction.options && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentInteraction.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleInteractionResponse(option)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('output')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'output'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Output
            </button>
            <button
              onClick={() => setActiveTab('changes')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'changes'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Changes {task?.changes.length ? `(${task.changes.length})` : ''}
            </button>
            <button
              onClick={() => setActiveTab('interactions')}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'interactions'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Interactions
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Loading task details...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <>
              {/* Output tab */}
              {activeTab === 'output' && (
                <div 
                  ref={outputRef}
                  className="bg-gray-900 text-gray-100 p-4 rounded h-96 overflow-y-auto font-mono text-sm whitespace-pre-wrap"
                >
                  {task?.output || 'No output available.'}
                  {task?.status === 'running' && (
                    <span className="inline-block animate-pulse">▋</span>
                  )}
                </div>
              )}
              
              {/* Changes tab */}
              {activeTab === 'changes' && (
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {task?.changes.length === 0 ? (
                    <p className="text-gray-500">No changes made by this task.</p>
                  ) : (
                    task?.changes.map((change) => (
                      <div key={change.path} className="border rounded-md overflow-hidden">
                        <div className="flex justify-between items-center bg-gray-50 p-3 border-b">
                          <div className="flex items-center">
                            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                              change.operation === 'create' ? 'bg-green-500' :
                              change.operation === 'modify' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`}></span>
                            <span className="font-medium">{change.path}</span>
                            <span className="ml-2 text-sm text-gray-500">
                              ({change.operation})
                            </span>
                          </div>
                          
                          <div className="flex space-x-2">
                            {change.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => handleApproveChange(change.path)}
                                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectChange(change.path)}
                                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                change.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {change.status.charAt(0).toUpperCase() + change.status.slice(1)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {change.diff && (
                          <div className="bg-gray-900 p-4 overflow-x-auto font-mono text-sm">
                            {change.diff.split('\n').map((line, i) => (
                              <div key={i} className={`${
                                line.startsWith('+') ? 'text-green-400' :
                                line.startsWith('-') ? 'text-red-400' :
                                'text-gray-300'
                              }`}>
                                {line}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
              
              {/* Interactions tab */}
              {activeTab === 'interactions' && (
                <div className="max-h-96 overflow-y-auto">
                  <p className="text-gray-500">No previous interactions for this task.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;