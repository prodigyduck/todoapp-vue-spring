# Todo App with Vue.js 3 and Spring Boot

A full-stack todo application with user authentication, built with Vue.js 3 (frontend) and Spring Boot (backend).

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete todos
- Mark todos as completed/incomplete
- Secure password storage with BCrypt
- Responsive design with modern UI

## Project Structure

```
.
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/com/example/todoapp/
│   │       │   ├── controller/     # REST controllers
│   │       │   ├── service/        # Business logic
│   │       │   ├── repository/     # Data access layer
│   │       │   ├── entity/         # JPA entities
│   │       │   ├── security/       # JWT and security config
│   │       │   ├── config/          # Spring configuration
│   │       │   └── dto/            # Data transfer objects
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
└── frontend/                # Vue.js 3 frontend
    ├── src/
    │   ├── components/      # Vue components
    │   ├── views/           # Page components
    │   ├── services/        # API services
    │   ├── stores/          # Pinia state management
    │   ├── router/          # Vue Router
    │   ├── App.vue
    │   └── main.js
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- Node.js 18+
- npm or yarn

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the Spring Boot application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Register a new account using the Register page
3. Login with your credentials
4. Add, complete, and delete todos as needed

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ "username": "string", "password": "string" }`
- `POST /api/auth/login` - Login and get JWT token
  - Body: `{ "username": "string", "password": "string" }`

### Todos

- `GET /api/todos` - Get all todos for authenticated user
- `POST /api/todos` - Create a new todo
  - Body: `{ "title": "string", "description": "string" }`
- `PUT /api/todos/{id}` - Update a todo
  - Body: `{ "title": "string", "description": "string" }`
- `PATCH /api/todos/{id}/toggle` - Toggle todo completion status
- `DELETE /api/todos/{id}` - Delete a todo

## Technology Stack

### Backend
- Spring Boot 3.2.0
- Spring Security
- Spring Data JPA
- JWT (jjwt)
- H2 Database
- Lombok

### Frontend
- Vue.js 3
- Vue Router
- Pinia (state management)
- Axios (HTTP client)
- Vite (build tool)

## Database

The application uses H2 in-memory database for development. The H2 console is available at `http://localhost:8080/h2-console`

Connection details:
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: `password`

## Security

- Passwords are encrypted using BCrypt
- JWT tokens are used for authentication
- CORS is configured for the frontend origin
- All todo endpoints require authentication

## Development Notes

- The backend runs on port 8080
- The frontend runs on port 5173
- JWT tokens expire after 24 hours (configurable in application.properties)
- The database schema is auto-created by Hibernate
