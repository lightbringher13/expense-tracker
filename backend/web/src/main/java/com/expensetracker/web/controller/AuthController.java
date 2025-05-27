package com.expensetracker.web.controller;

import com.expensetracker.repository.dto.RegistrationRequest;
import com.expensetracker.service.AuthService;
import com.expensetracker.service.ConfirmationService;
import com.expensetracker.service.RegistrationService;
import com.expensetracker.repository.dto.CodeConfirmationRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.expensetracker.web.dto.LoginRequest;
import com.expensetracker.web.dto.AuthResponse;
import lombok.extern.slf4j.Slf4j; 

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j 
public class AuthController {

    private final AuthService authService;
    private final ConfirmationService confirmationService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        String token = authService.authenticate(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    private final RegistrationService regService;

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegistrationRequest req) {
        regService.registerAndSendCodes(req);
        return ResponseEntity
            .status(HttpStatus.ACCEPTED)
            .body("Registration started—you’ll receive email & SMS PINs shortly.");
    }

    @PostMapping("/confirm-email")
    public ResponseEntity<String> confirmEmail(
            @RequestParam Long userId,
            @RequestParam String code) {

        // wrap into DTO:
        CodeConfirmationRequest dto = new CodeConfirmationRequest();
        dto.setUserId(userId);
        dto.setCode(code);

        boolean ok = confirmationService.confirmEmail(dto);
        if (!ok) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Invalid or expired email code.");
        }
        return ResponseEntity.ok("Email confirmed.");
    }

}