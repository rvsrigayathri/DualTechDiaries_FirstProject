package com.dualtechdiaries.resumeapp.security;

import com.dualtechdiaries.resumeapp.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Service for generating, parsing, and validating JSON Web Tokens (JWT).
 */
@Service
public class JwtService {

    // Default secret must be at least 256 bits (32 bytes) for HMAC-SHA256
    private static final String DEFAULT_SECRET = "resumecraft_production_secure_jwt_signing_key_2026_dualtechdiaries_super_secret";

    private final SecretKey signingKey;
    private final long expirationMillis = 1000L * 60 * 60 * 24 * 7; // 7 days

    public JwtService(@Value("${jwt.secret:${JWT_SECRET:}}") String secret) {
        String effectiveSecret = (secret != null && secret.trim().length() >= 32)
                ? secret.trim()
                : DEFAULT_SECRET;
        this.signingKey = Keys.hmacShaKeyFor(effectiveSecret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Generate JWT for an authenticated user.
     */
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());
        claims.put("fullName", user.getFullName());

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
                .subject(user.getEmail())
                .claims(claims)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(signingKey)
                .compact();
    }

    /**
     * Extracts email (subject) from token.
     */
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    /**
     * Extracts userId from claims.
     */
    public Long extractUserId(String token) {
        Object val = getClaims(token).get("userId");
        if (val instanceof Number num) {
            return num.longValue();
        }
        return null;
    }

    /**
     * Validates if token is unexpired and belongs to the given user email.
     */
    public boolean isTokenValid(String token, User user) {
        try {
            Claims claims = getClaims(token);
            String email = claims.getSubject();
            boolean notExpired = claims.getExpiration().after(new Date());
            return email != null && email.equalsIgnoreCase(user.getEmail()) && notExpired;
        } catch (Exception e) {
            return false;
        }
    }

    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
