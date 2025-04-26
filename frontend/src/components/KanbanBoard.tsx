import { useMemo } from 'react';
import { TaskStatus } from '../types/Task';
import KanbanColumn from './KanbanColumn';
import { useTaskContext } from '../context/TaskContext';

const KanbanBoard = () => {
  const { tasks, loading, error } = useTaskContext();
  
  const tasksByStatus = useMemo(() => {
    const result = {
      [TaskStatus.BACKLOG]: tasks.filter(task => task.status === TaskStatus.BACKLOG),
      [TaskStatus.IN_PROGRESS]: tasks.filter(task => task.status === TaskStatus.IN_PROGRESS),
      [TaskStatus.COMPLETE]: tasks.filter(task => task.status === TaskStatus.COMPLETE),
      [TaskStatus.CANCELED]: tasks.filter(task => task.status === TaskStatus.CANCELED),
    };
    return result;
  }, [tasks]);

  if (loading && tasks.length === 0) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (error && tasks.length === 0) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="kanban-board">
      <KanbanColumn 
        status={TaskStatus.BACKLOG} 
        title="Backlog" 
        tasks={tasksByStatus[TaskStatus.BACKLOG]} 
      />
      <KanbanColumn 
        status={TaskStatus.IN_PROGRESS} 
        title="In Progress" 
        tasks={tasksByStatus[TaskStatus.IN_PROGRESS]} 
      />
      <KanbanColumn 
        status={TaskStatus.COMPLETE} 
        title="Complete" 
        tasks={tasksByStatus[TaskStatus.COMPLETE]} 
      />
      <KanbanColumn 
        status={TaskStatus.CANCELED} 
        title="Canceled" 
        tasks={tasksByStatus[TaskStatus.CANCELED]} 
      />
    </div>
  );
};

export default KanbanBoard; 