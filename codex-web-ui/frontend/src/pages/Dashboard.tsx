import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Task {
  id: string;
  description: string;
  status: string;
  createdAt: string;
}

interface File {
  path: string;
  name: string;
  modifiedTime: string;
}

const Dashboard: React.FC = () => {
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [recentFiles, setRecentFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // In a real app, this would fetch data from the API
    // For now, we'll use mock data
    
    // Simulate API call
    setTimeout(() => {
      setRecentTasks([
        { id: '1', description: 'Implement login functionality', status: 'completed', createdAt: '2023-05-22T10:30:00Z' },
        { id: '2', description: 'Fix navigation bug', status: 'running', createdAt: '2023-05-22T14:15:00Z' },
        { id: '3', description: 'Add user profile page', status: 'pending', createdAt: '2023-05-22T16:45:00Z' },
      ]);
      
      setRecentFiles([
        { path: 'src/components/Login.tsx', name: 'Login.tsx', modifiedTime: '2023-05-22T11:20:00Z' },
        { path: 'src/utils/auth.ts', name: 'auth.ts', modifiedTime: '2023-05-22T11:25:00Z' },
        { path: 'src/pages/Profile.tsx', name: 'Profile.tsx', modifiedTime: '2023-05-22T16:50:00Z' },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Tasks</h2>
            <Link to="/tasks" className="text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">Loading tasks...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="border-b pb-4">
                  <Link to={`/tasks/${task.id}`} className="block hover:bg-gray-50 p-2 rounded">
                    <div className="flex justify-between">
                      <p className="font-medium">{task.description}</p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.status === 'completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'running' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(task.createdAt).toLocaleString()}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Recent Files */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Files</h2>
            <Link to="/files" className="text-blue-600 hover:text-blue-800">
              View All
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-gray-500">Loading files...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentFiles.map((file) => (
                <div key={file.path} className="border-b pb-4">
                  <Link to={`/editor/${encodeURIComponent(file.path)}`} className="block hover:bg-gray-50 p-2 rounded">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="font-medium">{file.name}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 ml-7">
                      {file.path}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 ml-7">
                      Modified: {new Date(file.modifiedTime).toLocaleString()}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Task
          </button>
          
          <button className="flex items-center justify-center p-4 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Create New File
          </button>
          
          <button className="flex items-center justify-center p-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Run Code Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;