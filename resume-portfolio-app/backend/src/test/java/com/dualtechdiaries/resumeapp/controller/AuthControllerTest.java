package com.dualtechdiaries.resumeapp.controller;

import com.dualtechdiaries.resumeapp.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void register_withValidData_createsUserAndReturnsJwtToken() throws Exception {
        String payload = """
            {
              "fullName": "Alice Johnson",
              "email": "alice@example.com",
              "password": "Password123!",
              "confirmPassword": "Password123!"
            }
            """;

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.user.email").value("alice@example.com"))
                .andExpect(jsonPath("$.user.fullName").value("Alice Johnson"))
                .andExpect(jsonPath("$.user.passwordHash").doesNotExist()) // Never expose password hash!
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        assertNotNull(json.get("token").asText());
        assertTrue(userRepository.existsByEmail("alice@example.com"));
    }

    @Test
    void register_withDuplicateEmail_rejectsWithConflictStatus() throws Exception {
        String payload = """
            {
              "fullName": "Alice Johnson",
              "email": "alice@example.com",
              "password": "Password123!"
            }
            """;

        // First registration
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isCreated());

        // Duplicate registration attempt
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.message").value("An account with this email address already exists."));
    }

    @Test
    void register_withWeakPassword_rejectsWithBadRequest() throws Exception {
        String payload = """
            {
              "fullName": "Shorty",
              "email": "short@example.com",
              "password": "123"
            }
            """;

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.message").value("Password must be at least 6 characters long."));
    }

    @Test
    void login_withValidCredentials_returnsTokenAndUser() throws Exception {
        // Register user first
        String regPayload = """
            {
              "fullName": "Bob Smith",
              "email": "bob@example.com",
              "password": "SecretPassword123"
            }
            """;
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(regPayload))
                .andExpect(status().isCreated());

        // Login
        String loginPayload = """
            {
              "email": "bob@example.com",
              "password": "SecretPassword123"
            }
            """;
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.user.email").value("bob@example.com"))
                .andExpect(jsonPath("$.user.fullName").value("Bob Smith"));
    }

    @Test
    void login_withIncorrectPassword_returnsUnauthorized() throws Exception {
        String regPayload = """
            {
              "fullName": "Bob Smith",
              "email": "bob@example.com",
              "password": "CorrectPassword123"
            }
            """;
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(regPayload))
                .andExpect(status().isCreated());

        String loginPayload = """
            {
              "email": "bob@example.com",
              "password": "WrongPassword999"
            }
            """;
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginPayload))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value("error"))
                .andExpect(jsonPath("$.message").value("Invalid email or password."));
    }

    @Test
    void getCurrentUser_withJwtToken_returnsUserData() throws Exception {
        String regPayload = """
            {
              "fullName": "Carol Danvers",
              "email": "carol@example.com",
              "password": "SuperSecretPassword"
            }
            """;
        MvcResult regResult = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(regPayload))
                .andExpect(status().isCreated())
                .andReturn();

        String token = objectMapper.readTree(regResult.getResponse().getContentAsString()).get("token").asText();

        // Call /api/auth/me with Bearer token
        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.user.email").value("carol@example.com"))
                .andExpect(jsonPath("$.user.fullName").value("Carol Danvers"));
    }

    @Test
    void forgotPassword_and_resetPassword_flowWorks() throws Exception {
        // 1. Register user
        String regPayload = """
            {
              "fullName": "David Miller",
              "email": "david@example.com",
              "password": "OldPassword123"
            }
            """;
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(regPayload))
                .andExpect(status().isCreated());

        // 2. Request forgot password
        String forgotPayload = """
            {
              "email": "david@example.com"
            }
            """;
        MvcResult forgotResult = mockMvc.perform(post("/api/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(forgotPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.emailServiceStatus").value("pending_configuration"))
                .andExpect(jsonPath("$.resetToken").exists())
                .andReturn();

        String resetToken = objectMapper.readTree(forgotResult.getResponse().getContentAsString()).get("resetToken").asText();
        assertNotNull(resetToken);

        // 3. Reset password using token
        String resetPayload = String.format("""
            {
              "token": "%s",
              "newPassword": "BrandNewPassword123",
              "confirmPassword": "BrandNewPassword123"
            }
            """, resetToken);

        mockMvc.perform(post("/api/auth/reset-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(resetPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));

        // 4. Verify login succeeds with the NEW password
        String newLoginPayload = """
            {
              "email": "david@example.com",
              "password": "BrandNewPassword123"
            }
            """;
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(newLoginPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"));
    }
}
