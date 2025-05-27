// src/main/java/com/expensetracker/service/ConfirmationServiceImpl.java
package com.expensetracker.service;

import com.expensetracker.core.model.*;
import com.expensetracker.repository.*;
import com.expensetracker.repository.dto.CodeConfirmationRequest;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ConfirmationServiceImpl implements ConfirmationService {

    private final VerificationCodeRepository codeRepo;
    private final UserRepository userRepo;

    @Override
    @Transactional
    public boolean confirmEmail(CodeConfirmationRequest req) {
        return codeRepo.findByUserIdAndTypeAndCode(
                    req.getUserId(),
                    CodeType.EMAIL,
                    req.getCode()
                )
                .filter(v -> v.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(v -> {
                    User u = v.getUser();
                    u.setEmailVerified(true);
                    u.setEnabled(true);
                    userRepo.save(u);
                    codeRepo.delete(v);
                    return true;
                })
                .orElse(false);
    }
}