import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';

interface FileData {
  path: string;
  content: string;
  modifiedTime: string;
}

const CodeEditor: React.FC = () => {
  const { path } = useParams<{ path: string }>();
  const navigate = useNavigate();
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editorContent, setEditorContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  
  useEffect(() => {
    if (path) {
      fetchFileContent(path);
    }
  }, [path]);
  
  const fetchFileContent = async (filePath: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it with mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock file content based on file extension
      let content = '';
      
      if (filePath.endsWith('.tsx') || filePath.endsWith('.jsx')) {
        content = `import React from 'react';

const Component = () => {
  return (
    <div>
      <h1>Hello, World!</h1>
    </div>
  );
};

export default Component;`;
      } else if (filePath.endsWith('.ts') || filePath.endsWith('.js')) {
        content = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

export default greet;`;
      } else if (filePath.endsWith('.json')) {
        content = `{
  "name": "example-project",
  "version": "1.0.0",
  "description": "An example project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "test": "jest"
  }
}`;
      } else if (filePath.endsWith('.md')) {
        content = `# Example Markdown

This is an example markdown file.

## Features

- Feature 1
- Feature 2
- Feature 3`;
      } else {
        content = `// File content for ${filePath}`;
      }
      
      const mockFileData: FileData = {
        path: filePath,
        content,
        modifiedTime: new Date().toISOString()
      };
      
      setFileData(mockFileData);
      setEditorContent(content);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch file content. Please try again.');
      setLoading(false);
    }
  };
  
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setEditorContent(value);
    }
  };
  
  const saveFile = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      // In a real app, this would be an API call to save the file
      // For now, we'll just simulate it
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the file data
      if (fileData) {
        setFileData({
          ...fileData,
          content: editorContent,
          modifiedTime: new Date().toISOString()
        });
      }
      
      setSaveSuccess(true);
      setIsSaving(false);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to save file. Please try again.');
      setIsSaving(false);
    }
  };
  
  const getLanguage = (filePath: string): string => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js':
        return 'javascript';
      case 'jsx':
        return 'javascript';
      case 'ts':
        return 'typescript';
      case 'tsx':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      default:
        return 'plaintext';
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Editor header */}
      <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">{path}</h1>
          {fileData && (
            <p className="text-sm text-gray-500">
              Last modified: {new Date(fileData.modifiedTime).toLocaleString()}
            </p>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back
          </button>
          
          <button
            onClick={saveFile}
            disabled={isSaving}
            className={`px-4 py-2 rounded-md ${
              isSaving
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      
      {/* Status messages */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          {error}
        </div>
      )}
      
      {saveSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
          File saved successfully!
        </div>
      )}
      
      {/* Editor */}
      <div className="flex-grow">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500">Loading file content...</p>
          </div>
        ) : (
          <Editor
            height="100%"
            defaultLanguage={path ? getLanguage(path) : 'plaintext'}
            defaultValue={fileData?.content || ''}
            theme="vs-dark"
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CodeEditor;