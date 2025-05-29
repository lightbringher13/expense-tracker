// src/main/java/com/expensetracker/email/EmailServiceImpl.java
package com.expensetracker.email;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.email.from:no-reply@yourapp.com}")
    private String fromAddress;

    @Override
    public void sendMagicLink(String to, String link) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(fromAddress);
        msg.setTo(to);
        msg.setSubject("Your Magic Login Link");
        msg.setText(
            "Hello,\n\n" +
            "Click the link below to sign in (valid for 15 minutes):\n\n" +
            link + "\n\n" +
            "If you didn't request this, you can safely ignore this email.\n\n" +
            "— YourApp Team"
        );
        mailSender.send(msg);
    }
}