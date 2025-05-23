import express, { Request, Response } from 'express';
import { getFileList, getFileContent, updateFileContent } from '../controllers/fileController';

const router = express.Router();

// Get file list
router.get('/', function(req: Request, res: Response) {
  return getFileList(req, res);
});

// Get file content
router.get('/:path', function(req: Request, res: Response) {
  return getFileContent(req, res);
});

// Update file content
router.put('/:path', function(req: Request, res: Response) {
  return updateFileContent(req, res);
});

export default router;