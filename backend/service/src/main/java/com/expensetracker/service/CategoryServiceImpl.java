package com.expensetracker.service;

import com.expensetracker.core.model.Category;
import com.expensetracker.core.model.CategoryType;
import com.expensetracker.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryRepository repo;

    @Override
    public Category create(Category dto) {
        return repo.save(dto);
    }

    @Override
    public Category update(Long id, Category dto) {
        Category existing = findById(id);
        existing.setName(dto.getName());
        existing.setType(dto.getType());
        return repo.save(existing);
    }

    @Override
    public void delete(Long id) {
        repo.delete(findById(id));
    }

    @Override
    public Category findById(Long id) {
        return repo.findById(id)
                   .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }

    @Override
    public List<Category> findAll(CategoryType type) {
        return repo.findAllByTypeOrderByName(type);
    }
}