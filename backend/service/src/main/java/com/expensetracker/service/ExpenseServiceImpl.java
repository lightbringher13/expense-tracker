package com.expensetracker.service;

import com.expensetracker.core.model.Expense;
import com.expensetracker.core.model.User;
import com.expensetracker.repository.ExpenseRepository;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.repository.dto.CategoryTotal;
import com.expensetracker.repository.dto.MonthlyTotal;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @Override
    public Expense createExpense(Long userId, Expense expense) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        expense.setUser(user);
        expense.setExpenseAt(LocalDateTime.now());
        return expenseRepository.save(expense);
    }

    @Override
    public List<Expense> getExpensesForUser(Long userId) {
        return expenseRepository.findByUserId(userId);
    }

    @Override
    public Expense getExpenseById(Long userId, Long expenseId) {
        return expenseRepository.findById(expenseId)
            .filter(e -> e.getUser().getId().equals(userId))
            .orElseThrow(() -> new IllegalArgumentException("Expense not found: " + expenseId));
    }

    @Override
    public Expense updateExpense(Long userId, Long expenseId, Expense updated) {
        Expense existing = getExpenseById(userId, expenseId);
        existing.setAmount(updated.getAmount());
        existing.setCategory(updated.getCategory());
        existing.setDescription(updated.getDescription());
        // keep original expenseAt timestamp or update as needed
        return expenseRepository.save(existing);
    }

    @Override
    public void deleteExpense(Long userId, Long expenseId) {
        Expense existing = getExpenseById(userId, expenseId);
        expenseRepository.delete(existing);
    }

    @Override
    public List<CategoryTotal> getCategoryTotals(Long userId) {
        return expenseRepository.findCategoryTotals(userId);
    }

    @Override
    public List<MonthlyTotal> getMonthlyTotals(Long userId) {
        return expenseRepository.findMonthlyTotals(userId);
    }
}
