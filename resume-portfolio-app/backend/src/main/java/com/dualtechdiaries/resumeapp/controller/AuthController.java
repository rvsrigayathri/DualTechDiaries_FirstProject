package com.dualtechdiaries.resumeapp.controller;

import com.dualtechdiaries.resumeapp.model.User;
import com.dualtechdiaries.resumeapp.repository.UserRepository;
import com.dualtechdiaries.resumeapp.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

/**
 * Controller for user authentication, registration, session check, and password recovery.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public static class RegisterRequest {
        public String fullName;
        public String email;
        public String password;
        public String confirmPassword;
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class ForgotPasswordRequest {
        public String email;
    }

    public static class ResetPasswordRequest {
        public String token;
        public String newPassword;
        public String confirmPassword;
    }

    /**
     * POST /api/auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody RegisterRequest req) {
        Map<String, Object> resp = new HashMap<>();

        if (req.fullName == null || req.fullName.trim().isEmpty()) {
            resp.put("status", "error");
            resp.put("message", "Full name is required.");
            return ResponseEntity.badRequest().body(resp);
        }

        if (req.email == null || !EMAIL_PATTERN.matcher(req.email.trim()).matches()) {
            resp.put("status", "error");
            resp.put("message", "Please enter a valid email address.");
            return ResponseEntity.badRequest().body(resp);
        }

        String email = req.email.trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            resp.put("status", "error");
            resp.put("message", "An account with this email address already exists.");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(resp);
        }

        if (req.password == null || req.password.trim().length() < 6) {
            resp.put("status", "error");
            resp.put("message", "Password must be at least 6 characters long.");
            return ResponseEntity.badRequest().body(resp);
        }

        if (req.confirmPassword != null && !req.password.equals(req.confirmPassword)) {
            resp.put("status", "error");
            resp.put("message", "Passwords do not match.");
            return ResponseEntity.badRequest().body(resp);
        }

        // Hash password with BCrypt
        String hashedPassword = passwordEncoder.encode(req.password);
        User user = new User(req.fullName.trim(), email, hashedPassword);
        User saved = userRepository.save(user);

        // Generate JWT token
        String token = jwtService.generateToken(saved);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", saved.getId());
        userData.put("fullName", saved.getFullName());
        userData.put("email", saved.getEmail());

        resp.put("status", "success");
        resp.put("message", "Account created successfully.");
        resp.put("token", token);
        resp.put("user", userData);

        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    /**
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest req) {
        Map<String, Object> resp = new HashMap<>();

        if (req.email == null || req.email.trim().isEmpty() || req.password == null || req.password.isEmpty()) {
            resp.put("status", "error");
            resp.put("message", "Email and password are required.");
            return ResponseEntity.badRequest().body(resp);
        }

        String email = req.email.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty() || !passwordEncoder.matches(req.password, userOpt.get().getPasswordHash())) {
            resp.put("status", "error");
            resp.put("message", "Invalid email or password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
        }

        User user = userOpt.get();
        String token = jwtService.generateToken(user);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("fullName", user.getFullName());
        userData.put("email", user.getEmail());

        resp.put("status", "success");
        resp.put("token", token);
        resp.put("user", userData);

        return ResponseEntity.ok(resp);
    }

    /**
     * GET /api/auth/me - Returns authenticated user details from SecurityContext
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        Map<String, Object> resp = new HashMap<>();
        if (authentication == null || !(authentication.getPrincipal() instanceof User user)) {
            resp.put("status", "unauthorized");
            resp.put("message", "No authenticated session found.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(resp);
        }

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("fullName", user.getFullName());
        userData.put("email", user.getEmail());

        resp.put("status", "success");
        resp.put("user", userData);
        return ResponseEntity.ok(resp);
    }

    /**
     * POST /api/auth/forgot-password
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestBody ForgotPasswordRequest req) {
        Map<String, Object> resp = new HashMap<>();

        if (req.email == null || req.email.trim().isEmpty()) {
            resp.put("status", "error");
            resp.put("message", "Please enter your email address.");
            return ResponseEntity.badRequest().body(resp);
        }

        String email = req.email.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            // Secure response to avoid user enumeration
            resp.put("status", "success");
            resp.put("message", "If an account exists with this email, password reset instructions have been generated.");
            return ResponseEntity.ok(resp);
        }

        User user = userOpt.get();
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        resp.put("status", "success");
        resp.put("message", "Password reset initiated successfully.");
        // Explicitly identify email delivery status as requested
        resp.put("emailServiceStatus", "pending_configuration");
        resp.put("resetToken", token);
        resp.put("notice", "Direct email dispatch is currently pending SMTP configuration. Your active password reset token has been provided above for verification.");

        return ResponseEntity.ok(resp);
    }

    /**
     * POST /api/auth/reset-password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestBody ResetPasswordRequest req) {
        Map<String, Object> resp = new HashMap<>();

        if (req.token == null || req.token.trim().isEmpty()) {
            resp.put("status", "error");
            resp.put("message", "Reset token is required.");
            return ResponseEntity.badRequest().body(resp);
        }

        if (req.newPassword == null || req.newPassword.trim().length() < 6) {
            resp.put("status", "error");
            resp.put("message", "New password must be at least 6 characters long.");
            return ResponseEntity.badRequest().body(resp);
        }

        if (req.confirmPassword != null && !req.newPassword.equals(req.confirmPassword)) {
            resp.put("status", "error");
            resp.put("message", "Passwords do not match.");
            return ResponseEntity.badRequest().body(resp);
        }

        Optional<User> userOpt = userRepository.findByResetToken(req.token.trim());
        if (userOpt.isEmpty()) {
            resp.put("status", "error");
            resp.put("message", "Invalid or expired password reset token.");
            return ResponseEntity.badRequest().body(resp);
        }

        User user = userOpt.get();
        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            resp.put("status", "error");
            resp.put("message", "Password reset token has expired. Please request a new one.");
            return ResponseEntity.badRequest().body(resp);
        }

        // Update password
        user.setPasswordHash(passwordEncoder.encode(req.newPassword.trim()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        resp.put("status", "success");
        resp.put("message", "Your password has been successfully reset. You can now log in with your new password.");
        return ResponseEntity.ok(resp);
    }
}
