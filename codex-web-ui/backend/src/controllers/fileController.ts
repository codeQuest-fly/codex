import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execPromise = promisify(exec);

// Base directory for project files
// This should be configurable or determined based on the active project
const BASE_DIR = process.env.PROJECT_DIR || '/workspace/codex';

// Get list of files in a directory
export const getFileList = async (req: Request, res: Response) => {
  try {
    const dirPath = req.query.path ? path.join(BASE_DIR, req.query.path as string) : BASE_DIR;
    
    // Check if directory exists
    if (!fs.existsSync(dirPath) || !fs.statSync(dirPath).isDirectory()) {
      return res.status(404).json({ error: 'Directory not found' });
    }
    
    // Use find command to get a list of files and directories
    const { stdout } = await execPromise(
      `find "${dirPath}" -type f -o -type d -not -path "*/\\.*" | sort`
    );
    
    const items = stdout.trim().split('\n').map(filePath => {
      const relativePath = path.relative(BASE_DIR, filePath);
      const stats = fs.statSync(filePath);
      return {
        path: relativePath,
        name: path.basename(filePath),
        isDirectory: stats.isDirectory(),
        size: stats.size,
        modifiedTime: stats.mtime
      };
    });
    
    res.json(items);
  } catch (error) {
    console.error('Error getting file list:', error);
    res.status(500).json({ error: 'Failed to get file list' });
  }
};

// Get content of a file
export const getFileContent = async (req: Request, res: Response) => {
  try {
    const filePath = path.join(BASE_DIR, req.params.path);
    
    // Check if file exists
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return res.status(404).json({ error: 'File not found' });
    }
    
    // Read file content
    const content = fs.readFileSync(filePath, 'utf8');
    
    res.json({
      path: req.params.path,
      content,
      modifiedTime: fs.statSync(filePath).mtime
    });
  } catch (error) {
    console.error('Error getting file content:', error);
    res.status(500).json({ error: 'Failed to get file content' });
  }
};

// Update content of a file
export const updateFileContent = async (req: Request, res: Response) => {
  try {
    const filePath = path.join(BASE_DIR, req.params.path);
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // Create directory if it doesn't exist
      const dirPath = path.dirname(filePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    }
    
    // Write content to file
    fs.writeFileSync(filePath, content);
    
    res.json({
      path: req.params.path,
      modifiedTime: fs.statSync(filePath).mtime,
      success: true
    });
  } catch (error) {
    console.error('Error updating file content:', error);
    res.status(500).json({ error: 'Failed to update file content' });
  }
};