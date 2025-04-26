import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { TaskStore, TaskStatus } from '../models/Task';

export const getAllTasks = (req: Request, res: Response) => {
  // Check if status filter is provided
  const statusFilter = req.query.status as string;
  
  if (statusFilter && Object.values(TaskStatus).includes(statusFilter as TaskStatus)) {
    // If valid status is provided, filter by status
    const tasks = TaskStore.findByStatus(statusFilter as TaskStatus);
    return res.status(200).json(tasks);
  } else if (statusFilter) {
    // If invalid status is provided
    return res.status(400).json({ 
      message: 'Invalid status parameter',
      validStatuses: Object.values(TaskStatus)
    });
  }
  
  // Otherwise return all tasks
  const tasks = TaskStore.findAll();
  return res.status(200).json(tasks);
};

export const createTask = (req: Request, res: Response) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title } = req.body;
  const newTask = TaskStore.create(title);
  
  return res.status(201).json(newTask);
};

export const updateTaskStatus = (req: Request, res: Response) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { id } = req.params;
  const { status } = req.body;
  
  if (!id) {
    return res.status(400).json({ message: 'Task ID is required' });
  }
  
  if (!status || !Object.values(TaskStatus).includes(status as TaskStatus)) {
    return res.status(400).json({ 
      message: 'Valid status is required',
      validStatuses: Object.values(TaskStatus)
    });
  }
  
  const updatedTask = TaskStore.updateStatus(id, status as TaskStatus);
  
  if (!updatedTask) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  return res.status(200).json(updatedTask);
};

export const deleteTask = (req: Request, res: Response) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: 'Task ID is required' });
  }
  
  const deleted = TaskStore.delete(id);
  
  if (!deleted) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  return res.status(200).json({ message: 'Task deleted successfully' });
}; 