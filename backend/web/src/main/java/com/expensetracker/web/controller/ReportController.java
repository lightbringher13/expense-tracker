package com.expensetracker.web.controller;

import com.expensetracker.repository.dto.MonthlyTotal;
import com.expensetracker.repository.dto.CategoryTotal;
import com.expensetracker.service.ExpenseService;
import com.expensetracker.service.UserService;
import com.expensetracker.core.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ExpenseService expenseService;
    private final UserService userService;

    /** 1) Monthly totals **/
    @GetMapping("/monthly")
    public ResponseEntity<List<MonthlyTotal>> getMonthlyTotals(Principal principal) {
        Long userId = extractUserId(principal);
        List<MonthlyTotal> data = expenseService.getMonthlyTotals(userId);
        return ResponseEntity.ok(data);
    }

    /** 2) Category breakdown **/
    @GetMapping("/by-category")
    public ResponseEntity<List<CategoryTotal>> getCategoryTotals(Principal principal) {
        Long userId = extractUserId(principal);
        List<CategoryTotal> data = expenseService.getCategoryTotals(userId);
        return ResponseEntity.ok(data);
    }

    /** Helper to turn the JWT‐powered Principal into your internal userId **/
    private Long extractUserId(Principal principal) {
        String email = principal.getName();
        User user = userService.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException(
                "No user found for email: " + email));
        return user.getId();
    }
}