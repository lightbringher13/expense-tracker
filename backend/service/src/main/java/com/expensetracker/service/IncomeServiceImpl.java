package com.expensetracker.service;

import com.expensetracker.core.model.Income;
import com.expensetracker.repository.IncomeRepository;
import com.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeServiceImpl implements IncomeService {

    private final IncomeRepository incomeRepo;
    private final UserRepository userRepo;

    private Long currentUserId() {
        String email = SecurityContextHolder.getContext()
                         .getAuthentication().getName();
        return userRepo.findByEmail(email)
                       .orElseThrow().getId();
    }

    @Override
    public Income create(Income income) {
        income.setUser(
          userRepo.findById(currentUserId()).orElseThrow()
        );
        return incomeRepo.save(income);
    }

    @Override
    public Income update(Long id, Income dto) {
        Income existing = findById(id);
        existing.setAmount(dto.getAmount());
        existing.setSource(dto.getSource());
        existing.setReceivedAt(dto.getReceivedAt());
        return incomeRepo.save(existing);
    }

    @Override
    public void delete(Long id) {
        incomeRepo.delete(findById(id));
    }

    @Override
    public Income findById(Long id) {
        return incomeRepo.findById(id)
               .filter(i -> i.getUser().getId().equals(currentUserId()))
               .orElseThrow(() -> new IllegalArgumentException("Not found"));
    }

    @Override
    public List<Income> findAllForCurrentUser() {
        return incomeRepo.findAllByUserIdOrderByReceivedAtDesc(currentUserId());
    }
}