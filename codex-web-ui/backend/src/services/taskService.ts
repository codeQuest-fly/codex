import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Task } from '../models/Task';

// Initialize database
async function getDb() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });
}

// Initialize database tables
export async function initializeDatabase() {
  const db = await getDb();
  
  // Create tasks table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      description TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      scheduledFor TEXT,
      completedAt TEXT,
      approvalMode TEXT NOT NULL,
      output TEXT,
      changes TEXT
    )
  `);
  
  // Create interactions table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS interactions (
      id TEXT PRIMARY KEY,
      taskId TEXT NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      options TEXT,
      response TEXT,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (taskId) REFERENCES tasks (id)
    )
  `);
  
  await db.close();
}

// Get all tasks
export async function getAllTasks(): Promise<Task[]> {
  const db = await getDb();
  
  const rows = await db.all('SELECT * FROM tasks ORDER BY createdAt DESC');
  
  await db.close();
  
  return rows.map((row: any) => ({
    ...row,
    createdAt: new Date(row.createdAt),
    scheduledFor: row.scheduledFor ? new Date(row.scheduledFor) : null,
    completedAt: row.completedAt ? new Date(row.completedAt) : null,
    changes: row.changes ? JSON.parse(row.changes) : []
  }));
}

// Get a task by ID
export async function getTaskById(id: string): Promise<Task | null> {
  const db = await getDb();
  
  const row = await db.get('SELECT * FROM tasks WHERE id = ?', id);
  
  await db.close();
  
  if (!row) return null;
  
  return {
    ...row,
    createdAt: new Date(row.createdAt),
    scheduledFor: row.scheduledFor ? new Date(row.scheduledFor) : null,
    completedAt: row.completedAt ? new Date(row.completedAt) : null,
    changes: row.changes ? JSON.parse(row.changes) : []
  };
}

// Save a task
export async function saveTask(task: Task): Promise<void> {
  const db = await getDb();
  
  await db.run(
    `INSERT OR REPLACE INTO tasks (
      id, description, type, status, createdAt, scheduledFor, completedAt, approvalMode, output, changes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      task.id,
      task.description,
      task.type,
      task.status,
      task.createdAt.toISOString(),
      task.scheduledFor ? task.scheduledFor.toISOString() : null,
      task.completedAt ? task.completedAt.toISOString() : null,
      task.approvalMode,
      task.output,
      JSON.stringify(task.changes)
    ]
  );
  
  await db.close();
}

// Delete a task by ID
export async function deleteTaskById(id: string): Promise<void> {
  const db = await getDb();
  
  await db.run('DELETE FROM tasks WHERE id = ?', id);
  
  // Also delete related interactions
  await db.run('DELETE FROM interactions WHERE taskId = ?', id);
  
  await db.close();
}

// Initialize database on startup
initializeDatabase().catch(console.error);