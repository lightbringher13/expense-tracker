package com.expensetracker.service.exceptions;

public class TokenAlreadyConsumedException extends RuntimeException {
    public TokenAlreadyConsumedException(String msg) {
        super(msg);
    }
}