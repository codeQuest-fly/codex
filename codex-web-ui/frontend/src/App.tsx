import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import FileExplorer from './pages/FileExplorer';
import TaskManager from './pages/TaskManager';
import TaskDetail from './pages/TaskDetail';
import CodeEditor from './pages/CodeEditor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="files" element={<FileExplorer />} />
          <Route path="editor/:path" element={<CodeEditor />} />
          <Route path="tasks" element={<TaskManager />} />
          <Route path="tasks/:id" element={<TaskDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
