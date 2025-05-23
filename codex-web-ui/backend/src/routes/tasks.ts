import express, { Request, Response } from 'express';
import { 
  createTask, 
  getTasks, 
  getTaskById, 
  deleteTask, 
  interruptTask, 
  rollbackTask, 
  interactWithTask 
} from '../controllers/taskController';

const router = express.Router();

// Create a new task
router.post('/', function(req: Request, res: Response) {
  return createTask(req, res);
});

// Get all tasks
router.get('/', function(req: Request, res: Response) {
  return getTasks(req, res);
});

// Get a specific task
router.get('/:id', function(req: Request, res: Response) {
  return getTaskById(req, res);
});

// Delete/cancel a task
router.delete('/:id', function(req: Request, res: Response) {
  return deleteTask(req, res);
});

// Interrupt a running task
router.post('/:id/interrupt', function(req: Request, res: Response) {
  return interruptTask(req, res);
});

// Rollback changes made by a task
router.post('/:id/rollback', function(req: Request, res: Response) {
  return rollbackTask(req, res);
});

// Respond to an interaction request
router.post('/:id/interact', function(req: Request, res: Response) {
  return interactWithTask(req, res);
});

export default router;