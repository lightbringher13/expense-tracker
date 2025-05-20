package com.expensetracker.web.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * Payload to create a new expense.
 */
public class CreateExpenseRequest {

    @NotNull
    @DecimalMin("0.0")
    private BigDecimal amount;

    @NotNull
    private String currency;

    private String description;

    @NotNull
    private Long categoryId;

    // getters/setters
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
}