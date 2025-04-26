# Task Management API

A RESTful API for managing collaborative tasks built with Express.js and TypeScript.

## Features

- Get all tasks (with optional status filtering)
- Create new tasks
- Update task status (backlog, in progress, complete, canceled)
- Delete tasks
- API key authentication
- Input validation

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Build the project:

```bash
npm run build
```

3. Start the server:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

## API Endpoints

### Authentication

All endpoints require API key authentication.
Include the following header with all requests:

```
X-API-Key: test-api-key
```

### GET /tasks

Retrieve all tasks, optionally filtered by status.

**Optional Query Parameters:**
- `status`: Filter tasks by status (backlog, in progress, complete, canceled)

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Task title",
    "status": "backlog",
    "completed": false,
    "createdAt": "2023-07-01T12:00:00.000Z",
    "updatedAt": "2023-07-01T12:00:00.000Z"
  }
]
```

### POST /tasks

Create a new task.

**Request Body:**
```json
{
  "title": "New task title"
}
```

**Response:**
```json
{
  "id": "uuid",
  "title": "New task title",
  "status": "backlog",
  "completed": false,
  "createdAt": "2023-07-01T12:00:00.000Z",
  "updatedAt": "2023-07-01T12:00:00.000Z"
}
```

### PATCH /tasks/:id/status

Update a task's status.

**Request Body:**
```json
{
  "status": "in progress"
}
```

**Valid Status Values:**
- `backlog`
- `in progress`
- `complete`
- `canceled`

**Response:**
```json
{
  "id": "uuid",
  "title": "Task title",
  "status": "in progress",
  "completed": false,
  "createdAt": "2023-07-01T12:00:00.000Z",
  "updatedAt": "2023-07-01T12:30:00.000Z"
}
```

### DELETE /tasks/:id

Delete a task by its ID.

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

## Project Structure

- `src/models`: Data models and storage
- `src/controllers`: Request handlers
- `src/middleware`: Authentication and validation
- `src/routes`: API route definitions
- `src/index.ts`: Application entry point 