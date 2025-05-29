// src/main/java/com/expensetracker/email/EmailService.java
package com.expensetracker.email;

public interface EmailService {
    /**
     * Send a magic-link email to the given address.
     *
     * @param to   recipient email
     * @param link magic-link URL
     */
    void sendMagicLink(String to, String link);
}