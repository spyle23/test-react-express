import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { Task, TaskStatus } from '../types/Task';
import * as taskApi from '../api/taskApi';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (title: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider = ({ children }: TaskProviderProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskApi.getAllTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      toast.error('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (title: string) => {
    try {
      setLoading(true);
      const newTask = await taskApi.createTask(title);
      setTasks(prev => [...prev, newTask]);
      toast.success('Task added successfully');
    } catch (err) {
      setError('Failed to add task');
      toast.error('Failed to add task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    try {
      setLoading(true);
      const updatedTask = await taskApi.updateTaskStatus(id, status);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      toast.success('Task status updated');
    } catch (err) {
      setError('Failed to update task status');
      toast.error('Failed to update task status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setLoading(true);
      await taskApi.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Task deleted successfully');
    } catch (err) {
      setError('Failed to delete task');
      toast.error('Failed to delete task');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        addTask,
        updateTaskStatus,
        deleteTask
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}; 