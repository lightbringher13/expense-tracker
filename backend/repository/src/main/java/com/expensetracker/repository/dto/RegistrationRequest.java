package com.expensetracker.repository.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationRequest {

    @NotBlank @Email
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String fullName;
}