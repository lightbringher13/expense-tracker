package com.expensetracker.web.controller;

import com.expensetracker.core.model.Expense;
import com.expensetracker.service.ExpenseService;
import com.expensetracker.web.dto.CreateExpenseRequest;
import com.expensetracker.web.dto.ExpenseResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ExpenseResponse createExpense(
        @AuthenticationPrincipal com.expensetracker.core.model.User user,
        @Valid @RequestBody CreateExpenseRequest req) {

        Expense toCreate = Expense.builder()
            .amount(com.expensetracker.core.model.vo.Money.builder()
                        .amount(req.getAmount())
                        .currency(req.getCurrency())
                        .build())
            .description(req.getDescription())
            .category(com.expensetracker.core.model.Category.builder()
                        .id(req.getCategoryId())
                        .build())
            .build();

        Expense saved = expenseService.createExpense(user.getId(), toCreate);
        return new ExpenseResponse(
            saved.getId(),
            saved.getAmount().getAmount(),
            saved.getAmount().getCurrency(),
            saved.getDescription(),
            saved.getCategory().getId(),
            saved.getExpenseAt()
        );
    }

    @GetMapping
    public List<ExpenseResponse> listExpenses(@AuthenticationPrincipal com.expensetracker.core.model.User user) {
        return expenseService.getExpensesForUser(user.getId()).stream()
            .map(e -> new ExpenseResponse(
                e.getId(),
                e.getAmount().getAmount(),
                e.getAmount().getCurrency(),
                e.getDescription(),
                e.getCategory().getId(),
                e.getExpenseAt()
            ))
            .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ExpenseResponse getExpense(
        @AuthenticationPrincipal com.expensetracker.core.model.User user,
        @PathVariable Long id) {
        Expense e = expenseService.getExpenseById(user.getId(), id);
        return new ExpenseResponse(
            e.getId(), e.getAmount().getAmount(), e.getAmount().getCurrency(),
            e.getDescription(), e.getCategory().getId(), e.getExpenseAt()
        );
    }

    @PutMapping("/{id}")
    public ExpenseResponse updateExpense(
        @AuthenticationPrincipal com.expensetracker.core.model.User user,
        @PathVariable Long id,
        @Valid @RequestBody CreateExpenseRequest req) {
        Expense toUpdate = Expense.builder()
            .amount(com.expensetracker.core.model.vo.Money.builder()
                        .amount(req.getAmount())
                        .currency(req.getCurrency())
                        .build())
            .description(req.getDescription())
            .category(com.expensetracker.core.model.Category.builder()
                        .id(req.getCategoryId())
                        .build())
            .build();

        Expense updated = expenseService.updateExpense(user.getId(), id, toUpdate);
        return new ExpenseResponse(
            updated.getId(), updated.getAmount().getAmount(), updated.getAmount().getCurrency(),
            updated.getDescription(), updated.getCategory().getId(), updated.getExpenseAt()
        );
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(
        @AuthenticationPrincipal com.expensetracker.core.model.User user,
        @PathVariable Long id) {
        expenseService.deleteExpense(user.getId(), id);
    }
}