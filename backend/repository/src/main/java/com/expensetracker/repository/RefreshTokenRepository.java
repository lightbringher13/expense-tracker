// repository/src/main/java/com/expensetracker/repository/RefreshTokenRepository.java
package com.expensetracker.repository;

import com.expensetracker.core.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
}