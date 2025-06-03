package com.expensetracker.service;

import com.expensetracker.common.dto.MagicLinkRequest;
import com.expensetracker.core.model.User;
import com.expensetracker.core.model.UserRole;
import com.expensetracker.core.model.VerificationToken;
import com.expensetracker.email.EmailService;
import com.expensetracker.repository.UserRepository;
import com.expensetracker.repository.VerificationTokenRepository;
import com.expensetracker.security.JwtProvider;
import com.expensetracker.service.exceptions.InvalidTokenException;
import com.expensetracker.service.exceptions.TokenAlreadyConsumedException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;        // ← ADDED
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MagicLinkServiceImpl implements MagicLinkService {
    private final UserRepository userRepo;
    private final VerificationTokenRepository tokenRepo;
    private final EmailService emailService;
    private final JwtProvider jwtProvider;

    @Value("${app.base-url}")
    private String baseUrl;

    @Override
    @Transactional
    public void sendMagicLink(MagicLinkRequest req) {
        // purge old tokens                                     // ← CHANGED: moved here for clarity
        tokenRepo.deleteAllByExpiresAtBefore(LocalDateTime.now());

        // find or sign-up minimal user record
        User user = userRepo.findByEmail(req.getEmail())
            .orElseGet(() -> userRepo.save(User.builder()
                .email(req.getEmail())
                .fullName("Unknown")
                .firstName("Unknown")
                .lastName("Unknown")
                .password("Unknown")
                .enabled(false)                           // ← DEFAULT remains false
                .emailVerified(false)                     // ← DEFAULT remains false
                .role(UserRole.USER)
                .build()));

        // remove outstanding magic-link tokens
        tokenRepo.deleteAllByUserAndTypeAndUsedAtIsNull(user, VerificationToken.Type.MAGIC_LINK);

        // create new one
        VerificationToken vt = VerificationToken.builder()
            .user(user)
            .type(VerificationToken.Type.MAGIC_LINK)
            .token(UUID.randomUUID())
            .expiresAt(LocalDateTime.now().plusMinutes(15))
            .build();
        tokenRepo.save(vt);

        // email it
        String link = baseUrl + "/magic-link/confirm?token=" + vt.getToken();
        emailService.sendMagicLink(req.getEmail(), link);
    }

    @Override
    public User loadUserById(Long userId) {
        return userRepo.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + userId));
    }
    
    @Override
    @Transactional
    public User consumeTokenAndActivate(UUID rawToken) {
        LocalDateTime now = LocalDateTime.now();

        int rows = tokenRepo.markUsedIfStillValid(
                rawToken, 
                now,        // :now
                now,        // :usedAt
                VerificationToken.Type.MAGIC_LINK  // :type
                );
                
        if (rows == 0) {
            // either token doesn’t exist, is expired, or was already used
            throw new TokenAlreadyConsumedException("verification token has already been consumed or expired");
        }

        // At this point we know usedAt was just set in DB. Now fetch the token to get its user:
        VerificationToken vt = tokenRepo.findByToken(rawToken)
            .orElseThrow(() -> new InvalidTokenException("Token does not exist"));

        User u = vt.getUser();
        u.setEmailVerified(true);
        u.setEnabled(true);
        u.setRegisteredAt(LocalDateTime.now());
        userRepo.save(u);

        return u;
    }

    @Override                                                   // ← CHANGED: signature
    public String generateAccessToken(User user) {
        return jwtProvider.generateAccessToken(user.getId(), user.getEmail());
    }

    // ⬇️ NEW: scheduled cleanup of expired tokens every hour
    @Scheduled(cron = "0 0 * * * *")                            // ← ADDED
    public void purgeExpiredTokensJob() {
        tokenRepo.deleteAllByExpiresAtBefore(LocalDateTime.now());
    }
}