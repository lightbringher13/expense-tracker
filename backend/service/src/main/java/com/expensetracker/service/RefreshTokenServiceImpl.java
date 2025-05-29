// service/src/main/java/com/expensetracker/service/impl/RefreshTokenServiceImpl.java
package com.expensetracker.service;

import com.expensetracker.core.model.RefreshToken;
import com.expensetracker.core.model.User;
import com.expensetracker.repository.RefreshTokenRepository;
import com.expensetracker.security.JwtProvider;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository repo;
    private final JwtProvider jwtProvider;

    @Override
    public RefreshToken createRefreshToken(User user) {
        // 1) generate raw JWT
        String token = jwtProvider.generateRefreshToken(user.getId());

        // 2) persist in DB
        RefreshToken rt = RefreshToken.builder()
            .user(user)
            .token(token)
            .issuedAt(LocalDateTime.now())
            .expiresAt(LocalDateTime.now()
                .plus(Duration.ofMillis(jwtProvider.getRefreshTokenExpirationMs())))
            .build();

        return repo.save(rt);
    }

    @Override
    public boolean validateAndConsume(String token) {
        // quick JWT signature/expiry check
        if (!jwtProvider.validateRefreshToken(token)) {
            return false;
        }
        // load DB record
        RefreshToken rt = repo.findByToken(token)
            .orElseThrow(() -> new IllegalArgumentException("Unknown refresh token"));
        // check not expired or already revoked
        if (rt.getRevokedAt() != null || rt.getExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }
        // (optional) rotate token here if desired
        return true;
    }

    @Override
    public void revokeRefreshToken(String token) {
        repo.findByToken(token).ifPresent(rt -> {
            rt.setRevokedAt(LocalDateTime.now());
            repo.save(rt);
        });
    }

    @Override
    public String extractFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return null;
        for (Cookie c : request.getCookies()) {
            if ("refreshToken".equals(c.getName())) {
                return c.getValue();
            }
        }
        return null;
    }

    @Override
    public void attachCookie(HttpServletResponse response, String token) {
        Cookie cookie = new Cookie("refreshToken", token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setMaxAge((int)(jwtProvider.getRefreshTokenExpirationMs() / 1000));
        response.addCookie(cookie);
    }
}