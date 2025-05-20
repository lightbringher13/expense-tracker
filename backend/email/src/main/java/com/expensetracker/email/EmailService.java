package com.expensetracker.email;

public interface EmailService {
    void sendVerificationEmail(String to, String token);
}