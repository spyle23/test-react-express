import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { TaskProvider } from './context/TaskContext';
import TaskForm from './components/TaskForm';
import KanbanBoard from './components/KanbanBoard';

function App() {
  return (
    <TaskProvider>
      <div className="app-container">
        <header className="app-header">
          <h1>Task Management Kanban Board</h1>
        </header>
        
        <div className="status-legend">
          <div className="legend-item">
            <span className="legend-color backlog-color"></span>
            <span>Backlog</span>
          </div>
          <div className="legend-item">
            <span className="legend-color progress-color"></span>
            <span>In Progress</span>
          </div>
          <div className="legend-item">
            <span className="legend-color complete-color"></span>
            <span>Complete</span>
          </div>
          <div className="legend-item">
            <span className="legend-color canceled-color"></span>
            <span>Canceled</span>
          </div>
        </div>
        
        <main className="app-main">
          <TaskForm />
          <KanbanBoard />
        </main>
        <ToastContainer position="bottom-right" />
      </div>
    </TaskProvider>
  );
}

export default App;
