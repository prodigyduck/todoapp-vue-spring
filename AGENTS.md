# AGENTS.md: Vue.js 3 + Spring Boot 3.2.0 Development Guidelines

## Build/Test/Run Commands

### Frontend (Vue.js 3 + Vite)
```bash
# Install dependencies
npm install

# Development server
npm run dev
# Starts on http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview

# Tests (need to be configured - currently no test script)
npm run test  # Add this script in package.json
```

### Backend (Spring Boot 3.2.0)
```bash
# Build project
mvn clean install

# Run application
mvn spring-boot:run
# Starts on http://localhost:8080

# Run tests
mvn test

# Run specific test class
mvn test -Dtest=AuthControllerTest

# Run specific test method
mvn test -Dtest=AuthControllerTest#testLogin

# Skip tests during build
mvn clean install -DskipTests

# Generate test coverage report
mvn jacoco:report
```

## Project Structure

### Frontend Directory Layout
```
frontend/
├── src/
│   ├── assets/          # Static assets (images, CSS)
│   ├── components/      # Reusable Vue components
│   ├── composables/     # Composition API functions (use*.js)
│   ├── views/           # Page-level components
│   ├── stores/          # Pinia state management
│   ├── router/          # Vue Router configuration
│   ├── services/        # API service layers
│   ├── App.vue          # Root component
│   └── main.js          # Application entry point
├── public/             # Public static files
├── package.json
├── vite.config.js
└── .env               # Environment variables
```

### Backend Directory Layout
```
backend/
├── src/main/java/com/example/todoapp/
│   ├── TodoAppApplication.java    # Main application class
│   ├── controller/              # REST API endpoints
│   ├── service/                 # Business logic layer
│   ├── repository/              # Data access layer
│   ├── entity/                 # JPA entities
│   ├── dto/                    # Data transfer objects
│   ├── security/                # JWT and security configuration
│   └── config/                 # Spring configuration
├── src/main/resources/
│   ├── application.properties     # Application configuration
│   └── static/                 # Static resources
├── src/test/java/               # Test classes
└── pom.xml                    # Maven configuration
```

## Code Style Guidelines

### Vue.js 3 Frontend

#### Component Structure
```vue
<script setup>
// 1. Vue imports
import { ref, computed, onMounted } from 'vue'
// 2. Third-party imports
import axios from 'axios'
// 3. Local imports
import UserList from '@/components/UserList.vue'

// Reactive state
const count = ref(0)
const title = computed(() => `Count: ${count.value}`)

// Methods
const increment = () => {
  count.value++
}

// Lifecycle hooks
onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <div class="counter">
    <h1>{{ title }}</h1>
    <button @click="increment">{{ count }}</button>
    <UserList />
  </div>
</template>

<style scoped>
.counter {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
```

#### Naming Conventions
- **Components**: PascalCase (`UserList.vue`, `TodoItem.vue`)
- **Files**: kebab-case (`user-list.vue`, `todo-item.vue`)
- **Composables**: Prefix with `use` and PascalCase (`useUserAuth`, `useTodos`)
- **Stores**: kebab-case (`auth-store.js`, `todo-store.js`)
- **Variables/Functions**: camelCase (`getUserById`, `isLoading`)

#### Pinia Store Pattern
```javascript
// stores/auth-store.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const token = ref(localStorage.getItem('token') || '')
  const user = ref(null)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)

  // Actions
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      token.value = response.token
      user.value = response.user
      localStorage.setItem('token', response.token)
    } catch (err) {
      error.value = err.message
    }
  }

  const logout = () => {
    token.value = ''
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    // State
    token, user, error,
    // Getters
    isAuthenticated,
    // Actions
    login, logout
  }
})
```

### Java 17 Backend

#### Naming Conventions
- **Classes**: PascalCase (`TodoService`, `UserRepository`)
- **Methods**: camelCase (`getAllTodos`, `createUser`)
- **Constants**: UPPER_SNAKE_CASE (`JWT_SECRET`, `DEFAULT_PAGE_SIZE`)
- **Packages**: lowercase, dot-separated (`com.example.todoapp.controller`)
- **Variables**: camelCase (`userRepository`, `jwtTokenProvider`)

#### Controller Pattern
```java
@RestController
@RequestMapping("/api/todos")
@Validated
public class TodoController {
    
    private final TodoService todoService;
    
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }
    
    @GetMapping
    public ResponseEntity<List<Todo>> getAllTodos() {
        List<Todo> todos = todoService.findAllForCurrentUser();
        return ResponseEntity.ok(todos);
    }
    
    @PostMapping
    public ResponseEntity<Todo> createTodo(@Valid @RequestBody TodoRequest request) {
        Todo todo = todoService.create(request);
        return ResponseEntity.created(URI.create("/api/todos/" + todo.getId()))
                         .body(todo);
    }
}
```

#### Service Layer Pattern
```java
@Service
@Transactional
@RequiredArgsConstructor
public class TodoService {
    
    private final TodoRepository todoRepository;
    private final UserService userService;
    
    public List<Todo> findAllForCurrentUser() {
        User currentUser = userService.getCurrentUser();
        return todoRepository.findByUserId(currentUser.getId());
    }
    
    public Todo create(TodoRequest request) {
        User currentUser = userService.getCurrentUser();
        Todo todo = new Todo(request.getTitle(), request.getDescription(), currentUser);
        return todoRepository.save(todo);
    }
}
```

#### Entity Pattern with Lombok
```java
@Entity
@Table(name = "todos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Todo {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    private String description;
    
    @Column(nullable = false)
    private Boolean completed = false;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @PrePersist
    protected void onCreate() {
        completed = false;
    }
}
```

#### DTO Pattern with Lombok
```java
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodoRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;
    
    @Size(max = 500, message = "Description must not exceed 500 characters")
    private String description;
}
```

## Import Organization

### Vue.js/JavaScript
```javascript
// Order: 1. Vue imports, 2. Third-party, 3. Local imports
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import TodoList from '@/components/TodoList.vue'
import { useAuthStore } from '@/stores/auth-store'
import { useTodos } from '@/composables/useTodos'
```

### Java
```java
// Order: 1. java.*, 2. jakarta.*, 3. org.*, 4. com.*
package com.example.todoapp.controller;

import java.util.List;
import java.net.URI;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.todoapp.dto.TodoRequest;
import com.example.todoapp.service.TodoService;
```

## Error Handling

### Frontend Error Handling
```javascript
// composables/useErrorHandler.js
import { ref } from 'vue'

export function useErrorHandler() {
  const error = ref(null)
  
  const handleError = (err) => {
    console.error('API Error:', err)
    error.value = {
      message: err.response?.data?.message || err.message || 'An unexpected error occurred',
      status: err.response?.status || 500
    }
  }
  
  const clearError = () => {
    error.value = null
  }
  
  return { error, handleError, clearError }
}
```

### Backend Error Handling
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            HttpStatus.NOT_FOUND.value(),
            ex.getMessage(),
            System.currentTimeMillis()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        
        ErrorResponse error = new ErrorResponse(
            HttpStatus.BAD_REQUEST.value(),
            "Validation failed: " + errors,
            System.currentTimeMillis()
        );
        return ResponseEntity.badRequest().body(error);
    }
}
```

## Testing Guidelines

### Frontend Testing (Recommended Setup)
```bash
# Install testing dependencies
npm install -D vitest @vue/test-utils jsdom

# Configure package.json test script
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest --coverage"
```

```javascript
// tests/components/TodoList.test.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoList from '@/components/TodoList.vue'

describe('TodoList', () => {
  it('renders todo items correctly', () => {
    const todos = [
      { id: 1, title: 'Test todo', completed: false }
    ]
    
    const wrapper = mount(TodoList, {
      props: { todos }
    })
    
    expect(wrapper.text()).toContain('Test todo')
    expect(wrapper.find('[data-testid="todo-item"]').exists()).toBe(true)
  })
})
```

### Backend Testing
```java
// Test for Controller layer
@WebMvcTest(TodoController.class)
class TodoControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private TodoService todoService;
    
    @Test
    void shouldGetAllTodos() throws Exception {
        List<Todo> todos = List.of(new Todo(1L, "Test todo", false));
        when(todoService.findAllForCurrentUser()).thenReturn(todos);
        
        mockMvc.perform(get("/api/todos")
                .header("Authorization", "Bearer valid-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title", is("Test todo")));
    }
}

// Integration test
@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class TodoIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void shouldCreateTodo() {
        TodoRequest request = new TodoRequest("New todo", "Description");
        ResponseEntity<Todo> response = restTemplate.postForEntity("/api/todos", request, Todo.class);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getTitle()).isEqualTo("New todo");
    }
}
```

## Configuration Best Practices

### Frontend Configuration (vite.config.js)
```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

### Backend Configuration (application.properties)
```properties
# Server Configuration
server.port=8080
server.servlet.context-path=

# Database Configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=password
spring.h2.console.enabled=true

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=false

# JWT Configuration
jwt.secret=mySecretKey123456789
jwt.expiration=86400000

# CORS Configuration
cors.allowed-origins=http://localhost:5173
```

## Security Best Practices

### JWT Implementation
```java
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {
    
    @Value("${jwt.secret}")
    private String jwtSecret;
    
    @Value("${jwt.expiration}")
    private Long jwtExpiration;
    
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
```

### Security Configuration
```java
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/h2-console/**").permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
```

## Environment-Specific Configuration

### Frontend (.env files)
```
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_TITLE=Todo App - Development

# .env.production
VITE_API_BASE_URL=https://api.yourapp.com/api
VITE_APP_TITLE=Todo App
```

### Backend (Spring Profiles)
```properties
# application-dev.properties
spring.datasource.url=jdbc:h2:mem:testdb
logging.level.com.example.todoapp=DEBUG

# application-prod.properties
spring.datasource.url=jdbc:postgresql://prod-db:5432/tododb
logging.level.com.example.todoapp=WARN
```

This comprehensive guide provides consistent patterns and best practices for developing maintainable Vue.js 3 + Spring Boot 3.2.0 applications.