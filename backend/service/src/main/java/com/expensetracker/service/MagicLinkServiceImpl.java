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
import com.expensetracker.service.exceptions.TokenExpiredException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;        // ← ADDED
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MagicLinkServiceImpl implements MagicLinkService {
    private final UserRepository userRepo;
    private final VerificationTokenRepository tokenRepo;
    private final EmailService emailService;
    private final JwtProvider jwtProvider;
    private static final Logger logger = LoggerFactory.getLogger(MagicLinkServiceImpl.class);

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
        // First, try to load any token regardless of used/expired status
        Optional<VerificationToken> maybeToken = tokenRepo
            .findByTokenAndType(rawToken, VerificationToken.Type.MAGIC_LINK);

        if (maybeToken.isEmpty()) {
            // No such token exists at all
            logger.debug("consumeTokenAndActivate: no token found for rawToken={}", rawToken);
            throw new InvalidTokenException("verification Token is invalid or does not exist");
        }

        VerificationToken vt = maybeToken.get();

        // If it was already marked as used
        if (vt.getUsedAt() != null) {
            logger.debug("consumeTokenAndActivate: vt.usedAt = {}, throwing TokenAlreadyConsumedException", vt.getUsedAt());
            throw new TokenAlreadyConsumedException("verification token has already been consumed");
        }

        // If it has passed its expiry date
        if (vt.getExpiresAt().isBefore(LocalDateTime.now())) {
            logger.debug("consumeTokenAndActivate: token expired at {}, now={}, throwing TokenExpiredException",
                      vt.getExpiresAt(), LocalDateTime.now());
            throw new TokenExpiredException("verification token has expired");
        }

        // At this point it is guaranteed to be “live and unused”
        vt.setUsedAt(LocalDateTime.now());
        tokenRepo.save(vt);
        logger.debug("consumeTokenAndActivate: marking usedAt={}, saving token", vt.getUsedAt());
        
        User u = vt.getUser();
        u.setEmailVerified(true);
        u.setEnabled(true);
        u.setRegisteredAt(LocalDateTime.now());
        userRepo.save(u);
        logger.debug("consumeTokenAndActivate: activated user id={}", u.getId());

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