package com.expensetracker.repository;

import com.expensetracker.core.model.Category;
import com.expensetracker.core.model.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAllByTypeOrderByName(CategoryType type);
}