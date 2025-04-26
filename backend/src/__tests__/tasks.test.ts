// Import test libraries and application
import request from 'supertest';
import app from '../index';
import { TaskStore, TaskStatus } from '../models/Task';
import { Server } from 'http';

let server: Server;

describe('Task API Tests', () => {
  // Start server before all tests
  beforeAll((done) => {
    server = app.listen(0, () => {
      done();
    });
  });

  // Close server after all tests
  afterAll((done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  // Reset task store before each test
  beforeEach(() => {
    // Access the private tasks array using type assertion
    (TaskStore as any).tasks = [];
  });
  
  describe('GET /tasks', () => {
    it('should return all tasks', async () => {
      // Create some test tasks first
      TaskStore.create('Test task 1');
      TaskStore.create('Test task 2');
      
      const response = await request(app)
        .get('/tasks')
        .set('X-API-Key', 'test-api-key');
        
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe('Test task 1');
      expect(response.body[1].title).toBe('Test task 2');
      expect(response.body[0].status).toBe(TaskStatus.BACKLOG);
    });
    
    it('should filter tasks by status', async () => {
      // Create tasks with different statuses
      const task1 = TaskStore.create('Backlog task');
      const task2 = TaskStore.create('In progress task');
      const task3 = TaskStore.create('Completed task');
      
      // Update statuses
      TaskStore.updateStatus(task2.id, TaskStatus.IN_PROGRESS);
      TaskStore.updateStatus(task3.id, TaskStatus.COMPLETE);
      
      // Test filtering by backlog status
      const backlogResponse = await request(app)
        .get(`/tasks?status=${TaskStatus.BACKLOG}`)
        .set('X-API-Key', 'test-api-key');
        
      expect(backlogResponse.status).toBe(200);
      expect(backlogResponse.body.length).toBe(1);
      expect(backlogResponse.body[0].title).toBe('Backlog task');
      
      // Test filtering by in progress status
      const inProgressResponse = await request(app)
        .get(`/tasks?status=${TaskStatus.IN_PROGRESS}`)
        .set('X-API-Key', 'test-api-key');
        
      expect(inProgressResponse.status).toBe(200);
      expect(inProgressResponse.body.length).toBe(1);
      expect(inProgressResponse.body[0].title).toBe('In progress task');
    });
    
    it('should return error for invalid status filter', async () => {
      const response = await request(app)
        .get('/tasks?status=invalid-status')
        .set('X-API-Key', 'test-api-key');
        
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid status parameter');
      expect(response.body.validStatuses).toContain(TaskStatus.BACKLOG);
    });
    
    it('should require authentication', async () => {
      const response = await request(app)
        .get('/tasks');
        
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized: Invalid API key');
    });

    it('should return empty array when no tasks exist', async () => {
      const response = await request(app)
        .get('/tasks')
        .set('X-API-Key', 'test-api-key');
        
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
  
  describe('POST /tasks', () => {
    it('should create a new task with valid data', async () => {
      const response = await request(app)
        .post('/tasks')
        .set('X-API-Key', 'test-api-key')
        .send({ title: 'New test task' });
        
      expect(response.status).toBe(201);
      expect(response.body.title).toBe('New test task');
      expect(response.body.status).toBe(TaskStatus.BACKLOG);
      expect(response.body.completed).toBe(false);
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.updatedAt).toBeDefined();
      
      // Verify the task is actually in the store
      const tasks = TaskStore.findAll();
      expect(tasks.length).toBe(1);
      expect(tasks[0].title).toBe('New test task');
    });
    
    it('should reject task creation with invalid data', async () => {
      // Missing title
      const response1 = await request(app)
        .post('/tasks')
        .set('X-API-Key', 'test-api-key')
        .send({});
        
      expect(response1.status).toBe(400);
      expect(response1.body.errors).toBeDefined();
      
      // Empty title
      const response2 = await request(app)
        .post('/tasks')
        .set('X-API-Key', 'test-api-key')
        .send({ title: '' });
        
      expect(response2.status).toBe(400);
      expect(response2.body.errors).toBeDefined();
      
      // Non-string title
      const response3 = await request(app)
        .post('/tasks')
        .set('X-API-Key', 'test-api-key')
        .send({ title: 123 });
        
      expect(response3.status).toBe(400);
      expect(response3.body.errors).toBeDefined();
    });

    it('should require authentication for task creation', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ title: 'Test task' });
        
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized: Invalid API key');
    });
  });
  
  describe('PATCH /tasks/:id/status', () => {
    it('should update task status', async () => {
      // Create a task to update
      const task = TaskStore.create('Task to update');
      
      const response = await request(app)
        .patch(`/tasks/${task.id}/status`)
        .set('X-API-Key', 'test-api-key')
        .send({ status: TaskStatus.IN_PROGRESS });
        
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(task.id);
      expect(response.body.status).toBe(TaskStatus.IN_PROGRESS);
      expect(response.body.completed).toBe(false);
      
      // Test completing a task
      const completeResponse = await request(app)
        .patch(`/tasks/${task.id}/status`)
        .set('X-API-Key', 'test-api-key')
        .send({ status: TaskStatus.COMPLETE });
        
      expect(completeResponse.status).toBe(200);
      expect(completeResponse.body.status).toBe(TaskStatus.COMPLETE);
      expect(completeResponse.body.completed).toBe(true);
      
      // Test canceling a task
      const cancelResponse = await request(app)
        .patch(`/tasks/${task.id}/status`)
        .set('X-API-Key', 'test-api-key')
        .send({ status: TaskStatus.CANCELED });
        
      expect(cancelResponse.status).toBe(200);
      expect(cancelResponse.body.status).toBe(TaskStatus.CANCELED);
      expect(cancelResponse.body.completed).toBe(false);
    });
    
    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .patch('/tasks/non-existent-id/status')
        .set('X-API-Key', 'test-api-key')
        .send({ status: TaskStatus.IN_PROGRESS });
        
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Task not found');
    });
    
    it('should reject invalid status', async () => {
      const task = TaskStore.create('Task to update');
      
      const response = await request(app)
        .patch(`/tasks/${task.id}/status`)
        .set('X-API-Key', 'test-api-key')
        .send({ status: 'invalid-status' });
        
      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
    
    it('should require authentication', async () => {
      const task = TaskStore.create('Task to update');
      
      const response = await request(app)
        .patch(`/tasks/${task.id}/status`)
        .send({ status: TaskStatus.IN_PROGRESS });
        
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized: Invalid API key');
    });
  });
  
  describe('DELETE /tasks/:id', () => {
    it('should delete a task with valid ID', async () => {
      // Create a task to delete
      const task = TaskStore.create('Task to delete');
      
      const response = await request(app)
        .delete(`/tasks/${task.id}`)
        .set('X-API-Key', 'test-api-key');
        
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');
      
      // Verify it's actually deleted
      expect(TaskStore.findById(task.id)).toBeUndefined();
    });
    
    it('should return 404 for non-existent task ID', async () => {
      const response = await request(app)
        .delete('/tasks/non-existent-id')
        .set('X-API-Key', 'test-api-key');
        
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Task not found');
    });

    it('should require authentication for task deletion', async () => {
      const task = TaskStore.create('Test task');
      
      const response = await request(app)
        .delete(`/tasks/${task.id}`);
        
      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Unauthorized: Invalid API key');
    });
  });

  describe('API health check', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/');
        
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task Management API is running');
    });
  });
}); 