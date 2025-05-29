// service/src/main/java/com/expensetracker/service/MagicLinkService.java
package com.expensetracker.service;

import com.expensetracker.core.model.User;
import com.expensetracker.common.dto.MagicLinkRequest;

import java.util.UUID;

public interface MagicLinkService {

    /** Send a one-time login link to the user’s email. */
    void sendMagicLink(MagicLinkRequest req);

    /** Consume the raw token, mark the user active, and return the User. */               // ← ADDED
    User consumeTokenAndActivate(UUID token);

    /** Generate a short-lived access-JWT for an already-authenticated user. */           // ← ADDED
    String generateAccessToken(User user);

    User loadUserById(Long userId); 
}