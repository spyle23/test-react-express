import { Router } from 'express';
import { getAllTasks, createTask, updateTaskStatus, deleteTask } from '../controllers/taskController';
import { validateTaskCreation, validateStatusUpdate } from '../middleware/validation';
import { apiKeyAuth } from '../middleware/auth';

const router = Router();

// Apply API key authentication to all routes
router.use(apiKeyAuth);

// Get all tasks (with optional status filter via query parameter)
router.get('/', getAllTasks);

// Create a new task
router.post('/', validateTaskCreation, createTask);

// Update task status
router.patch('/:id/status', validateStatusUpdate, updateTaskStatus);

// Delete a task
router.delete('/:id', deleteTask);

export default router; 