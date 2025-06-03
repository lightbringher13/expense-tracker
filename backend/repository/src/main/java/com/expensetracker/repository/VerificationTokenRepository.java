// repository/src/main/java/com/expensetracker/repository/VerificationTokenRepository.java
package com.expensetracker.repository;

import com.expensetracker.core.model.VerificationToken;
import com.expensetracker.core.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    /** Clean up old tokens */
    void deleteAllByExpiresAtBefore(LocalDateTime cutoff);

    // CLEANUP all outstanding unused MAGIC_LINK tokens for this user
    void deleteAllByUserAndTypeAndUsedAtIsNull(User user, VerificationToken.Type type);

    // find exactly one live, unused MAGIC_LINK token
    Optional<VerificationToken> findByTokenAndTypeAndUsedAtIsNullAndExpiresAtAfter(
        UUID token, VerificationToken.Type type, LocalDateTime now
    );
    
    // ◀─ NEW: find any token (used or not, expired or not) so we can inspect its fields
    Optional<VerificationToken> findByTokenAndType(
        UUID token, VerificationToken.Type type
    );

    // 2. A finder by token
    Optional<VerificationToken> findByToken(UUID token);

    //update right away
    @Modifying
    @Query("""
        UPDATE VerificationToken vt
           SET vt.usedAt = :usedAt
         WHERE vt.token = :token
           AND vt.type = :type
           AND vt.expiresAt > :now
           AND vt.usedAt IS NULL
        """)
    int markUsedIfStillValid(
        @Param("token")  UUID token,
        @Param("now")    LocalDateTime now,
        @Param("usedAt") LocalDateTime usedAt,
        @Param("type")   VerificationToken.Type type
    );
}