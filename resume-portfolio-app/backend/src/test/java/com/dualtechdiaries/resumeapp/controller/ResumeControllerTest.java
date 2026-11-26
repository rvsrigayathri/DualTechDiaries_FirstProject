package com.dualtechdiaries.resumeapp.controller;

import com.dualtechdiaries.resumeapp.repository.ProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

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
}
