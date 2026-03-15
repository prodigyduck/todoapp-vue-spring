# Todo App

A clean, minimal todo application inspired by [Things 3](https://culturedcode.com/things/) by Cultured Code. Built with Vue.js 3 and Spring Boot 3.2.

## Features

- Create, edit, and delete todos with title and notes
- Toggle completion status with custom circle checkboxes
- Things 3-inspired UI: flat list, inline editing, minimal design
- Optimistic UI updates for instant feedback
- Responsive layout

## Screenshots

The UI follows Things 3 design language:
- "Inbox" page title (26px, weight 600)
- Flat task list separated by thin dividers (no cards)
- Custom CSS circle checkboxes with checkmark SVG
- "+ New To-Do" blue text button with inline add form
- Inline borderless edit mode with subtle shadow elevation
- Hover-reveal edit/delete actions
- Completed tasks shown with strikethrough and reduced opacity

## Tech Stack

### Frontend
- **Vue.js 3** with Composition API (`<script setup>`)
- **Vuetify 4** (alpha) for icons and base components
- **Vue Router 4** for routing
- **Axios** for HTTP requests
- **Vite 5** for build tooling

### Backend
- **Spring Boot 3.2.0** with Java 17
- **Spring Data JPA** for data access
- **H2 Database** (in-memory) for storage
- **Spring Security** (configured to permit all requests)
- **Lombok** for boilerplate reduction
- **Spring Boot Actuator** for health monitoring

## Project Structure

```
todoapp-vue-spring/
├── frontend/
│   ├── src/
│   │   ├── views/
│   │   │   └── TodoList.vue      # Main todo list (Things 3 UI)
│   │   ├── services/
│   │   │   ├── api.js            # Axios instance
│   │   │   └── todoService.js    # Todo API client
│   │   ├── router/
│   │   │   └── index.js          # Routes (/ → TodoList)
│   │   ├── App.vue               # Root component
│   │   └── main.js               # Vuetify setup + theme
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── src/main/java/com/example/todoapp/
│   │   ├── controller/
│   │   │   └── TodoController.java
│   │   ├── service/
│   │   │   └── TodoService.java
│   │   ├── repository/
│   │   │   └── TodoRepository.java
│   │   ├── entity/
│   │   │   └── Todo.java
│   │   ├── dto/
│   │   │   ├── TodoRequest.java
│   │   │   └── TodoResponse.java
│   │   └── config/
│   │       └── SecurityConfig.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
└── README.md
```

## Prerequisites

- Java 17+
- Maven 3.6+
- Node.js 18+
- npm

No external database required — uses H2 in-memory database.

## Getting Started

### 1. Start the Backend

```bash
cd backend
mvn spring-boot:run
```

The API starts at `http://localhost:8080`.

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

### 3. Use the App

1. Open `http://localhost:5173` in your browser
2. Click "+ New To-Do" to add a task
3. Fill in a title and optional notes, then click Save
4. Click the circle checkbox to mark a task as completed
5. Hover over a task to reveal Edit and Delete buttons

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/todos` | List all todos |
| `POST` | `/api/todos` | Create a todo |
| `PUT` | `/api/todos/{id}` | Update a todo |
| `PATCH` | `/api/todos/{id}/toggle` | Toggle completion |
| `DELETE` | `/api/todos/{id}` | Delete a todo |

### Request Body (POST/PUT)

```json
{
  "title": "string",
  "description": "string"
}
```

### Response

```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false
}
```

## Development

### Frontend Build

```bash
cd frontend
npm run build        # Type-check + production build
npm run type-check   # TypeScript check only
npm run lint         # ESLint
```

### Backend Build

```bash
cd backend
mvn clean install    # Build + run tests
mvn test             # Run tests only
```

### Health Check

```
GET http://localhost:8080/actuator/health
```

## Design Notes

The UI is intentionally minimal, drawing from Things 3's design philosophy:

- **No cards** — tasks are separated by thin `1px solid #ebedf0` dividers
- **System fonts** — `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto` stack
- **Accent color** — `#2e80f2` (Things 3 blue) for interactive elements
- **Typography** — 14px base, 26px heading, weight 600 for titles
- **Animations** — 150ms transitions, no dramatic effects
- **Max width** — 680px centered content column

## Notes

- Data is stored in H2 in-memory database and resets on server restart
- The frontend proxies `/api` requests to `http://localhost:8080` via Vite dev server
- CORS is configured for `http://localhost:5173` and `http://127.0.0.1:5173`
