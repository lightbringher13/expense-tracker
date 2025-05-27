package com.expensetracker.email;

public interface EmailService {
    /**
     * Send a one-time verification code (e.g. 6-digit PIN) to the given address.
     */
    void sendCode(String to, String code);
}