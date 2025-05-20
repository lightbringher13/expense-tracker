package com.expensetracker.web.controller;

import com.expensetracker.core.model.User;
import com.expensetracker.email.EmailService;
import com.expensetracker.service.AuthService;
import com.expensetracker.service.UserService;
import com.expensetracker.service.VerificationTokenService;
import com.expensetracker.web.dto.RegistrationRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.expensetracker.web.dto.LoginRequest;
import com.expensetracker.web.dto.AuthResponse;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final VerificationTokenService tokenService;
    private final EmailService emailService;
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.authenticate(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegistrationRequest request) {
        // 1) Create the user (enabled=false, password hashed, etc.)
        User user = User.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .fullName(request.getFullName())
                .build();
        User saved = userService.register(user);

        // 2) Generate a verification token
        String token = tokenService.createToken(saved);

        // 3) Send the verification email
        emailService.sendVerificationEmail(saved.getEmail(), token);

        return ResponseEntity.ok("Registration successful! Please check your email to verify.");
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verify(@RequestParam("token") String token) {
        boolean valid = tokenService.validateToken(token);
        if (!valid) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Invalid or expired token.");
        }
        return ResponseEntity.ok("Email verified successfully!");
    }
}