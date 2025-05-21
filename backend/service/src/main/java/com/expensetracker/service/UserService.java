package com.expensetracker.service;

import java.util.Optional;

import com.expensetracker.core.model.User;

public interface UserService {
    User register(User user);
    Optional<User> findByEmail(String email);
}