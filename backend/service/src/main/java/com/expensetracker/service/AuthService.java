package com.expensetracker.service;

public interface AuthService {
    String authenticate(String email, String password);
}