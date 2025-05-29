package com.expensetracker.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {

    @Value("${jwt.access-token-secret}")
    private String accessSecret;

    @Value("${jwt.refresh-token-secret}")
    private String refreshSecret;

    @Value("${jwt.access-token-exp-ms}")
    private long accessTokenExpirationMs;

    @Value("${jwt.refresh-token-exp-ms}")
    private long refreshTokenExpirationMs;

    private Key accessKey;
    private Key refreshKey;

    @PostConstruct
    public void init() {
        this.accessKey  = Keys.hmacShaKeyFor(accessSecret.getBytes());
        this.refreshKey = Keys.hmacShaKeyFor(refreshSecret.getBytes());
    }

    /** expose the configured refresh-token TTL */
    public long getRefreshTokenExpirationMs() {
        return refreshTokenExpirationMs;
    }

    /** (optional) expose the access-token TTL too */
    public long getAccessTokenExpirationMs() {
        return accessTokenExpirationMs;
    }
    
    public String generateAccessToken(Long userId, String email) {
        Date now = new Date();
        return Jwts.builder()
            .setSubject(userId.toString())
            .claim("email", email)
            .setIssuedAt(now)
            .setExpiration(new Date(now.getTime() + accessTokenExpirationMs))
            .signWith(accessKey, SignatureAlgorithm.HS512)
            .compact();
    }

    public boolean validateAccessToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(accessKey)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Long getUserIdFromAccessToken(String token) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(accessKey)
            .build()
            .parseClaimsJws(token)
            .getBody();
        return Long.valueOf(claims.getSubject());
    }

    public String generateRefreshToken(Long userId) {
        Date now = new Date();
        return Jwts.builder()
            .setSubject(userId.toString())
            .setIssuedAt(now)
            .setExpiration(new Date(now.getTime() + refreshTokenExpirationMs))
            .signWith(refreshKey, SignatureAlgorithm.HS512)
            .compact();
    }

    public boolean validateRefreshToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(refreshKey)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public Long getUserIdFromRefreshToken(String token) {
        Claims claims = Jwts.parserBuilder()
            .setSigningKey(refreshKey)
            .build()
            .parseClaimsJws(token)
            .getBody();
        return Long.valueOf(claims.getSubject());
    }
}