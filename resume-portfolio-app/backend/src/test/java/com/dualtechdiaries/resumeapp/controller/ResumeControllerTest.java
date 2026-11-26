package com.dualtechdiaries.resumeapp.controller;

import com.dualtechdiaries.resumeapp.model.User;
import com.dualtechdiaries.resumeapp.repository.ProfileRepository;
import com.dualtechdiaries.resumeapp.repository.UserRepository;
import com.dualtechdiaries.resumeapp.security.JwtService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ResumeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private User userA;
    private String tokenA;

    private User userB;
    private String tokenB;

    @BeforeEach
    void setUp() {
        profileRepository.deleteAll();
        userRepository.deleteAll();

        // Seed User A
        userA = new User("Sarah Connor", "sarah@cyberdyne.org", passwordEncoder.encode("Password123!"));
        userA = userRepository.save(userA);
        tokenA = jwtService.generateToken(userA);

        // Seed User B
        userB = new User("John Connor", "john@resistance.org", passwordEncoder.encode("Password123!"));
        userB = userRepository.save(userB);
        tokenB = jwtService.generateToken(userB);
    }

    @Test
    void unauthenticatedRequests_rejectedWith401Unauthorized() throws Exception {
        mockMvc.perform(get("/api/resume/latest"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value("unauthorized"));

        mockMvc.perform(post("/api/resume/save")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getResumeApiInfo_whenAuthenticated_returnsRootEndpointDiscovery() throws Exception {
        mockMvc.perform(get("/api/resume")
                .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").exists())
                .andExpect(jsonPath("$.currentUser").value("sarah@cyberdyne.org"))
                .andExpect(jsonPath("$.endpoints").isArray());
    }

    @Test
    void getLatestResume_whenEmptyForUser_returns404WithStructuredMessage() throws Exception {
        mockMvc.perform(get("/api/resume/latest")
                .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value("not_found"))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void postSave_and_getLatest_exactRoutesWorkAsExpectedForAuthenticatedUser() throws Exception {
        String payload = """
            {
              "fullName": "Sarah Connor",
              "email": "sarah@cyberdyne.org",
              "desiredRole": "Security Specialist",
              "targetTemplate": "ats_professional",
              "resumeJson": "{\\"personal\\":{\\"fullName\\":\\"Sarah Connor\\"}}"
            }
            """;

        // 1. Verify POST /api/resume/save
        mockMvc.perform(post("/api/resume/save")
                .header("Authorization", "Bearer " + tokenA)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("saved"))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.message").value("Resume saved successfully to database"));

        // 2. Verify GET /api/resume/latest
        mockMvc.perform(get("/api/resume/latest")
                .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Sarah Connor"))
                .andExpect(jsonPath("$.email").value("sarah@cyberdyne.org"))
                .andExpect(jsonPath("$.desiredRole").value("Security Specialist"))
                .andExpect(jsonPath("$.targetTemplate").value("ats_professional"));

        // 3. Verify trailing slash routes also match correctly
        mockMvc.perform(get("/api/resume/latest/")
                .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Sarah Connor"));

        // 4. Verify GET /api/resume/my
        mockMvc.perform(get("/api/resume/my")
                .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].fullName").value("Sarah Connor"));
    }

    @Test
    void userIsolation_userBCannotAccessOrModifyUserAResume() throws Exception {
        // User A creates a resume
        String payloadA = """
            {
              "fullName": "Sarah Connor",
              "email": "sarah@cyberdyne.org",
              "desiredRole": "Security Specialist",
              "targetTemplate": "ats_professional",
              "resumeJson": "{\\"secret\\":\\"confidential_resistance_plans\\"}"
            }
            """;

        MvcResult resultA = mockMvc.perform(post("/api/resume/save")
                .header("Authorization", "Bearer " + tokenA)
                .contentType(MediaType.APPLICATION_JSON)
                .content(payloadA))
                .andExpect(status().isOk())
                .andReturn();

        long resumeIdA = objectMapper.readTree(resultA.getResponse().getContentAsString()).get("id").asLong();

        // 1. User B tries to view User A's resume by ID -> 403 Forbidden
        mockMvc.perform(get("/api/resume/" + resumeIdA)
                .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value("forbidden"));

        // 2. User B tries to overwrite User A's resume -> 403 Forbidden
        String maliciousPayload = String.format("""
            {
              "id": %d,
              "fullName": "Hacked",
              "email": "hacker@evil.org",
              "desiredRole": "Imposter",
              "targetTemplate": "ats_professional",
              "resumeJson": "{\\"hacked\\":true}"
            }
            """, resumeIdA);

        mockMvc.perform(post("/api/resume/save")
                .header("Authorization", "Bearer " + tokenB)
                .contentType(MediaType.APPLICATION_JSON)
                .content(maliciousPayload))
                .andExpect(status().isForbidden());

        // 3. User B calls /api/resume/latest -> 404 (does NOT see User A's resume)
        mockMvc.perform(get("/api/resume/latest")
                .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isNotFound());

        // 4. User B calls /api/resume/my -> returns empty list
        mockMvc.perform(get("/api/resume/my")
                .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));

        // 5. User B tries to delete User A's resume -> 403 Forbidden
        mockMvc.perform(delete("/api/resume/" + resumeIdA)
                .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isForbidden());
    }

    @Test
    void saveResume_whenSavedMultipleTimes_updatesExistingRecordWithoutChangingIdAndPreservesPhoto() throws Exception {
        String firstSavePayload = """
            {
              "fullName": "Elena Fisher",
              "email": "sarah@cyberdyne.org",
              "desiredRole": "Journalist",
              "targetTemplate": "creative_designer",
              "resumeJson": "{\\"personal\\":{\\"fullName\\":\\"Elena Fisher\\",\\"photoUrl\\":\\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBD...photo...\\"}}"
            }
            """;

        // 1. First save creates the record
        MvcResult firstResult = mockMvc.perform(post("/api/resume/save")
                .header("Authorization", "Bearer " + tokenA)
                .contentType(MediaType.APPLICATION_JSON)
                .content(firstSavePayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("saved"))
                .andExpect(jsonPath("$.id").exists())
                .andReturn();

        JsonNode firstJson = objectMapper.readTree(firstResult.getResponse().getContentAsString());
        long originalId = firstJson.get("id").asLong();
        assertEquals(1, profileRepository.count(), "Database should have exactly 1 record after first save");

        // 2. Second save with explicit ID updates the record without creating a new row
        String secondSaveWithId = String.format("""
            {
              "id": %d,
              "fullName": "Elena Fisher",
              "email": "sarah@cyberdyne.org",
              "desiredRole": "Senior Investigative Journalist",
              "targetTemplate": "modern_executive",
              "resumeJson": "{\\"personal\\":{\\"fullName\\":\\"Elena Fisher\\",\\"photoUrl\\":\\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBD...photo...\\"}}"
            }
            """, originalId);

        mockMvc.perform(post("/api/resume/save")
                .header("Authorization", "Bearer " + tokenA)
                .contentType(MediaType.APPLICATION_JSON)
                .content(secondSaveWithId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("saved"))
                .andExpect(jsonPath("$.id").value(originalId));

        assertEquals(1, profileRepository.count(), "Database should still have exactly 1 record after second save with ID");

        // 3. Verify latest draft returns updated role and preserved photo data
        MvcResult latestResult = mockMvc.perform(get("/api/resume/latest")
                .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(originalId))
                .andExpect(jsonPath("$.desiredRole").value("Senior Investigative Journalist"))
                .andReturn();

        JsonNode latestJson = objectMapper.readTree(latestResult.getResponse().getContentAsString());
        String resumeJsonStr = latestJson.get("resumeJson").asText();
        assertTrue(resumeJsonStr.contains("data:image/jpeg;base64"), "Profile photo data must be preserved in resumeJson");
    }
}
