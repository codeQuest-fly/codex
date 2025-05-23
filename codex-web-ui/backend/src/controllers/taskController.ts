import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { sendTaskUpdate } from '../utils/websocket';
import { executeCodexCommand } from '../services/codexService';
import { Task, TaskStatus, TaskType } from '../models/Task';
import { getTaskById as getTaskFromDb, saveTask, getAllTasks, deleteTaskById } from '../services/taskService';

// In-memory store for active tasks (in a real app, this would be in a database)
const activeTasks = new Map<string, any>();

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { description, type, scheduledFor, approvalMode } = req.body;
    
    if (!description || !type) {
      return res.status(400).json({ error: 'Description and type are required' });
    }
    
    const taskId = uuidv4();
    const task: Task = {
      id: taskId,
      description,
      type: type as TaskType,
      status: TaskStatus.PENDING,
      createdAt: new Date(),
      scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
      completedAt: null,
      approvalMode: approvalMode || 'manual',
      output: '',
      changes: []
    };
    
    // Save task to database
    await saveTask(task);
    
    // If task is scheduled for later, set up a timer
    if (task.scheduledFor && task.scheduledFor > new Date()) {
      const delay = task.scheduledFor.getTime() - Date.now();
      setTimeout(() => {
        executeTask(taskId);
      }, delay);
      
      res.status(201).json({ 
        id: taskId, 
        message: 'Task scheduled successfully',
        scheduledFor: task.scheduledFor
      });
    } else {
      // Execute task immediately
      executeTask(taskId);
      
      res.status(201).json({ 
        id: taskId, 
        message: 'Task created and started successfully' 
      });
    }
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Get all tasks
export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await getAllTasks();
    res.json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
};

// Get a specific task
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const task = await getTaskFromDb(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error getting task:', error);
    res.status(500).json({ error: 'Failed to get task' });
  }
};

// Delete/cancel a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const task = await getTaskFromDb(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // If task is running, interrupt it
    if (task.status === TaskStatus.RUNNING) {
      // Implement task interruption logic
      const activeTask = activeTasks.get(taskId);
      if (activeTask && activeTask.process) {
        activeTask.process.kill();
      }
    }
    
    // Delete task from database
    await deleteTaskById(taskId);
    
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

// Interrupt a running task
export const interruptTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const task = await getTaskFromDb(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (task.status !== TaskStatus.RUNNING) {
      return res.status(400).json({ error: 'Task is not running' });
    }
    
    // Implement task interruption logic
    const activeTask = activeTasks.get(taskId);
    if (activeTask && activeTask.process) {
      activeTask.process.kill();
      
      // Update task status
      task.status = TaskStatus.INTERRUPTED;
      await saveTask(task);
      
      // Notify clients
      sendTaskUpdate(taskId, {
        type: 'status_update',
        status: TaskStatus.INTERRUPTED,
        message: 'Task was interrupted by user'
      });
      
      res.json({ message: 'Task interrupted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to interrupt task' });
    }
  } catch (error) {
    console.error('Error interrupting task:', error);
    res.status(500).json({ error: 'Failed to interrupt task' });
  }
};

// Rollback changes made by a task
export const rollbackTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const task = await getTaskFromDb(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (task.status === TaskStatus.RUNNING) {
      return res.status(400).json({ error: 'Cannot rollback a running task' });
    }
    
    // Implement rollback logic
    // This would typically involve using Git to revert changes
    
    // For now, we'll just simulate a rollback
    task.status = TaskStatus.ROLLED_BACK;
    await saveTask(task);
    
    // Notify clients
    sendTaskUpdate(taskId, {
      type: 'status_update',
      status: TaskStatus.ROLLED_BACK,
      message: 'Task changes were rolled back'
    });
    
    res.json({ message: 'Task rolled back successfully' });
  } catch (error) {
    console.error('Error rolling back task:', error);
    res.status(500).json({ error: 'Failed to rollback task' });
  }
};

// Respond to an interaction request
export const interactWithTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const { interactionId, response } = req.body;
    
    if (!interactionId || response === undefined) {
      return res.status(400).json({ error: 'Interaction ID and response are required' });
    }
    
    const task = await getTaskFromDb(taskId);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Forward the interaction response to the task process
    const activeTask = activeTasks.get(taskId);
    if (activeTask && activeTask.process) {
      // In a real implementation, this would send the response to the Codex CLI process
      console.log(`Sending interaction response to task ${taskId}:`, response);
      
      // Notify clients
      sendTaskUpdate(taskId, {
        type: 'interaction_processed',
        interactionId,
        message: 'Interaction response processed'
      });
      
      res.json({ message: 'Interaction response sent successfully' });
    } else {
      res.status(400).json({ error: 'Task is not running or does not support interaction' });
    }
  } catch (error) {
    console.error('Error processing interaction:', error);
    res.status(500).json({ error: 'Failed to process interaction' });
  }
};

// Helper function to execute a task
async function executeTask(taskId: string) {
  try {
    const task = await getTaskFromDb(taskId);
    
    if (!task) {
      console.error(`Task ${taskId} not found`);
      return;
    }
    
    // Update task status
    task.status = TaskStatus.RUNNING;
    await saveTask(task);
    
    // Notify clients
    sendTaskUpdate(taskId, {
      type: 'status_update',
      status: TaskStatus.RUNNING,
      message: 'Task started execution'
    });
    
    // Execute the task using Codex CLI
    const process = executeCodexCommand(task.description, {
      onOutput: (output: string) => {
        // Update task output
        task.output += output;
        saveTask(task);
        
        // Send real-time update to clients
        sendTaskUpdate(taskId, {
          type: 'output_update',
          output
        });
      },
      onInteraction: (interaction: any) => {
        // Send interaction request to clients
        sendTaskUpdate(taskId, {
          type: 'interaction_request',
          interaction
        });
      },
      onComplete: async (success: boolean, result: any) => {
        // Update task status and result
        task.status = success ? TaskStatus.COMPLETED : TaskStatus.FAILED;
        task.completedAt = new Date();
        if (result.changes) {
          task.changes = result.changes;
        }
        await saveTask(task);
        
        // Remove from active tasks
        activeTasks.delete(taskId);
        
        // Notify clients
        sendTaskUpdate(taskId, {
          type: 'status_update',
          status: task.status,
          message: success ? 'Task completed successfully' : 'Task failed',
          result
        });
      }
    });
    
    // Store the process for potential interruption
    activeTasks.set(taskId, { process });
    
  } catch (error) {
    console.error(`Error executing task ${taskId}:`, error);
    
    // Update task status
    const task = await getTaskFromDb(taskId);
    if (task) {
      task.status = TaskStatus.FAILED;
      task.completedAt = new Date();
      await saveTask(task);
      
      // Notify clients
      sendTaskUpdate(taskId, {
        type: 'status_update',
        status: TaskStatus.FAILED,
        message: 'Task execution failed'
      });
    }
    
    // Remove from active tasks
    activeTasks.delete(taskId);
  }
}