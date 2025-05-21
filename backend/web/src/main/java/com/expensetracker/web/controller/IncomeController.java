package com.expensetracker.web.controller;

import com.expensetracker.core.model.Income;
import com.expensetracker.service.IncomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
@RequiredArgsConstructor
public class IncomeController {

    private final IncomeService incomeService;

    @GetMapping
    public ResponseEntity<List<Income>> list() {
        return ResponseEntity.ok(incomeService.findAllForCurrentUser());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Income> get(@PathVariable Long id) {
        return ResponseEntity.ok(incomeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Income> create(
        @Validated @RequestBody Income dto
    ) {
        return ResponseEntity.ok(incomeService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Income> update(
        @PathVariable Long id,
        @Validated @RequestBody Income dto
    ) {
        return ResponseEntity.ok(incomeService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        incomeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}