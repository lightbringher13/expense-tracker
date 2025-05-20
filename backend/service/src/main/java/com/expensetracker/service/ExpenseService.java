package com.expensetracker.service;

import com.expensetracker.core.model.Expense;
import java.util.List;

/**
 * Business operations for managing expenses.
 */
public interface ExpenseService {

    /**
     * Create a new expense for a given user.
     */
    Expense createExpense(Long userId, Expense expense);

    /**
     * Retrieve all expenses belonging to a given user.
     */
    List<Expense> getExpensesForUser(Long userId);

    /**
     * Retrieve a specific expense by ID for a given user.
     */
    Expense getExpenseById(Long userId, Long expenseId);

    /**
     * Update an existing expense for a given user.
     */
    Expense updateExpense(Long userId, Long expenseId, Expense expense);

    /**
     * Delete an expense for a given user.
     */
    void deleteExpense(Long userId, Long expenseId);
}