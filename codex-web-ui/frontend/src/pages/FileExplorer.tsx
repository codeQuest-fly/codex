import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface FileItem {
  path: string;
  name: string;
  isDirectory: boolean;
  size: number;
  modifiedTime: string;
}

const FileExplorer: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchFiles(currentPath);
  }, [currentPath]);
  
  const fetchFiles = async (path: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it with mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data
      const mockFiles: FileItem[] = [
        { path: 'src', name: 'src', isDirectory: true, size: 0, modifiedTime: '2023-05-20T10:00:00Z' },
        { path: 'package.json', name: 'package.json', isDirectory: false, size: 1024, modifiedTime: '2023-05-20T10:00:00Z' },
        { path: 'README.md', name: 'README.md', isDirectory: false, size: 2048, modifiedTime: '2023-05-20T10:00:00Z' },
      ];
      
      if (path === 'src') {
        setFiles([
          { path: 'src/components', name: 'components', isDirectory: true, size: 0, modifiedTime: '2023-05-20T10:00:00Z' },
          { path: 'src/pages', name: 'pages', isDirectory: true, size: 0, modifiedTime: '2023-05-20T10:00:00Z' },
          { path: 'src/App.tsx', name: 'App.tsx', isDirectory: false, size: 1024, modifiedTime: '2023-05-20T10:00:00Z' },
          { path: 'src/index.tsx', name: 'index.tsx', isDirectory: false, size: 512, modifiedTime: '2023-05-20T10:00:00Z' },
        ]);
      } else if (path.startsWith('src/')) {
        setFiles([
          { path: `${path}/file1.tsx`, name: 'file1.tsx', isDirectory: false, size: 1024, modifiedTime: '2023-05-20T10:00:00Z' },
          { path: `${path}/file2.tsx`, name: 'file2.tsx', isDirectory: false, size: 2048, modifiedTime: '2023-05-20T10:00:00Z' },
        ]);
      } else {
        setFiles(mockFiles);
      }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch files. Please try again.');
      setLoading(false);
    }
  };
  
  const handleFileClick = (file: FileItem) => {
    if (file.isDirectory) {
      setCurrentPath(file.path);
    } else {
      navigate(`/editor/${encodeURIComponent(file.path)}`);
    }
  };
  
  const navigateUp = () => {
    if (currentPath) {
      const lastSlashIndex = currentPath.lastIndexOf('/');
      const newPath = lastSlashIndex > 0 ? currentPath.substring(0, lastSlashIndex) : '';
      setCurrentPath(newPath);
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">File Explorer</h1>
      
      {/* Breadcrumb navigation */}
      <div className="flex items-center mb-4 bg-gray-100 p-2 rounded">
        <button 
          onClick={() => setCurrentPath('')}
          className="text-blue-600 hover:text-blue-800"
        >
          Root
        </button>
        
        {currentPath.split('/').filter(Boolean).map((segment, index, array) => {
          const path = array.slice(0, index + 1).join('/');
          return (
            <React.Fragment key={path}>
              <span className="mx-2 text-gray-500">/</span>
              <button 
                onClick={() => setCurrentPath(path)}
                className="text-blue-600 hover:text-blue-800"
              >
                {segment}
              </button>
            </React.Fragment>
          );
        })}
      </div>
      
      {/* File actions */}
      <div className="flex mb-4 space-x-2">
        <button 
          onClick={navigateUp}
          disabled={!currentPath}
          className={`px-4 py-2 rounded-md ${
            currentPath ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Up
        </button>
        
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          New File
        </button>
        
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          New Folder
        </button>
      </div>
      
      {/* File list */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading files...</p>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modified
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {files.map((file) => (
                <tr key={file.path} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {file.isDirectory ? (
                        <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                      <button 
                        onClick={() => handleFileClick(file)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {file.name}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {file.isDirectory ? '-' : formatFileSize(file.size)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(file.modifiedTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {!file.isDirectory && (
                        <Link 
                          to={`/editor/${encodeURIComponent(file.path)}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </Link>
                      )}
                      <button className="text-red-600 hover:text-red-800">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FileExplorer;