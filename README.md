# CampusTrack - Student Assignment Management API

## Project Overview

CampusTrack is a RESTful backend application designed to help
students manage and organize their academic assignments.

Students can create, view, update, delete, filter and sort
their assignments based on status, priority and deadlines.

The application uses JWT authentication to ensure that users
can access only their own assignments.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Supertest
- Node.js Test Runner
- MongoDB Memory Server
- Nodemon
- dotenv

## Features

- User registration and login
- JWT-based authentication
- Create assignments
- View assignments
- Update assignments
- Delete assignments
- Assignment status and priority management
- Assignment filtering and sorting
- Pagination
- Input validation
- Centralized error handling
- User-specific data isolation
- Database indexing
- Automated API testing

## Project Structure

```text
express-mongo-api/
|-- src/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- validators/
|   |-- app.js
|   |-- server.js
|-- tests/
|   |-- api.test.js
|-- .env
|-- .env.example
|-- .gitignore
|-- package.json
|-- package-lock.json
|-- README.md
```

## Installation

Install the required dependencies:

```bash
npm install
```

Configure the environment variables using the .env.example
file as a reference.

Start the development server:

```bash
npm run dev
```

The server runs at:

http://localhost:5000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a user |
| POST | /api/auth/login | Login a user |
| POST | /api/tasks | Create an assignment |
| GET | /api/tasks | View all assignments |
| GET | /api/tasks/:id | View one assignment |
| PATCH | /api/tasks/:id | Update an assignment |
| DELETE | /api/tasks/:id | Delete an assignment |

## Authentication

Protected endpoints require a valid JWT token.

Authorization header:

```text
Authorization: Bearer <token>
```

## Sample Assignment

```json
{
  "title": "DBMS Lab Record",
  "subject": "DBMS",
  "description": "Complete the lab record",
  "priority": "high",
  "status": "todo",
  "dueDate": "2026-12-05"
}
```

## Database Indexing

MongoDB indexes are used to improve query performance.

The following indexes have been verified:

- Assignment ID
- User ID
- User ID, status and creation date
- User ID and creation date
- User ID and due date

## Automated Testing

Run the automated API tests using:

```bash
npm test
```

The following test cases have been successfully executed:

1. Register a new user
2. Login with valid credentials
3. Reject requests without a token
4. Create an assignment
5. View all assignments
6. Reject assignments with an empty title
7. Update an assignment
8. Delete an assignment

## Test Results

- Total tests: 8
- Passed: 8
- Failed: 0
- Pass rate: 100%

## Security

- JWT-based authentication
- Protected API routes
- Input validation
- User-specific assignment access
- Environment variables for sensitive information

## Conclusion

CampusTrack provides a secure and organized backend
solution for student assignment management.

The application demonstrates REST API development,
database integration, authentication, CRUD operations,
validation, database indexing and automated testing.
## Additional Features

### Assignment Statistics
- Total number of assignments
- Pending assignments
- In-progress assignments
- Completed assignments
- Priority-wise statistics

Endpoint: GET /api/tasks/stats

### Role-Based Access Control (RBAC)
- Supports User and Admin roles.
- Normal users can manage their own assignments.
- Admins can access the registered user list.
- Unauthorized access is restricted.

Endpoint: GET /api/users (Admin only)

### Security
- JWT-based authentication
- Password hashing using bcrypt
- Helmet for secure HTTP headers
- CORS middleware
- API rate limiting (100 requests per 15 minutes)
- Input validation and error handling

### Query Optimization
- MongoDB compound indexes
- Mongoose lean() queries
- Filtering, searching, sorting and pagination

### Automated Testing
- 8 automated API tests passed
- 0 failed tests

Run tests using:

    npm test
