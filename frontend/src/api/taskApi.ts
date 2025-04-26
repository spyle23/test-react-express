import axios from 'axios';
import { Task, TaskStatus } from '../types/Task';

const API_URL = 'http://localhost:3000';

// Create axios instance with API key authentication
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'test-api-key' // Replace with actual API key
  }
});

// Convert front-end enum values to backend format if needed
const convertTaskStatusForBackend = (status: TaskStatus): string => {
  // If backend expects 'in progress' instead of 'in-progress'
  if (status === TaskStatus.IN_PROGRESS) {
    return 'in progress';
  }
  return status;
};

// Convert backend status values to frontend enum values
const convertTaskStatusFromBackend = (task: any): Task => {
  if (task.status === 'in progress') {
    return { ...task, status: TaskStatus.IN_PROGRESS };
  }
  return task as Task;
};

export const getAllTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data.map(convertTaskStatusFromBackend);
};

export const getTasksByStatus = async (status: TaskStatus): Promise<Task[]> => {
  const backendStatus = convertTaskStatusForBackend(status);
  const response = await api.get(`/tasks?status=${backendStatus}`);
  return response.data.map(convertTaskStatusFromBackend);
};

export const createTask = async (title: string): Promise<Task> => {
  const response = await api.post('/tasks', { title });
  return convertTaskStatusFromBackend(response.data);
};

export const updateTaskStatus = async (id: string, status: TaskStatus): Promise<Task> => {
  const backendStatus = convertTaskStatusForBackend(status);
  const response = await api.patch(`/tasks/${id}/status`, { status: backendStatus });
  return convertTaskStatusFromBackend(response.data);
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
}; 