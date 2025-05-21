package com.expensetracker.repository;

import com.expensetracker.core.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {
    List<Income> findAllByUserIdOrderByReceivedAtDesc(Long userId);
}