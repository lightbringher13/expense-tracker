package com.expensetracker.core.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "verification_codes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VerificationCode {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private User user;

    @Column(nullable = false, length = 6)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CodeType type;

    @Column(nullable = false)
    private LocalDateTime expiresAt;
}
