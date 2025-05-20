package com.expensetracker.service;

import com.expensetracker.core.model.VerificationToken;
import com.expensetracker.repository.VerificationTokenRepository;
import com.expensetracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.expensetracker.core.model.User; 

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerificationTokenServiceImpl implements VerificationTokenService {

    private final VerificationTokenRepository tokenRepo;
    private final UserRepository userRepo;

    @Override
    public String createToken(User user) {
        // cleanup old tokens
        tokenRepo.deleteByExpiresAtBefore(LocalDateTime.now());

        String token = UUID.randomUUID().toString();
        VerificationToken vt = VerificationToken.builder()
                .token(token)
                .user(user)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();
        tokenRepo.save(vt);
        return token;
    }

    @Override
    public boolean validateToken(String token) {
        return tokenRepo.findByToken(token)
                .filter(vt -> vt.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(vt -> {
                    // enable user
                    User u = vt.getUser();
                    u.setEnabled(true);
                    userRepo.save(u);
                    tokenRepo.delete(vt);
                    return true;
                })
                .orElse(false);
    }
}