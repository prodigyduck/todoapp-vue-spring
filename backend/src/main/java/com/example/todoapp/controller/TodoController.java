package com.example.todoapp.controller;

import com.example.todoapp.dto.TodoRequest;
import com.example.todoapp.dto.TodoResponse;
import com.example.todoapp.service.TodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<List<TodoResponse>> getAllTodos() {
        List<TodoResponse> todos = todoService.getAllTodos();
        return ResponseEntity.ok(todos);
    }

    @GetMapping("/myday")
    public ResponseEntity<List<TodoResponse>> getMyDayTodos() {
        List<TodoResponse> todos = todoService.getMyDayTodos();
        return ResponseEntity.ok(todos);
    }

    @GetMapping("/important")
    public ResponseEntity<List<TodoResponse>> getImportantTodos() {
        List<TodoResponse> todos = todoService.getImportantTodos();
        return ResponseEntity.ok(todos);
    }

    @GetMapping("/list/{listName}")
    public ResponseEntity<List<TodoResponse>> getTodosByListName(@PathVariable String listName) {
        List<TodoResponse> todos = todoService.getTodosByListName(listName);
        return ResponseEntity.ok(todos);
    }

    @PostMapping
    public ResponseEntity<TodoResponse> createTodo(@RequestBody TodoRequest request) {
        TodoResponse todo = todoService.createTodo(request);
        return ResponseEntity.ok(todo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoResponse> updateTodo(@PathVariable Long id, @RequestBody TodoRequest request) {
        TodoResponse todo = todoService.updateTodo(id, request);
        return ResponseEntity.ok(todo);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TodoResponse> toggleTodo(@PathVariable Long id) {
        TodoResponse todo = todoService.toggleTodo(id);
        return ResponseEntity.ok(todo);
    }

    @PatchMapping("/{id}/important")
    public ResponseEntity<TodoResponse> toggleImportant(@PathVariable Long id) {
        TodoResponse todo = todoService.toggleImportant(id);
        return ResponseEntity.ok(todo);
    }

    @PatchMapping("/{id}/myday")
    public ResponseEntity<TodoResponse> toggleMyDay(@PathVariable Long id) {
        TodoResponse todo = todoService.toggleMyDay(id);
        return ResponseEntity.ok(todo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable Long id) {
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }

}
