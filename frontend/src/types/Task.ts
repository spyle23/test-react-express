export enum TaskStatus {
  BACKLOG = 'backlog',
  IN_PROGRESS = 'in-progress',
  COMPLETE = 'complete',
  CANCELED = 'canceled'
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
} 