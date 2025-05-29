// service/src/main/java/com/expensetracker/service/RefreshTokenService.java
package com.expensetracker.service;

import com.expensetracker.core.model.RefreshToken;
import com.expensetracker.core.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface RefreshTokenService {

    /**
     * Generates & persists a refresh-token JWT for the given user,
     * writes it into an HttpOnly cookie on the response, and returns
     * the saved RefreshToken entity.
     */
    RefreshToken createRefreshToken(User user);

    /**
     * Validates the raw JWT string & ensures the corresponding RefreshToken record
     * isn’t revoked or expired. Returns true if it’s valid.
     */
    boolean validateAndConsume(String token);

    /**
     * Marks the given refresh-token string as revoked in the database.
     */
    void revokeRefreshToken(String token);

    /**
     * Reads the raw refresh-token JWT out of the HttpOnly cookie on the request.
     */
    String extractFromCookie(HttpServletRequest request);

    /**
     * Attaches a refresh-token JWT into an HttpOnly cookie on the response.
     */
    void attachCookie(HttpServletResponse response, String token);
}