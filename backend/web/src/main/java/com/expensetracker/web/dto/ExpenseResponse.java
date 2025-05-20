package com.expensetracker.web.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Representation of an expense returned to the client.
 */
public class ExpenseResponse {

    private Long id;
    private BigDecimal amount;
    private String currency;
    private String description;
    private Long categoryId;
    private LocalDateTime expenseAt;

    public ExpenseResponse() {}

    public ExpenseResponse(Long id, BigDecimal amount, String currency,
                           String description, Long categoryId, LocalDateTime expenseAt) {
        this.id = id;
        this.amount = amount;
        this.currency = currency;
        this.description = description;
        this.categoryId = categoryId;
        this.expenseAt = expenseAt;
    }

    // getters only
    public Long getId() { return id; }
    public BigDecimal getAmount() { return amount; }
    public String getCurrency() { return currency; }
    public String getDescription() { return description; }
    public Long getCategoryId() { return categoryId; }
    public LocalDateTime getExpenseAt() { return expenseAt; }
}