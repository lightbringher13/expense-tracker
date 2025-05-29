// core/src/main/java/com/expensetracker/core/model/VerificationToken.java
package com.expensetracker.core.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "verification_tokens")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VerificationToken {
    public enum Type { MAGIC_LINK, RESET_PASSWORD }

    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** single-use UUID token */
    @Column(nullable = false, unique = true, updatable = false)
    private UUID token;

    /** who this token belongs to */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    /** what kind of token this is */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private Type type;

    /** when it expires */
    @Column(nullable = false)
    private LocalDateTime expiresAt;

    /** when it was used (to enforce one-time-only) */
    private LocalDateTime usedAt;

    private LocalDateTime revokedAt;
}