package com.example.todoapp.service;

import com.example.todoapp.dto.TodoRequest;
import com.example.todoapp.dto.TodoResponse;
import com.example.todoapp.entity.Todo;
import com.example.todoapp.repository.TodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoRepository todoRepository;

    public List<TodoResponse> getAllTodos() {
        return todoRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<TodoResponse> getMyDayTodos() {
        return todoRepository.findByMyDayTrue()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<TodoResponse> getImportantTodos() {
        return todoRepository.findByImportantTrue()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public List<TodoResponse> getTodosByListName(String listName) {
        return todoRepository.findByListName(listName)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public TodoResponse createTodo(TodoRequest request) {
        Todo todo = new Todo();
        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        todo.setCompleted(false);
        todo.setImportant(request.getImportant() != null ? request.getImportant() : false);
        todo.setMyDay(request.getMyDay() != null ? request.getMyDay() : false);
        todo.setListName(request.getListName());

        todoRepository.save(todo);
        return convertToResponse(todo);
    }

    public TodoResponse updateTodo(Long id, TodoRequest request) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        todo.setTitle(request.getTitle());
        todo.setDescription(request.getDescription());
        if (request.getImportant() != null) {
            todo.setImportant(request.getImportant());
        }
        if (request.getMyDay() != null) {
            todo.setMyDay(request.getMyDay());
        }
        if (request.getListName() != null) {
            todo.setListName(request.getListName());
        }

        todoRepository.save(todo);
        return convertToResponse(todo);
    }

    public TodoResponse toggleTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        todo.setCompleted(!todo.getCompleted());
        todoRepository.save(todo);
        return convertToResponse(todo);
    }

    public TodoResponse toggleImportant(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        todo.setImportant(!todo.getImportant());
        todoRepository.save(todo);
        return convertToResponse(todo);
    }

    public TodoResponse toggleMyDay(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        todo.setMyDay(!todo.getMyDay());
        todoRepository.save(todo);
        return convertToResponse(todo);
    }

    public void deleteTodo(Long id) {
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Todo not found"));

        todoRepository.delete(todo);
    }

    private TodoResponse convertToResponse(Todo todo) {
        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.getCompleted(),
                todo.getImportant(),
                todo.getMyDay(),
                todo.getListName()
        );
    }

}
