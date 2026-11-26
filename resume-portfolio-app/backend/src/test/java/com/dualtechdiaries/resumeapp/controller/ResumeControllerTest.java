package com.dualtechdiaries.resumeapp.controller;

import com.dualtechdiaries.resumeapp.repository.ProfileRepository;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ResumeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProfileRepository profileRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        profileRepository.deleteAll();
    }

    @Test
    void getResumeApiInfo_returnsRootEndpointDiscovery() throws Exception {
        mockMvc.perform(get("/api/resume"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("Resume persistence API is active"))
                .andExpect(jsonPath("$.endpoints").isArray());
    }

    @Test
    void getLatestResume_whenEmpty_returns404WithStructuredMessage() throws Exception {
        mockMvc.perform(get("/api/resume/latest"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value("not_found"))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void postSave_and_getLatest_exactRoutesWorkAsExpected() throws Exception {
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
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("saved"))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.message").value("Resume saved successfully to database"));

        // 2. Verify GET /api/resume/latest
        mockMvc.perform(get("/api/resume/latest"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Sarah Connor"))
                .andExpect(jsonPath("$.email").value("sarah@cyberdyne.org"))
                .andExpect(jsonPath("$.desiredRole").value("Security Specialist"))
                .andExpect(jsonPath("$.targetTemplate").value("ats_professional"));

        // 3. Verify trailing slash routes also match correctly
        mockMvc.perform(get("/api/resume/latest/"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Sarah Connor"));

        // 4. Verify GET /api/resume/all
        mockMvc.perform(get("/api/resume/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].fullName").value("Sarah Connor"));
    }

    @Test
    void saveResume_whenSavedMultipleTimes_updatesExistingRecordWithoutChangingIdAndPreservesPhoto() throws Exception {
        String firstSavePayload = """
            {
              "fullName": "Elena Fisher",
              "email": "elena@uncharted.com",
              "desiredRole": "Journalist",
              "targetTemplate": "creative_designer",
              "resumeJson": "{\\"personal\\":{\\"fullName\\":\\"Elena Fisher\\",\\"photoUrl\\":\\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBD...photo...\\"}}"
            }
            """;

        // 1. First save creates the record
        MvcResult firstResult = mockMvc.perform(post("/api/resume/save")
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
              "email": "elena@uncharted.com",
              "desiredRole": "Senior Investigative Journalist",
              "targetTemplate": "modern_executive",
              "resumeJson": "{\\"personal\\":{\\"fullName\\":\\"Elena Fisher\\",\\"photoUrl\\":\\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBD...photo...\\"}}"
            }
            """, originalId);

        MvcResult secondResult = mockMvc.perform(post("/api/resume/save")
                .contentType(MediaType.APPLICATION_JSON)
                .content(secondSaveWithId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("saved"))
                .andExpect(jsonPath("$.id").value(originalId))
                .andReturn();

        assertEquals(1, profileRepository.count(), "Database should still have exactly 1 record after second save with ID");

        // 3. Third save without sending ID updates existing record by finding existing profile
        String thirdSaveWithoutId = """
            {
              "fullName": "Elena Fisher",
              "email": "elena@uncharted.com",
              "desiredRole": "Lead Media Director",
              "targetTemplate": "modern_executive",
              "resumeJson": "{\\"personal\\":{\\"fullName\\":\\"Elena Fisher\\",\\"photoUrl\\":\\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBD...photo...\\"}}"
            }
            """;

        mockMvc.perform(post("/api/resume/save")
                .contentType(MediaType.APPLICATION_JSON)
                .content(thirdSaveWithoutId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("saved"))
                .andExpect(jsonPath("$.id").value(originalId));

        assertEquals(1, profileRepository.count(), "Database must still have exactly 1 record after third save without ID");

        // 4. Verify latest draft returns updated role and preserved photo data
        MvcResult latestResult = mockMvc.perform(get("/api/resume/latest"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(originalId))
                .andExpect(jsonPath("$.desiredRole").value("Lead Media Director"))
                .andReturn();

        JsonNode latestJson = objectMapper.readTree(latestResult.getResponse().getContentAsString());
        String resumeJsonStr = latestJson.get("resumeJson").asText();
        assertTrue(resumeJsonStr.contains("data:image/jpeg;base64"), "Profile photo data must be preserved in resumeJson");
    }
}
