// com/expensetracker/web/controller/AuthController.java
package com.expensetracker.web.controller;

import jakarta.servlet.http.HttpServletRequest;                                      // ← NEW
import jakarta.servlet.http.HttpServletResponse;                                     // ← NEW
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;                                         // ← NEW
import org.springframework.http.HttpStatus;                                          // ← NEW
import org.springframework.http.ResponseCookie;                                      // ← NEW
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.expensetracker.web.dto.AuthResponse;
import com.expensetracker.common.dto.MagicLinkRequest;
import com.expensetracker.core.model.User;                                           // ← UPDATED import
import com.expensetracker.core.model.RefreshToken;
import com.expensetracker.service.MagicLinkService;
import com.expensetracker.service.RefreshTokenService;                               // ← NEW
import com.expensetracker.security.JwtProvider;                                      // ← NEW
import java.time.Duration;                                                          // ← NEW
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final MagicLinkService    magicLinkSvc;
    private final RefreshTokenService refreshTokenSvc;                               // ← NEW
    private final JwtProvider         jwtProvider;                                   // ← NEW

    @PostMapping("/magic-link")
    public ResponseEntity<Void> send(
        @Valid @RequestBody MagicLinkRequest req
    ) {
        magicLinkSvc.sendMagicLink(req);
        return ResponseEntity.accepted().build();
    }

    /**
     * 1) Consume the magic-link token, activate the user, and return a User object.
     * 2) Issue an access-JWT and a refresh-token cookie.
     */
    @GetMapping("/magic-link/confirm")
    public ResponseEntity<AuthResponse> confirm(
        @RequestParam("token") UUID magicToken,
        HttpServletResponse response                                          // ← NEW
    ) {
        // ← CHANGED: now returns User instead of raw JWT
        User user = magicLinkSvc.consumeTokenAndActivate(magicToken);

        // ← CHANGED: generate a fresh access token
        String accessJwt = magicLinkSvc.generateAccessToken(user);

        // ← NEW: generate & persist refresh token
        RefreshToken rt = refreshTokenSvc.createRefreshToken(user);

        // ← NEW: put refresh-token into an HttpOnly Secure cookie
        ResponseCookie cookie = ResponseCookie.from("refreshToken", rt.getToken())
            .httpOnly(true)
            .secure(true)
            .path("/api/auth/refresh")
            .maxAge(Duration.ofDays(30))
            .sameSite("Strict")
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(new AuthResponse(accessJwt));
    }

    /**
     * Called when access-JWT has expired.
     * Reads the refreshToken cookie, validates it, and issues a new access-JWT.
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
        HttpServletRequest req,
        HttpServletResponse response
    ) {
        String existing = refreshTokenSvc.extractFromCookie(req);
        if (existing == null || !refreshTokenSvc.validateAndConsume(existing)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // ← CHANGED: extract userId from refresh token, then load User
        Long userId = jwtProvider.getUserIdFromRefreshToken(existing);
        User user   = magicLinkSvc.loadUserById(userId);

        String newAccess = jwtProvider.generateAccessToken(user.getId(), user.getEmail());
        RefreshToken newRt = refreshTokenSvc.createRefreshToken(user);
        refreshTokenSvc.attachCookie(response, newRt.getToken());

        return ResponseEntity.ok(new AuthResponse(newAccess));
    }

    /**
     *  Invalidate the refresh token and clear the cookie.
     */
    @PostMapping("/logout")                                                    // ← NEW
    public ResponseEntity<Void> logout(
        HttpServletRequest request,
        HttpServletResponse response
    ) {
        String refreshJwt = refreshTokenSvc.extractFromCookie(request);
        refreshTokenSvc.revokeRefreshToken(refreshJwt);

        // ← NEW: clear the cookie
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
            .httpOnly(true)
            .secure(true)
            .path("/api/auth/refresh")
            .maxAge(0)
            .sameSite("Strict")
            .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.noContent().build();
    }
}