package com.expensetracker.repository;

import com.expensetracker.core.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Expense entities
 */
@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    /**
     * Fetch all expenses belonging to a specific user
     * @param userId the ID of the user
     * @return list of expenses
     */
    List<Expense> findByUserId(Long userId);
}