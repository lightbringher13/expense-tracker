// repository/src/main/java/com/expensetracker/repository/VerificationTokenRepository.java
package com.expensetracker.repository;

import com.expensetracker.core.model.VerificationToken;
import com.expensetracker.core.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
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
}