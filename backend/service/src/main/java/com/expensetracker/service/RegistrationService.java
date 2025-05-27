// src/main/java/com/expensetracker/service/RegistrationService.java
package com.expensetracker.service;

import com.expensetracker.repository.dto.RegistrationRequest;

public interface RegistrationService {
    void registerAndSendCodes(RegistrationRequest req);
}