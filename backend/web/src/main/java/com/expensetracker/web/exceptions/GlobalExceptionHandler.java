// web/src/main/java/com/expensetracker/web/exception/GlobalExceptionHandler.java
package com.expensetracker.web.exceptions;

import com.expensetracker.service.exceptions.InvalidTokenException;
import com.expensetracker.service.exceptions.TokenAlreadyConsumedException;
import com.expensetracker.service.exceptions.TokenExpiredException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<Map<String, String>> handleInvalidToken(InvalidTokenException ex) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(Map.of(
                "error",   "INVALID_TOKEN",
                "message", ex.getMessage()
            ));
    }

    @ExceptionHandler(TokenExpiredException.class)
    public ResponseEntity<Map<String, String>> handleTokenExpired(TokenExpiredException ex) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(Map.of(
                "error",   "TOKEN_EXPIRED",
                "message", ex.getMessage()
            ));
    }

    @ExceptionHandler(TokenAlreadyConsumedException.class)
    public ResponseEntity<Map<String, String>> handleAlreadyConsumed(TokenAlreadyConsumedException ex) {
        return ResponseEntity
            .status(HttpStatus.CONFLICT)
            .body(Map.of(
                "error",   "TOKEN_ALREADY_CONSUMED",
                "message", ex.getMessage()
            ));
    }

    // (Optional) catch any other IllegalArgumentException
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(Map.of(
                "error",   "BAD_ARGUMENT",
                "message", ex.getMessage()
            ));
    }
}