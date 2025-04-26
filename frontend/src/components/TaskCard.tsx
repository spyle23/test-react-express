import { Task, TaskStatus } from '../types/Task';
import { useTaskContext } from '../context/TaskContext';

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const { deleteTask, updateTaskStatus, loading } = useTaskContext();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.BACKLOG:
        return '📋';
      case TaskStatus.IN_PROGRESS:
        return '⏳';
      case TaskStatus.COMPLETE:
        return '✅';
      case TaskStatus.CANCELED:
        return '❌';
      default:
        return '';
    }
  };
  
  // Convert status to CSS-friendly class name (replace spaces with hyphens)
  const getStatusClassName = (status: string) => {
    return status.replace(/\s+/g, '-');
  };

  return (
    <div className={`task-card card-${getStatusClassName(task.status)}`}>
      <div className="task-header">
        <span className="status-icon">{getStatusIcon(task.status)}</span>
        <h3 className="task-title">{task.title}</h3>
      </div>
      <div className="task-meta">
        <span>Created: {formatDate(task.createdAt)}</span>
      </div>
      <div className="task-actions">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="delete-button"
          aria-label="Delete task"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard; 