# Todo App with Vue.js 3 and Spring Boot

A full-stack todo application with JWT authentication, built with Vue.js 3 (frontend) and Spring Boot 3.2 (backend).

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete todos
- Mark todos as completed/incomplete
- Secure password storage with BCrypt
- PostgreSQL + Flyway migration support
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
- npm
- PostgreSQL 15+ (for local backend run)

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

3. Configure local database (defaults from `application.properties`):

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tododb
spring.datasource.username=postgres
spring.datasource.password=password
```

4. Run the Spring Boot application:
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

3. (Optional) override API URL with environment variable:

```bash
cp .env.example .env.local
```

Default development config is in `.env.development`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

4. Start the development server:
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
- PostgreSQL
- Flyway
- Spring Boot Actuator
- Lombok

### Frontend
- Vue.js 3
- Vue Router
- Pinia (state management)
- Axios (HTTP client)
- Vite (build tool)

## Database

The application uses PostgreSQL and Flyway migrations.

Connection details:
- JDBC URL: `jdbc:postgresql://localhost:5432/tododb`
- Username: `postgres`
- Password: `password` (default local value)

Migrations are located in `backend/src/main/resources/db/migration`.

## Security

- Passwords are encrypted using BCrypt
- JWT tokens are used for authentication
- CORS is configured for the frontend origin
- All todo endpoints require authentication

## Development Notes

- The backend runs on port 8080
- The frontend runs on port 5173
- JWT tokens expire after 24 hours (configurable in application.properties)
- API base URL is environment-driven via `VITE_API_BASE_URL` (fallback: `/api`)
- Health endpoint: `http://localhost:8080/actuator/health`
