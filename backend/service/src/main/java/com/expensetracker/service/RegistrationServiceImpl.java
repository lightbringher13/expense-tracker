// src/main/java/com/expensetracker/service/RegistrationServiceImpl.java
package com.expensetracker.service;

import com.expensetracker.core.model.*;
import com.expensetracker.repository.*;
import com.expensetracker.repository.dto.RegistrationRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.expensetracker.email.EmailService;
import java.time.LocalDateTime;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl implements RegistrationService {

    private final UserRepository userRepo;
    private final VerificationCodeRepository codeRepo;
    private final EmailService emailService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    @Transactional
    public void registerAndSendCodes(RegistrationRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        User u = User.builder()
            .email(req.getEmail())
            .password(passwordEncoder.encode(req.getPassword()))
            .fullName(req.getFullName())
            .registeredAt(LocalDateTime.now())
            .role(UserRole.USER)
            .build();
        userRepo.save(u);

        codeRepo.deleteByExpiresAtBefore(LocalDateTime.now());

        // generate email code
        String emailCode = String.format("%06d", 
            ThreadLocalRandom.current().nextInt(1_000_000));
        codeRepo.save(VerificationCode.builder()
            .user(u).type(CodeType.EMAIL)
            .code(emailCode)
            .expiresAt(LocalDateTime.now().plusMinutes(15))
            .build());
        emailService.sendCode(u.getEmail(), emailCode);
    }
}