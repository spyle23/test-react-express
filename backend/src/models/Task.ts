import { v4 as uuidv4 } from 'uuid';

// Define possible task statuses as an enum
export enum TaskStatus {
  BACKLOG = 'backlog',
  IN_PROGRESS = 'in progress',
  COMPLETE = 'complete',
  CANCELED = 'canceled'
}

export interface ITask {
  id: string;
  title: string;
  status: TaskStatus;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Task implements ITask {
  id: string;
  title: string;
  status: TaskStatus;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(title: string) {
    this.id = uuidv4();
    this.title = title;
    this.status = TaskStatus.BACKLOG; // Default status is backlog
    this.completed = false;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Method to update task status
  updateStatus(status: TaskStatus): void {
    this.status = status;
    this.updatedAt = new Date();
    
    // Update completed flag based on status
    this.completed = status === TaskStatus.COMPLETE;
  }
}

// In-memory storage for tasks
export class TaskStore {
  private static tasks: ITask[] = [];

  static findAll(): ITask[] {
    return this.tasks;
  }

  static findByStatus(status: TaskStatus): ITask[] {
    return this.tasks.filter(task => task.status === status);
  }

  static findById(id: string): ITask | undefined {
    return this.tasks.find(task => task.id === id);
  }

  static create(title: string): ITask {
    const task = new Task(title);
    this.tasks.push(task);
    return task;
  }

  static delete(id: string): boolean {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);
    return this.tasks.length !== initialLength;
  }

  static updateStatus(id: string, status: TaskStatus): ITask | undefined {
    const task = this.findById(id);
    
    if (task && task instanceof Task) {
      task.updateStatus(status);
      return task;
    }
    
    return undefined;
  }
} 