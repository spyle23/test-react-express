import { useState, FormEvent } from 'react';
import { useTaskContext } from '../context/TaskContext';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const { addTask, loading } = useTaskContext();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    await addTask(title);
    setTitle('');
  };

  return (
    <div className="task-form-container">
      <h2>Add New Task</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title..."
          disabled={loading}
          className="task-input"
        />
        <button type="submit" disabled={loading || !title.trim()} className="submit-button">
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm; 