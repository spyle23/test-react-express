# Task Management API Implementation

## Architecture Overview

This project implements a task management API using Express.js with TypeScript following MVC architecture:

### Model
- `Task` class represents a task with properties like id, title, completed status, and creation date
- `TaskStore` static class provides an in-memory database with CRUD operations

### Controller
- `taskController.ts` contains handler functions for each API endpoint
- Implements error handling and proper HTTP responses

### View
- JSON responses from API endpoints

### Routes
- Defined in `taskRoutes.ts`
- Implements all required endpoints

## Features Implemented

1. **API Endpoints**
   - GET /tasks - Get all tasks
   - POST /tasks - Create a new task
   - DELETE /tasks/:id - Delete a task by ID

2. **Authentication (Bonus)**
   - API key authentication via X-API-Key header
   - Custom middleware implementation

3. **Input Validation**
   - Using express-validator for input validation
   - Validates task title presence and format

4. **Error Handling**
   - Custom middleware for error handling
   - Appropriate HTTP status codes
   - Informative error messages

## Code Structure

```
backend/
├── src/
│   ├── models/
│   │   └── Task.ts
│   ├── controllers/
│   │   └── taskController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── validation.ts
│   ├── routes/
│   │   └── taskRoutes.ts
│   ├── __tests__/
│   │   └── tasks.test.ts
│   └── index.ts
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## Future Improvements

1. Persistent storage (database integration)
2. More sophisticated authentication
3. Additional task features (status updates, assignment, due dates)
4. Complete test coverage 