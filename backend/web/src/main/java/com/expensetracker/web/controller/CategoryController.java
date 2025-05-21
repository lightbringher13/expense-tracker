package com.expensetracker.web.controller;

import com.expensetracker.core.model.Category;
import com.expensetracker.core.model.CategoryType;
import com.expensetracker.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService svc;

    @GetMapping
    public ResponseEntity<List<Category>> list(
        @RequestParam(value="type", defaultValue="EXPENSE") CategoryType type
    ) {
        return ResponseEntity.ok(svc.findAll(type));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> get(@PathVariable Long id) {
        return ResponseEntity.ok(svc.findById(id));
    }

    @PostMapping
    public ResponseEntity<Category> create(@RequestBody Category dto) {
        return ResponseEntity.ok(svc.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> update(
        @PathVariable Long id,
        @RequestBody Category dto
    ) {
        return ResponseEntity.ok(svc.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        svc.delete(id);
        return ResponseEntity.noContent().build();
    }
}