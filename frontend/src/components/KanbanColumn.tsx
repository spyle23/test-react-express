import { TaskStatus, Task } from '../types/Task';
import TaskCard from './TaskCard';
import { useTaskContext } from '../context/TaskContext';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
}

const KanbanColumn = ({ status, title, tasks }: KanbanColumnProps) => {
  const { updateTaskStatus } = useTaskContext();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const taskId = e.dataTransfer.getData('text/plain');
    updateTaskStatus(taskId, status);
  };
  
  // Convert status to CSS-friendly class name (replace spaces with hyphens)
  const getStatusClassName = (status: string) => {
    return status.replace(/\s+/g, '-');
  };

  return (
    <div 
      className={`kanban-column column-${getStatusClassName(status)}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h2 className={`column-title title-${getStatusClassName(status)}`}>{title}</h2>
      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="empty-column">No tasks in this column</p>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', task.id);
              }}
            >
              <TaskCard task={task} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn; 