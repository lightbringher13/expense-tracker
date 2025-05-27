// src/main/java/com/expensetracker/service/ConfirmationService.java
package com.expensetracker.service;

import com.expensetracker.repository.dto.CodeConfirmationRequest;

public interface ConfirmationService {
    boolean confirmEmail(CodeConfirmationRequest req);
}