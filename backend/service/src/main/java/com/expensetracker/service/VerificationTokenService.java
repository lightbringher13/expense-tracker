package com.expensetracker.service;

import com.expensetracker.core.model.User;

public interface VerificationTokenService {
    String createToken(User user);
    boolean validateToken(String token);
}