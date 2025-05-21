package com.expensetracker.service;

import com.expensetracker.core.model.Income;
import java.util.List;

public interface IncomeService {
    Income create(Income income);
    Income update(Long id, Income income);
    void delete(Long id);
    Income findById(Long id);
    List<Income> findAllForCurrentUser();
}