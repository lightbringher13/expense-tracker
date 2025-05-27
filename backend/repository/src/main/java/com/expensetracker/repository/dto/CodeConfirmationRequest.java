// src/main/java/com/expensetracker/repository/dto/CodeConfirmationRequest.java
package com.expensetracker.repository.dto;

import lombok.Data;

@Data
public class CodeConfirmationRequest {
    private Long   userId;
    private String code;
}