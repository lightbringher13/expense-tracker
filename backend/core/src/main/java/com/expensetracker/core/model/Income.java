package com.expensetracker.core.model;

import jakarta.persistence.*;
import lombok.*;
import com.expensetracker.core.model.vo.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "incomes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Income {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Embedded
    private Money amount;        // reuse your Money VO

    @Column(length = 255)
    private String source;       // e.g. “Salary”, “Freelance”

    @Column(name = "received_at", nullable = false)
    private LocalDateTime receivedAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}