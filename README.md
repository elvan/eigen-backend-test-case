# Library Management System

A robust library management system built with NestJS, TypeScript, MySQL, and following Domain-Driven Design principles.

## Features

- Book management (add, view, update books)
- Member management (add, view, update members)
- Book borrowing with business rules:
  - Members cannot borrow more than 2 books
  - Books already borrowed are not available to others
  - Members with penalties cannot borrow books
- Book returns with penalty system:
  - Returns after 7 days result in a 3-day penalty
- Comprehensive API documentation via Swagger
- Follows Domain-Driven Design architecture
- Fully tested with unit tests

## Technology Stack

- [NestJS](https://nestjs.com/) - Modern, TypeScript-based Node.js framework
- TypeScript - Type-safe language that compiles to JavaScript
- MySQL - Relational database for data persistence
- TypeORM - ORM for database interactions
- Swagger - API documentation

## Project Structure

The project follows a Domain-Driven Design architecture:

```
src/
├── domain/             # Domain layer - entities, repository interfaces
│   ├── entities/       # Domain entities (Book, Member, Borrowing)
│   ├── repositories/   # Repository interfaces
│   └── services/       # Domain services
├── application/        # Application layer - use cases, services
│   ├── services/       # Application services
│   └── dtos/           # Data Transfer Objects
├── infrastructure/     # Infrastructure layer - repositories, database config
│   ├── repositories/   # Repository implementations
│   └── database/       # Database configuration
└── presentation/       # Presentation layer - controllers, API endpoints
    ├── controllers/    # REST controllers
    └── dtos/           # Request/Response DTOs
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MySQL server

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd eigen-backend-test-case
```

2. Install dependencies:
```bash
npm install
```

3. Configure the environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your database credentials
```

4. Run the application:
```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

5. Access the API documentation:
```
http://localhost:3000/api
```

## Testing

Run the unit tests:
```bash
npm run test
```

## API Endpoints

The API provides the following endpoints:

### Books
- `GET /books` - List all books
- `GET /books/:code` - Get book by code
- `POST /books` - Create a new book
- `PUT /books/:code` - Update a book

### Members
- `GET /members` - List all members
- `GET /members/:code` - Get member by code
- `POST /members` - Create a new member
- `PUT /members/:code` - Update a member

### Borrowings
- `GET /borrowings` - List all borrowings
- `GET /borrowings/:id` - Get borrowing by ID
- `POST /borrowings/borrow` - Borrow a book
- `POST /borrowings/return` - Return a book
- `GET /borrowings/member/:memberCode` - Get active borrowings by member

## License

This project is licensed under the MIT License.
