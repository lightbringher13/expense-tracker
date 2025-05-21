package com.expensetracker.service;

import com.expensetracker.core.model.Category;
import com.expensetracker.core.model.CategoryType;
import java.util.List;

public interface CategoryService {
    Category create(Category dto);
    Category update(Long id, Category dto);
    void delete(Long id);
    Category findById(Long id);
    List<Category> findAll(CategoryType type);
}