// src/main/java/com/expensetracker/repository/VerificationCodeRepository.java
package com.expensetracker.repository;

import com.expensetracker.core.model.VerificationCode;
import com.expensetracker.core.model.CodeType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode,Long> {
    void deleteByExpiresAtBefore(LocalDateTime cutoff);

    Optional<VerificationCode> findByUserIdAndTypeAndCode(
        Long userId, CodeType type, String code);
}