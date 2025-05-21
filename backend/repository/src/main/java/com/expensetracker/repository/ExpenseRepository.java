package com.expensetracker.repository;

import com.expensetracker.core.model.Expense;
import com.expensetracker.repository.dto.CategoryTotal;
import com.expensetracker.repository.dto.MonthlyTotal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserId(Long userId);

    @Query("""
        SELECT new com.expensetracker.repository.dto.CategoryTotal(
            e.category.name,
            SUM(e.amount.amount)
        )
        FROM Expense e
        WHERE e.user.id = :userId
        GROUP BY e.category.name
    """)
    List<CategoryTotal> findCategoryTotals(@Param("userId") Long userId);

    @Query("""
        SELECT new com.expensetracker.repository.dto.MonthlyTotal(
            YEAR(e.expenseAt),
            MONTH(e.expenseAt),
            SUM(e.amount.amount)
        )
        FROM Expense e
        WHERE e.user.id = :userId
        GROUP BY YEAR(e.expenseAt), MONTH(e.expenseAt)
        ORDER BY YEAR(e.expenseAt), MONTH(e.expenseAt)
    """)
    List<MonthlyTotal> findMonthlyTotals(@Param("userId") Long userId);
}